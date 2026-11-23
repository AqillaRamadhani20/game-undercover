import React, { useState, useRef, useEffect } from 'react';
import type { Player, PlayerProfile } from '../../types/game';
import { 
  LogOut, 
  Camera, 
  EyeOff, 
  Eye, 
  Menu, 
  Check,
  RefreshCw,
  BookOpen,
  X
} from 'lucide-react';
import { 
  BoyCardSilhouette, 
  GirlCardSilhouette, 
  InfiltratorHat 
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
  partnerPlayer,
  undercoverCount,
  mrWhiteCount,
  activeSpecialRoles: _activeSpecialRoles,
  savedProfiles,
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
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [isWordRevealedInModal, setIsWordRevealedInModal] = useState(false);
  const [modalAvatarImage, setModalAvatarImage] = useState<string | undefined>(undefined);

  // Map of card index to claimed player identity
  const [claimedCardsMap, setClaimedCardsMap] = useState<
    Record<number, { name: string; avatar: string; avatarImage?: string }>
  >({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset claimed cards when a fresh round starts at playerIndex 0
  useEffect(() => {
    if (playerIndex === 0) {
      setClaimedCardsMap({});
    }
  }, [playerIndex]);

  // Determine current picker's known identity
  const currentPickerProfile = savedProfiles?.[playerIndex];
  const pickerName = currentPickerProfile?.name?.trim() || '';

  const cardCount = totalPlayers;
  const isGirl = ((selectedCardIdx ?? playerIndex) % 2 === 1);

  // The secret role and word of the currently chosen card
  const activeChosenPlayer = 
    selectedCardIdx !== null && allPlayers && allPlayers[selectedCardIdx]
      ? allPlayers[selectedCardIdx]
      : player;

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
    setIsWordRevealedInModal(false);
    // Prefill with pickerName if known, else start empty
    setPlayerNameInput(pickerName);
    setModalAvatarImage(currentPickerProfile?.avatarImage);
    setIsCardModalOpen(true);
  };

  const handleOpenSecretWord = () => {
    if (!playerNameInput.trim()) return;
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    setIsWordRevealedInModal(true);
    onRevealCard();
  };

  const handleFinishAndClaim = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    if (selectedCardIdx !== null) {
      const chosenName = playerNameInput.trim();
      const chosenAvatar = currentPickerProfile?.avatar || '🦎';
      const chosenAvatarImage = modalAvatarImage || currentPickerProfile?.avatarImage;
      const chosenId = currentPickerProfile?.id;
      const chosenScore = currentPickerProfile?.totalScore;

      // Update local claimed cards display
      setClaimedCardsMap(prev => ({
        ...prev,
        [selectedCardIdx]: {
          name: chosenName,
          avatar: chosenAvatar,
          avatarImage: chosenAvatarImage,
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

  const isNameValid = playerNameInput.trim().length > 0;
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

      {/* ================= TOP HEADER (Dynamic Turn Caller) ================= */}
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

        {/* Center: Dynamic Turn Announcement */}
        <div className="text-center">
          {pickerName ? (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 shadow-xs mb-0.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider font-heading">
                  Giliran {pickerName}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-300">
                Pilih salah satu kartu di meja
              </p>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-950/80 border border-sky-400/40 text-sky-300 shadow-xs mb-0.5">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider font-heading">
                  Pemain #{playerIndex + 1}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-300">
                Pilih kartu pilihanmu di meja
              </p>
            </div>
          )}
        </div>

        {/* Help Question Mark on Top-Right */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            onOpenRulebook();
          }}
          aria-label="Bantuan"
          className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center shadow-md btn-tactile"
        >
          ?
        </button>
      </div>

      {/* ================= INFO PILLS BAR (Screenshot 2 - Frosted Glass) ================= */}
      <div className="flex items-center justify-between gap-3 mt-3">
        {/* Left Pill: Penyusup tersisa */}
        <div className="flex-1 papan-glass rounded-2xl py-2 px-3.5 shadow-md">
          <p className="text-[11px] font-semibold text-slate-300">
            Penyusup tersisa
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            {/* Mr White Hat */}
            <div className="flex items-center gap-1.5">
              <InfiltratorHat isWhite={true} className="w-4 h-4" />
              <span className="text-xs font-black text-white">{mrWhiteCount}</span>
            </div>
            {/* Undercover Hat */}
            <div className="flex items-center gap-1.5">
              <InfiltratorHat isWhite={false} className="w-4 h-4 filter invert" />
              <span className="text-xs font-black text-white">{undercoverCount}</span>
            </div>
          </div>
        </div>

        {/* Right Pill: Peran Khusus */}
        <div className="flex-1 papan-glass rounded-2xl py-2 px-3.5 shadow-md text-left">
          <p className="text-[11px] font-semibold text-slate-300">
            Peran Khusus
          </p>
          <p className="text-xs font-black text-slate-300 truncate mt-0.5 font-heading">
            {_activeSpecialRoles && _activeSpecialRoles.length > 0
              ? _activeSpecialRoles.join(', ')
              : 'Tidak ada'}
          </p>
        </div>
      </div>

      {/* ================= MYSTERY CARDS GRID (Choose Any Box/Card on the Table) ================= */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-3 gap-3.5 max-h-[58vh] overflow-y-auto p-1">
          {Array.from({ length: cardCount }).map((_, idx) => {
            const claimed = claimedCardsMap[idx];
            const isGirlCard = idx % 2 === 1;

            if (claimed) {
              const displayName = claimed.name?.trim() || `Pemain ${idx + 1}`;
              const initialLetter = claimed.name?.trim() 
                ? claimed.name.trim().charAt(0).toUpperCase() 
                : `${idx + 1}`;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundEffects.playPop();
                    setToastMessage(`🔒 Kartu #${idx + 1} sudah dikunci oleh ${displayName}!`);
                    setTimeout(() => setToastMessage(null), 2200);
                  }}
                  className="relative aspect-[3/4] rounded-2xl p-2.5 flex flex-col items-center justify-between text-center papan-glass border-2 border-emerald-500/80 shadow-xl animate-flip cursor-pointer hover:border-emerald-400 transition-all btn-tactile select-none group"
                  title={`Kartu sudah dibuka oleh ${displayName}`}
                >
                  {/* Top Header: Badge Number & Check Pill */}
                  <div className="w-full flex items-center justify-between px-0.5">
                    <span className="text-[10px] font-black text-slate-400 font-heading">
                      #{idx + 1}
                    </span>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>

                  {/* Profile Avatar in Center with Glow */}
                  <div className="relative my-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-emerald-400/90 flex items-center justify-center shadow-md">
                      {claimed.avatarImage ? (
                        <img 
                          src={claimed.avatarImage} 
                          alt={displayName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="font-heading font-black text-base text-emerald-300">
                          {initialLetter}
                        </span>
                      )}
                    </div>
                    {/* Tiny Check Floating Badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
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

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx)}
                title={`Pilih Kartu #${idx + 1}`}
                aria-label={`Pilih Kartu #${idx + 1}`}
                className="relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-center btn-tactile bg-amber-500 hover:bg-amber-400 border-2 border-amber-600 shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
              >
                <span className="absolute top-2 left-2.5 text-[10px] font-black text-amber-900/60 font-heading">
                  #{idx + 1}
                </span>
                {isGirlCard ? (
                  <GirlCardSilhouette className="w-16 h-20 text-white drop-shadow-sm transition-transform group-hover:scale-110" />
                ) : (
                  <BoyCardSilhouette className="w-16 h-20 text-white drop-shadow-sm transition-transform group-hover:scale-110" />
                )}
                <span className="text-[10px] font-bold text-amber-950 mt-1 opacity-80">
                  Ketuk Kartu
                </span>
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
                  <p className="text-[11px] text-slate-300">Aturan Civilian, Undercover, Mr. White & Peran Khusus</p>
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

      {/* ================= CARD SELECTION / REVEAL MODAL ================= */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl papan-glass-dark p-6 shadow-2xl space-y-4 text-center animate-scale-up">
            
            {/* Header Badge */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2.5">
              <span className="font-heading font-black text-amber-400">
                🃏 Kartu #{(selectedCardIdx ?? 0) + 1} Terpilih
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCardModalOpen(false);
                  setIsWordRevealedInModal(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-full btn-tactile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Center Circular Green Avatar with Photo & Camera Upload Button */}
            <div className="relative inline-block mx-auto pt-1">
              <div 
                onClick={() => fileInputRef.current?.click()}
                title="Ganti Foto Profil"
                className="w-20 h-20 rounded-full bg-emerald-500 border-3 border-emerald-400 flex items-center justify-center shadow-md overflow-hidden cursor-pointer hover:brightness-105 btn-tactile"
              >
                {modalAvatarImage ? (
                  <img src={modalAvatarImage} alt="Profil" className="w-full h-full object-cover" />
                ) : currentPickerProfile?.avatarImage ? (
                  <img src={currentPickerProfile.avatarImage} alt="Profil" className="w-full h-full object-cover" />
                ) : playerNameInput.trim() ? (
                  <span className="font-heading font-black text-2xl text-white">
                    {playerNameInput.trim().charAt(0).toUpperCase()}
                  </span>
                ) : isGirl ? (
                  <GirlCardSilhouette className="w-12 h-14 text-white drop-shadow-sm mt-1" />
                ) : (
                  <BoyCardSilhouette className="w-12 h-14 text-white drop-shadow-sm mt-1" />
                )}
              </div>

              {/* Camera icon badge to trigger file picker */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Unggah Foto dari HP"
                aria-label="Unggah Foto dari HP"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center shadow-md btn-tactile"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* STAGE 1: Privacy Guard & Name Input (Mandatory Validation) */}
            {!isRevealed ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <input
                      type="text"
                      value={playerNameInput}
                      onChange={(e) => setPlayerNameInput(e.target.value)}
                      placeholder="Ketik namamu di sini..."
                      maxLength={16}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border-2 border-slate-600 focus:border-cyan-400 text-white text-base font-bold text-center focus:outline-none font-heading shadow-inner placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-300">
                      Wajib isi nama sebelum membuka kata rahasia
                    </p>
                  </div>

                  {/* Quick Famous Name Chips */}
                  <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                    {['Batman', 'Spiderman', 'Desta', 'Vincent', 'Raffi', 'Komeng', 'Thor', 'Zendaya'].map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          soundEffects.playPop();
                          setPlayerNameInput(chip);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-amber-300 btn-tactile font-heading"
                      >
                        +{chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Button: STRICT VALIDATION - Disabled if name is empty */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleOpenSecretWord}
                    disabled={!isNameValid}
                    className={`w-full py-4 px-6 rounded-full font-black text-base shadow-md tracking-wide flex items-center justify-center gap-2 btn-tactile transition-all ${
                      !isNameValid
                        ? 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-slate-600'
                        : 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-lg'
                    }`}
                  >
                    <Eye className="w-5 h-5" />
                    <span>Lihat Kata Rahasia</span>
                  </button>

                  {!isNameValid && (
                    <p className="text-[11px] font-bold text-amber-400 animate-pulse flex items-center justify-center gap-1">
                      ⚠️ Wajib masukkan nama untuk melihat kata rahasia
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* STAGE 2: Secret Word Revealed */
              <div className="space-y-4 animate-flip">
                {activeChosenPlayer.role === 'MR_WHITE' ? (
                  <div className="p-5 rounded-2xl papan-glass text-center space-y-2">
                    <InfiltratorHat isWhite={true} className="w-10 h-10 mx-auto filter drop-shadow-sm" />
                    <h3 className="text-xl font-black text-white font-heading">
                      Kamu adalah MR. WHITE
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kamu <b>tidak memiliki kata</b>! Dengarkan petunjuk pemain lain dengan cermat dan tebak kata mereka.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl papan-glass text-center space-y-1">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-heading">
                      {activeChosenPlayer.role === 'UNDERCOVER' ? '🕵️ Kamu UNDERCOVER' : '👤 Kamu CIVILIAN'}
                    </p>
                    <p className="text-[10px] text-slate-300 uppercase tracking-wide">
                      Kata Rahasiamu:
                    </p>
                    <h3 className="text-3xl font-black text-white font-heading tracking-wide">
                      {activeChosenPlayer.word}
                    </h3>
                    {partnerPlayer && (
                      <p className="text-xs text-rose-300 font-bold pt-1">
                        ❤️ Pasangan Lovers: {partnerPlayer.name}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-300 pt-1">
                      Ingat kata ini! Jangan sebutkan secara langsung.
                    </p>
                  </div>
                )}

                {/* Sembunyikan & Oper Button (Solid Emerald) */}
                <button
                  type="button"
                  onClick={handleFinishAndClaim}
                  className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-md tracking-wide flex items-center justify-center gap-2 btn-tactile font-heading"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>
                    {playerIndex === totalPlayers - 1 ? 'Selesai & Masuk Deskripsi Waktu' : 'Selesai & Oper HP'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
