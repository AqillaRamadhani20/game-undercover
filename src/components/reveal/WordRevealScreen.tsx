import React, { useState, useRef } from 'react';
import type { Player } from '../../types/game';
import { 
  LogOut, 
  Camera, 
  EyeOff, 
  Eye, 
  Menu, 
  Check,
  RefreshCw,
  BookOpen,
  X,
  Edit2
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
  isCardRevealed: boolean;
  partnerPlayer?: Player | null;
  undercoverCount: number;
  mrWhiteCount: number;
  activeSpecialRoles: string[];
  savedProfiles?: Array<{ id: string; name: string; avatar: string; avatarImage?: string }>;
  onRevealCard: () => void;
  onHideAndNext: () => void;
  onReturnToLobby: () => void;
  onOpenRulebook: () => void;
  onUpdatePlayerName?: (newName: string) => void;
  onUpdatePlayerProfile?: (updates: { name?: string; avatar?: string; avatarImage?: string }) => void;
  onRerollWords: () => void;
}

export const WordRevealScreen: React.FC<WordRevealScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  isCardRevealed,
  partnerPlayer: _partnerPlayer,
  undercoverCount,
  mrWhiteCount,
  activeSpecialRoles: _activeSpecialRoles,
  savedProfiles,
  onRevealCard,
  onHideAndNext,
  onReturnToLobby,
  onOpenRulebook,
  onUpdatePlayerName,
  onUpdatePlayerProfile,
  onRerollWords,
}) => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [playerNameInput, setPlayerNameInput] = useState(player?.name || '');
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cards array: 1 card per player
  const cardCount = totalPlayers;
  const isGirl = ((selectedCardIdx ?? playerIndex) % 2 === 1);

  const handleCardClick = (idx: number) => {
    // Only allow clicking if not already viewed in previous turns
    if (idx < playerIndex) return;
    soundEffects.playCardFlip();
    triggerHaptic('light');
    setSelectedCardIdx(idx);
    setPlayerNameInput(player.name);
    setIsEditingName(false);
    setIsCardModalOpen(true);
  };

  const handleOpenSecretWord = () => {
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    onRevealCard();
  };

  const handleFinishAndPass = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    setIsCardModalOpen(false);
    setSelectedCardIdx(null);
    onHideAndNext();
  };

  const handleTriggerReroll = () => {
    if (playerIndex > 0) {
      const confirmReroll = window.confirm(
        'Yakin ingin memilih ulang kata? Kata rahasia akan diacak baru dan pembukaan kartu diulang dari pemain pertama.'
      );
      if (!confirmReroll) return;
    }
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    onRerollWords();
    setIsCardModalOpen(false);
    setIsMenuOpen(false);
    setSelectedCardIdx(null);
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
      onUpdatePlayerProfile?.({ avatarImage: dataUrl });
      setToastMessage('📸 Foto profil berhasil diperbarui!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err: unknown) {
      alert((err as Error).message || 'Gagal mengunggah foto.');
    }
  };

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

      {/* ================= TOP HEADER (Screenshot 2 Style) ================= */}
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

        {/* Center: Player X / Pilih kartu */}
        <div className="text-center">
          <h2 className="text-lg font-black text-cyan-400 tracking-wide">
            {player.name || `Player ${playerIndex + 1}`}
          </h2>
          <p className="text-xs font-semibold text-slate-300">
            Pilih kartu
          </p>
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

      {/* ================= INFO PILLS BAR (Screenshot 2) ================= */}
      <div className="flex items-center justify-between gap-3 mt-4">
        {/* Left Pill: Penyusup tersisa */}
        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl py-2 px-3.5 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-400">
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
        <div className="flex-1 bg-slate-900 border border-slate-700 rounded-2xl py-2 px-3.5 shadow-sm text-left">
          <p className="text-[11px] font-semibold text-slate-400">
            Peran Khusus
          </p>
          <p className="text-xs font-black text-slate-300 truncate mt-0.5 font-heading">
            Tidak ada
          </p>
        </div>
      </div>

      {/* ================= MYSTERY CARDS GRID (Screenshot 2 Style - Solid Gold) ================= */}
      <div className="my-auto py-5">
        <div className="grid grid-cols-3 gap-3.5 max-h-[58vh] overflow-y-auto p-1">
          {Array.from({ length: cardCount }).map((_, idx) => {
            const isOpened = idx < playerIndex;
            const isGirlCard = idx % 2 === 1;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={isOpened}
                className={`relative aspect-[3/4] rounded-2xl flex items-center justify-center btn-tactile ${
                  isOpened
                    ? 'bg-slate-800 border-2 border-slate-700 opacity-40 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 border-2 border-amber-600 shadow-md cursor-pointer'
                }`}
              >
                {/* Silhouette with Question Mark */}
                {isOpened ? (
                  <div className="text-center">
                    <Check className="w-8 h-8 text-slate-400 mx-auto" />
                    <span className="text-[10px] font-bold text-slate-400">Terbuka</span>
                  </div>
                ) : isGirlCard ? (
                  <GirlCardSilhouette className="w-16 h-20 text-white drop-shadow-sm" />
                ) : (
                  <BoyCardSilhouette className="w-16 h-20 text-white drop-shadow-sm" />
                )}
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

        {/* Tombol Menu Oranye (Screenshot 2) */}
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Menu Permainan</h3>
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

      {/* ================= CARD SELECTION / REVEAL MODAL (Screenshot 3 Style) ================= */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 shadow-2xl space-y-5 text-center animate-scale-up">
            
            {/* Center Circular Green Avatar with Photo & Camera Upload Button */}
            <div className="relative inline-block mx-auto">
              <div 
                onClick={() => fileInputRef.current?.click()}
                title="Ganti Foto Profil"
                className="w-22 h-22 rounded-full bg-emerald-500 border-3 border-emerald-400 flex items-center justify-center shadow-md overflow-hidden cursor-pointer hover:brightness-105 btn-tactile"
              >
                {/* Custom Photo if uploaded */}
                {player.avatarImage ? (
                  <img src={player.avatarImage} alt={player.name} className="w-full h-full object-cover" />
                ) : player.avatar && player.avatar !== '🦎' ? (
                  <span className="text-4xl">{player.avatar}</span>
                ) : isGirl ? (
                  <GirlCardSilhouette className="w-14 h-16 text-white drop-shadow-sm mt-1" />
                ) : (
                  <BoyCardSilhouette className="w-14 h-16 text-white drop-shadow-sm mt-1" />
                )}
              </div>

              {/* Camera icon badge to trigger file picker */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Unggah Foto dari HP"
                aria-label="Unggah Foto dari HP"
                className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center shadow-md btn-tactile"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* STAGE 1: Privacy Guard (Direct 1-Tap Reveal, No Required Typing) */}
            {!isCardRevealed ? (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Oper HP ke:
                  </p>
                  
                  {isEditingName ? (
                    <div className="space-y-2 max-w-xs mx-auto">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={playerNameInput}
                          onChange={(e) => setPlayerNameInput(e.target.value)}
                          placeholder={`Pemain ${playerIndex + 1}`}
                          maxLength={16}
                          autoFocus
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm font-bold text-center focus:outline-none focus:border-cyan-400 font-heading"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = playerNameInput.trim();
                            onUpdatePlayerName?.(trimmed);
                            onUpdatePlayerProfile?.({ name: trimmed });
                            setIsEditingName(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white font-bold text-xs btn-tactile font-heading"
                        >
                          OK
                        </button>
                      </div>

                      {/* Quick Famous Name Chips */}
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {['Batman', 'Spiderman', 'Desta', 'Vincent', 'Raffi', 'Komeng', 'Thor'].map(chip => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              soundEffects.playPop();
                              setPlayerNameInput(chip);
                              onUpdatePlayerName?.(chip);
                              onUpdatePlayerProfile?.({ name: chip });
                              setIsEditingName(false);
                            }}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold text-amber-300 btn-tactile font-heading"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="text-2xl font-black text-white tracking-wide font-heading">
                        {player.name ? player.name : `Pemain ${playerIndex + 1}`}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        title="Ubah Nama"
                        className="p-1 text-slate-400 hover:text-white btn-tactile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 pt-1">
                    Pastikan hanya kamu yang melihat layar HP ini.
                  </p>
                </div>

                {/* Primary Button: Solid Blue Button (Screenshot 3) */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenSecretWord}
                    className="w-full py-4 px-6 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-black text-base shadow-md tracking-wide flex items-center justify-center gap-2 btn-tactile"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Lihat Kata Rahasia</span>
                  </button>

                  {/* Quick Profile Importer if available */}
                  {savedProfiles && savedProfiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSelect();
                        const nextProf = savedProfiles[playerIndex % savedProfiles.length];
                        if (nextProf) {
                          setPlayerNameInput(nextProf.name);
                          onUpdatePlayerName?.(nextProf.name);
                          onUpdatePlayerProfile?.({ 
                            name: nextProf.name, 
                            avatar: nextProf.avatar,
                            avatarImage: nextProf.avatarImage 
                          });
                        }
                      }}
                      className="w-full py-2 px-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs btn-tactile"
                    >
                      Ganti Profil: {savedProfiles[playerIndex % savedProfiles.length]?.name || 'Pilih'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* STAGE 2: Secret Word Revealed */
              <div className="space-y-4 animate-flip">
                {player.role === 'MR_WHITE' ? (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-2">
                    <InfiltratorHat isWhite={true} className="w-10 h-10 mx-auto filter drop-shadow-sm" />
                    <h3 className="text-xl font-black text-white font-heading">
                      Kamu adalah MR. WHITE
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Kamu <b>tidak memiliki kata</b>! Dengarkan petunjuk pemain lain dengan cermat dan tebak kata mereka.
                    </p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-center space-y-1">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-heading">
                      Kata Rahasiamu:
                    </p>
                    <h3 className="text-3xl font-black text-white font-heading tracking-wide">
                      {player.word}
                    </h3>
                    <p className="text-[11px] text-slate-300 pt-1">
                      Ingat kata ini! Jangan sebutkan secara langsung.
                    </p>
                  </div>
                )}

                {/* Sembunyikan & Oper Button (Solid Emerald) */}
                <button
                  type="button"
                  onClick={handleFinishAndPass}
                  className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-md tracking-wide flex items-center justify-center gap-2 btn-tactile font-heading"
                >
                  <EyeOff className="w-5 h-5" />
                  <span>
                    {playerIndex === totalPlayers - 1 ? 'Selesai & Masuk Deskripsi Waktu' : 'Sembunyikan & Oper HP'}
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
