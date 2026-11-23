import React, { useState, useRef, useEffect } from 'react';
import type { Player, PlayerProfile } from '../../types/game';
import { 
  LogOut, 
  Camera, 
  Menu, 
  Check,
  RefreshCw,
  BookOpen,
  X,
  UserCheck
} from 'lucide-react';
import { 
  InfiltratorHat,
  MysteryCardsHandGraphic
} from '../common/UndercoverIcons';
import { soundEffects, triggerHaptic } from '../../utils/audio';
import { processImageFile } from '../../utils/imageUpload';

interface WordRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  allPlayers?: Player[];
  isCardRevealed: boolean;
  partnerPlayer?: Player | null;
  undercoverCount: number;
  mrWhiteCount: number;
  activeSpecialRoles: string[];
  savedProfiles?: PlayerProfile[];
  isReplay?: boolean;
  onRevealCard: () => void;
  onHideAndNext: () => void;
  onReturnToLobby: () => void;
  onOpenRulebook: () => void;
  onUpdatePlayerName?: (newName: string) => void;
  onUpdatePlayerNameById?: (playerId: string, name: string) => void;
  onUpdatePlayerProfile?: (updates: { name?: string; avatar?: string; avatarImage?: string }) => void;
  onRerollWords: () => void;
  onClaimCard?: (
    cardIndex: number, 
    playerName: string, 
    avatar?: string, 
    avatarImage?: string, 
    playerId?: string, 
    score?: number
  ) => void;
}

export const WordRevealScreen: React.FC<WordRevealScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  allPlayers,
  isCardRevealed: propIsCardRevealed,
  partnerPlayer: _partnerPlayer, // Lovers partner text removed per user request
  undercoverCount,
  mrWhiteCount,
  activeSpecialRoles: _activeSpecialRoles,
  savedProfiles,
  isReplay = false,
  onRevealCard,
  onHideAndNext,
  onReturnToLobby,
  onOpenRulebook,
  onUpdatePlayerName: _onUpdatePlayerName,
  onUpdatePlayerNameById: _onUpdatePlayerNameById,
  onUpdatePlayerProfile: _onUpdatePlayerProfile,
  onRerollWords,
  onClaimCard,
}) => {
  // Modal 1: "Player X - Pilih kartu" handover prompt modal (Images 1 & 5)
  const [showHandoverModal, setShowHandoverModal] = useState(true);

  // Modal 2: Card selection & name input / reveal modal (Images 2, 3, 4)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isWordRevealedInModal, setIsWordRevealedInModal] = useState(false);

  // Import saved player drawer modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // General game menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [playerNameInput, setPlayerNameInput] = useState('');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [modalAvatarImage, setModalAvatarImage] = useState<string | undefined>(undefined);

  // Map of card index to claimed player identity
  const [claimedCardsMap, setClaimedCardsMap] = useState<
    Record<number, { name: string; avatar: string; avatarImage?: string; playerNumber: number }>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset claimed cards when a fresh round starts at playerIndex 0
  useEffect(() => {
    if (playerIndex === 0) {
      setClaimedCardsMap({});
    }
  }, [playerIndex]);

  // When turn changes to next player:
  useEffect(() => {
    setShowHandoverModal(true);
    setIsCardModalOpen(false);
    setIsWordRevealedInModal(false);
    setSelectedCardIdx(null);
    setPlayerNameInput('');
    setModalAvatarImage(undefined);
  }, [playerIndex]);

  // Existing name in Replay ("Main Lagi") mode
  const existingReplayName = isReplay 
    ? (allPlayers?.[playerIndex]?.name?.trim() || savedProfiles?.[playerIndex]?.name?.trim() || '')
    : '';

  const cardCount = totalPlayers;

  // The secret role and word of the currently chosen card
  const activeChosenPlayer = 
    selectedCardIdx !== null && allPlayers && allPlayers[selectedCardIdx]
      ? allPlayers[selectedCardIdx]
      : player;

  // Card click on table
  const handleCardClick = (idx: number) => {
    // If this card is already claimed
    if (claimedCardsMap[idx]) {
      soundEffects.playPop();
      setToastMessage(`🔒 Kartu #${idx + 1} sudah dipilih oleh ${claimedCardsMap[idx].name}!`);
      setTimeout(() => setToastMessage(null), 2200);
      return;
    }

    soundEffects.playCardFlip();
    triggerHaptic('light');
    setSelectedCardIdx(idx);

    if (isReplay && existingReplayName) {
      // MAIN LAGI: Pemain sudah memiliki nama, langsung buka kartu rahasianya!
      setPlayerNameInput(existingReplayName);
      setModalAvatarImage(undefined);
      setIsWordRevealedInModal(true);
      setIsCardModalOpen(true);
      onRevealCard();
    } else {
      // BARU START: Kolom nama wajib kosong dan harus diisi manual!
      setPlayerNameInput('');
      setModalAvatarImage(undefined);
      setIsWordRevealedInModal(false);
      setIsCardModalOpen(true);
    }
  };

  // Submit name to open secret word (Image 3 -> Image 4)
  const handleOpenSecretWord = () => {
    if (!playerNameInput.trim()) return;
    if (isDuplicateName) return;

    soundEffects.playCardFlip();
    triggerHaptic('medium');
    setIsWordRevealedInModal(true);
    onRevealCard();
  };

  // Finish viewing secret word and claim card (Image 4 -> Image 5)
  const handleFinishAndClaim = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    if (selectedCardIdx !== null) {
      const chosenName = playerNameInput.trim() || existingReplayName || `Player ${playerIndex + 1}`;
      const chosenAvatar = allPlayers?.[playerIndex]?.avatar || savedProfiles?.[playerIndex]?.avatar || '👤';
      const chosenAvatarImage = modalAvatarImage;
      const chosenId = allPlayers?.[playerIndex]?.id || savedProfiles?.[playerIndex]?.id;
      const chosenScore = allPlayers?.[playerIndex]?.score ?? savedProfiles?.[playerIndex]?.totalScore ?? 0;

      // Update local claimed cards display on table
      setClaimedCardsMap(prev => ({
        ...prev,
        [selectedCardIdx]: {
          name: chosenName,
          avatar: chosenAvatar,
          avatarImage: chosenAvatarImage,
          playerNumber: playerIndex + 1,
        },
      }));

      if (onClaimCard) {
        onClaimCard(
          selectedCardIdx,
          chosenName,
          chosenAvatar,
          chosenAvatarImage,
          chosenId,
          chosenScore
        );
      } else {
        onHideAndNext();
      }
    }

    setIsCardModalOpen(false);
    setSelectedCardIdx(null);
    setIsWordRevealedInModal(false);
    setModalAvatarImage(undefined);
    setPlayerNameInput('');
  };

  const handleTriggerReroll = () => {
    if (playerIndex > 0) {
      const confirmReroll = window.confirm(
        'Yakin ingin memilih ulang kata? Kata rahasia akan diacak baru dan pemilihan kartu diulang dari pemain pertama.'
      );
      if (!confirmReroll) return;
    }
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    setClaimedCardsMap({});
    onRerollWords();
    setIsCardModalOpen(false);
    setIsMenuOpen(false);
    setSelectedCardIdx(null);
    setIsWordRevealedInModal(false);
    setShowHandoverModal(true);
    setToastMessage('🎲 Pasangan kata baru berhasil dipilih!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await processImageFile(file);
      soundEffects.playSelect();
      triggerHaptic('medium');
      setModalAvatarImage(dataUrl);
      setToastMessage('📸 Foto profil berhasil dipasang!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err: unknown) {
      alert((err as Error).message || 'Gagal mengunggah foto.');
    }
  };

  // Only check duplicate against players who have ALREADY claimed a card in this round!
  const trimmedLowerInput = playerNameInput.trim().toLowerCase();
  const isDuplicateName = Boolean(
    trimmedLowerInput && (
      Object.entries(claimedCardsMap).some(
        ([cIdx, val]) => Number(cIdx) !== selectedCardIdx && val.name.trim().toLowerCase() === trimmedLowerInput
      )
    )
  );

  const isNameValid = playerNameInput.trim().length > 0 && !isDuplicateName;
  const isRevealed = isWordRevealedInModal || propIsCardRevealed;

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10">
      {/* Hidden file input for custom profile picture */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* ================= TOP HEADER (Exit door, Title, Rulebook) ================= */}
      <div className="flex items-center justify-between">
        {/* Exit Door Icon on Top-Left */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Yakin ingin keluar dan kembali ke Lobby?')) {
              soundEffects.playPop();
              onReturnToLobby();
            }
          }}
          aria-label="Kembali ke Lobby"
          className="p-2 text-slate-300 hover:text-white btn-tactile"
        >
          <LogOut className="w-6 h-6 stroke-[2]" />
        </button>

        {/* Center: Dynamic Turn Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 shadow-md mb-0.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider font-heading">
              Player {playerIndex + 1}{existingReplayName ? ` (${existingReplayName})` : ''}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-300">
            Pilih kartu kuning bertanda tanya (?)
          </p>
        </div>

        {/* Help Rulebook Question Mark on Top-Right */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            onOpenRulebook();
          }}
          aria-label="Bantuan"
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center shadow-md border border-blue-400/40 btn-tactile"
        >
          ?
        </button>
      </div>

      {/* ================= INFO PILLS BAR (Penyusup & Total Pemain) ================= */}
      <div className="flex items-center justify-between gap-3 mt-3">
        {/* Left Pill: Penyusup tersisa */}
        <div className="papan-glass rounded-2xl py-2 px-3.5 shadow-md flex-1">
          <p className="text-[11px] font-semibold text-slate-300">
            Penyusup tersisa
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            {/* Mr White Hat */}
            <div className="flex items-center gap-1.5" title="Mr. White">
              <InfiltratorHat isWhite={true} className="w-4 h-4" />
              <span className="text-xs font-black text-white">{mrWhiteCount}</span>
            </div>
            {/* Undercover Hat */}
            <div className="flex items-center gap-1.5" title="Undercover">
              <InfiltratorHat isWhite={false} className="w-4 h-4 filter invert" />
              <span className="text-xs font-black text-white">{undercoverCount}</span>
            </div>
          </div>
        </div>

        {/* Right Pill: Total Pemain */}
        <div className="papan-glass rounded-2xl py-2 px-3.5 shadow-md flex-1 text-left">
          <p className="text-[11px] font-semibold text-slate-300">
            Total Pemain
          </p>
          <p className="text-xs font-black text-cyan-300 truncate mt-0.5 font-heading">
            {totalPlayers} Pemain
          </p>
        </div>
      </div>

      {/* ================= MYSTERY CARDS GRID ON TABLE ================= */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-3 gap-3.5 max-h-[58vh] overflow-y-auto p-1">
          {Array.from({ length: cardCount }).map((_, idx) => {
            const claimed = claimedCardsMap[idx];

            if (claimed) {
              const displayName = claimed.name?.trim() || `Player ${claimed.playerNumber}`;
              const initialLetter = claimed.name?.trim() 
                ? claimed.name.trim().charAt(0).toUpperCase() 
                : `${claimed.playerNumber}`;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundEffects.playPop();
                    setToastMessage(`🔒 Kartu #${idx + 1} sudah dibuka oleh Player ${claimed.playerNumber} (${displayName})!`);
                    setTimeout(() => setToastMessage(null), 2200);
                  }}
                  className="relative aspect-[3/4] rounded-2xl p-2.5 flex flex-col items-center justify-between text-center papan-glass border-2 border-emerald-500/80 shadow-xl cursor-pointer hover:border-emerald-400 transition-all select-none group"
                  title={`Kartu sudah dibuka oleh ${displayName}`}
                >
                  {/* Top Header: Badge Player Number & Check Pill */}
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[10px] font-black text-emerald-400 font-heading">
                      P{claimed.playerNumber}
                    </span>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>

                  {/* Profile Avatar in Center (Green Circle with Initial Letter - Matches Image 5) */}
                  <div className="relative my-auto">
                    <div className="w-13 h-13 rounded-full overflow-hidden bg-emerald-500 border-2 border-emerald-300 flex items-center justify-center shadow-md">
                      {claimed.avatarImage ? (
                        <img 
                          src={claimed.avatarImage} 
                          alt={displayName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="font-heading font-black text-xl text-white">
                          {initialLetter}
                        </span>
                      )}
                    </div>
                    {/* Small Check Floating Badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Player Name at Bottom */}
                  <div className="w-full">
                    <p className="text-xs font-black text-white font-heading truncate px-0.5 leading-tight">
                      {displayName}
                    </p>
                    <span className="text-[9px] font-extrabold text-emerald-400 tracking-tight block mt-0.5">
                      Terkunci ✓
                    </span>
                  </div>
                </div>
              );
            }

            {/* KARTU KUNING BERTANDA TANYA (?) */}
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx)}
                title={`Pilih Kartu Kuning #${idx + 1}`}
                aria-label={`Pilih Kartu Kuning #${idx + 1}`}
                className="relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-between p-3 btn-tactile bg-gradient-to-b from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border-2 border-amber-600 shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95 group overflow-hidden"
              >
                {/* Card Number on Top Left */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-950/70 font-heading">
                    #{idx + 1}
                  </span>
                  <span className="text-[9px] font-black text-amber-950/60 uppercase tracking-wider font-heading">
                    Rahasia
                  </span>
                </div>

                {/* Big Mystery Question Mark in Center */}
                <div className="my-auto flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-amber-950 font-heading drop-shadow-sm transition-transform group-hover:scale-115">
                    ?
                  </span>
                </div>

                {/* Bottom Prompt */}
                <div className="w-full text-center">
                  <span className="px-2 py-0.5 rounded-full bg-amber-600/30 text-[9px] font-extrabold text-amber-950 tracking-wide font-heading block">
                    Ketuk Kartu
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg animate-fade-in flex items-center gap-2 border border-emerald-500">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= BOTTOM BAR WITH REROLL & MENU BUTTONS ================= */}
      <div className="flex items-center justify-between pt-2 pb-1">
        {/* Tombol Pilih Ulang Kata */}
        <button
          type="button"
          onClick={handleTriggerReroll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold shadow-md btn-tactile"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Pilih Ulang Kata</span>
        </button>

        {/* Tombol Menu Oranye */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            setIsMenuOpen(true);
          }}
          aria-label="Menu Permainan"
          className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg btn-tactile"
        >
          <Menu className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* ================= SCREEN 1 & 5: HANDOVER PROMPT MODAL ("Player X - Pilih kartu") ================= */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl papan-glass-dark border border-white/20 p-6 shadow-2xl text-center space-y-4 animate-scale-up">
            {/* Header: Player X (Name if Replay) */}
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#2DD4BF] font-heading tracking-wide">
                Player {playerIndex + 1}{existingReplayName ? ` (${existingReplayName})` : ''}
              </h3>
              <p className="text-white text-sm font-semibold">
                Pilih kartu
              </p>
            </div>

            {/* Center Graphic: Two yellow cards with boy & girl silhouettes and pointing hand */}
            <div className="py-2 flex items-center justify-center">
              <MysteryCardsHandGraphic className="w-56 h-40 drop-shadow-xl" />
            </div>

            {/* Bottom Button: Green Pill OK */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setShowHandoverModal(false);
                }}
                className="w-full py-3.5 px-8 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-white font-black text-sm uppercase tracking-wider shadow-lg btn-tactile font-heading"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCREEN 2, 3 & 4: CARD SELECTION & REVEAL MODAL ================= */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl papan-glass-dark border border-white/20 p-6 shadow-2xl text-center space-y-4 animate-scale-up relative">
            
            {/* Close X Button on Top-Right */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setIsCardModalOpen(false);
                setIsWordRevealedInModal(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full btn-tactile"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* ================= STAGE 1: NAME INPUT & AVATAR (Images 2 & 3) ================= */}
            {!isRevealed ? (
              <div className="space-y-4 pt-1">
                {/* Circular Avatar: Green circle with boy silhouette & camera badge in bottom half */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  title="Ketuk untuk ganti / unggah foto profil"
                  className="w-24 h-24 rounded-full bg-[#4ADE80] border-4 border-[#34D399]/40 relative overflow-hidden mx-auto shadow-xl cursor-pointer hover:brightness-105 btn-tactile group"
                >
                  {modalAvatarImage ? (
                    <img 
                      src={modalAvatarImage} 
                      alt="Profil" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <>
                      {/* White Silhouette Head */}
                      <div className="w-full h-full flex flex-col items-center justify-start pt-2">
                        <svg viewBox="0 0 100 100" className="w-16 h-16 fill-white">
                          <path d="M50 20 C38 20 28 29 28 42 C28 53 33 59 38 64 C35 67 30 72 26 80 C24 84 27 92 34 94 C36 96 35 100 32 106 L68 106 C65 100 64 96 66 94 C73 92 76 84 74 80 C70 72 65 67 62 64 C67 59 72 53 72 42 C72 29 62 20 50 20 Z" />
                          <path d="M30 38 L20 40 L28 48 Z" />
                        </svg>
                      </div>
                      {/* Dark green bottom half camera bar */}
                      <div className="absolute bottom-0 inset-x-0 h-7 bg-[#14532D]/90 flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </div>
                    </>
                  )}
                </div>

                {/* Input Container: Starts completely EMPTY on fresh start! */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(e) => setPlayerNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isNameValid) {
                        handleOpenSecretWord();
                      }
                    }}
                    placeholder="Masukkan nama"
                    maxLength={16}
                    autoFocus
                    className={`w-full px-4 py-3 rounded-2xl bg-[#0F172A]/90 border-2 text-white text-base font-bold text-center focus:outline-none font-heading shadow-inner placeholder:text-slate-500 transition-colors ${
                      isDuplicateName 
                        ? 'border-rose-500 focus:border-rose-400' 
                        : 'border-slate-600 focus:border-[#38BDF8]'
                    }`}
                  />
                  <p className="text-xs text-slate-300">
                    Masukkan nama untuk membuka kata rahasia
                  </p>

                  {isDuplicateName && (
                    <p className="text-[11px] font-bold text-rose-400 animate-pulse">
                      ⚠️ Nama sudah digunakan pemain lain! Gunakan nama berbeda.
                    </p>
                  )}
                </div>

                {/* Actions: Primary Reveal Button (when name entered) & "Impor pemain" button (Image 2) */}
                <div className="space-y-2.5 pt-1">
                  {/* If user typed a valid name, show the button to reveal secret word */}
                  {playerNameInput.trim().length > 0 && (
                    <button
                      type="button"
                      onClick={handleOpenSecretWord}
                      disabled={!isNameValid}
                      className={`w-full py-3.5 px-6 rounded-full font-black text-sm shadow-lg tracking-wide flex items-center justify-center gap-2 btn-tactile transition-all font-heading ${
                        !isNameValid
                          ? 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-slate-600'
                          : 'bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-white cursor-pointer'
                      }`}
                    >
                      <span>Buka Kata Rahasia</span>
                    </button>
                  )}

                  {/* "Impor pemain" Blue Pill Button (Matches Image 2) */}
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      setIsImportModalOpen(true);
                    }}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-black text-sm tracking-wide shadow-lg btn-tactile font-heading"
                  >
                    Impor pemain
                  </button>
                </div>
              </div>
            ) : (
              /* ================= STAGE 2: SECRET WORD REVEAL (Image 4) ================= */
              <div className="space-y-4 pt-1 animate-scale-up">
                {/* Center Circular Avatar with White Initial Letter (Image 4) */}
                <div className="w-24 h-24 rounded-full bg-[#4ADE80] border-4 border-[#34D399]/40 flex items-center justify-center mx-auto shadow-xl overflow-hidden">
                  {modalAvatarImage ? (
                    <img 
                      src={modalAvatarImage} 
                      alt={playerNameInput.trim()} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="font-heading font-black text-4xl text-white">
                      {(playerNameInput.trim() || existingReplayName || `${playerIndex + 1}`).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Player Name in bold cyan & Subtitle */}
                <div className="space-y-0.5">
                  <h3 className="text-xl font-black text-[#2DD4BF] font-heading tracking-wide">
                    {playerNameInput.trim() || existingReplayName}
                  </h3>
                  <p className="text-slate-300 text-xs font-semibold">
                    Kata rahasiamu adalah
                  </p>
                </div>

                {/* White Rectangular Card Container with Bold Black Word (Image 4) */}
                <div className="w-full max-w-[260px] mx-auto bg-slate-100 rounded-2xl py-7 px-5 shadow-xl text-center">
                  {activeChosenPlayer.role === 'MR_WHITE' ? (
                    <div className="space-y-1">
                      <span className="text-xl font-black text-slate-900 font-heading block">
                        MR. WHITE
                      </span>
                      <p className="text-xs text-slate-600 font-bold">
                        Kamu tidak memiliki kata rahasia!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-2xl font-black text-slate-900 font-heading tracking-wider block uppercase">
                        {activeChosenPlayer.word}
                      </span>
                    </div>
                  )}
                </div>

                {/* Green Pill OK Button (Image 4) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleFinishAndClaim}
                    className="w-full max-w-[240px] mx-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] hover:from-[#059669] hover:to-[#10B981] text-white font-black text-sm uppercase tracking-wider shadow-lg btn-tactile font-heading"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: IMPOR PEMAIN (SELECT FROM SAVED PROFILES) ================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl papan-glass-dark border border-white/20 p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-black text-white font-heading">
                  Pilih Pemain Tersimpan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white btn-tactile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {savedProfiles && savedProfiles.length > 0 ? (
                savedProfiles.map((p, idx) => {
                  const isAlreadyClaimed = Object.values(claimedCardsMap).some(
                    c => c.name.trim().toLowerCase() === p.name.trim().toLowerCase()
                  );

                  return (
                    <button
                      key={p.id || idx}
                      type="button"
                      disabled={isAlreadyClaimed}
                      onClick={() => {
                        soundEffects.playSelect();
                        setPlayerNameInput(p.name);
                        setModalAvatarImage(p.avatarImage);
                        setIsImportModalOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all btn-tactile ${
                        isAlreadyClaimed
                          ? 'bg-slate-900/40 opacity-40 cursor-not-allowed border border-slate-800'
                          : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#4ADE80] flex items-center justify-center text-white font-black text-sm font-heading overflow-hidden shadow-xs">
                          {p.avatarImage ? (
                            <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            p.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white font-heading">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {isAlreadyClaimed ? 'Sudah bermain' : `${p.totalWins ?? 0} menang • ${p.totalScore ?? 0} skor`}
                          </p>
                        </div>
                      </div>
                      {!isAlreadyClaimed && (
                        <span className="text-xs font-bold text-sky-400">
                          Pilih
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada profil pemain tersimpan. Silakan masukkan nama secara manual.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold btn-tactile"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ================= GAME MENU MODAL ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl papan-glass-dark border border-white/10 p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white font-heading">Menu Permainan</h3>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white btn-tactile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Opsi 1: Pilih Ulang Kata */}
              <button
                type="button"
                onClick={handleTriggerReroll}
                className="w-full p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-left flex items-center gap-3.5 btn-tactile"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Pilih Ulang Kata</h4>
                  <p className="text-[11px] text-slate-300">Acak pasangan kata baru & mulai buka kartu dari awal</p>
                </div>
              </button>

              {/* Opsi 2: Aturan Main */}
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenRulebook();
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-left flex items-center gap-3.5 btn-tactile"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">Panduan & Peran</h4>
                  <p className="text-[11px] text-slate-300">Aturan Civilian, Undercover & Mr. White</p>
                </div>
              </button>

              {/* Opsi 3: Keluar ke Lobby */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Yakin ingin mengakhiri sesi dan kembali ke Lobby?')) {
                    setIsMenuOpen(false);
                    onReturnToLobby();
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-left flex items-center gap-3.5 btn-tactile"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-rose-300">Kembali ke Lobby</h4>
                  <p className="text-[11px] text-slate-400">Batalkan permainan dan atur ulang pemain</p>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold btn-tactile"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
