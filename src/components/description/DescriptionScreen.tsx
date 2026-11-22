import React, { useState, useEffect } from 'react';
import type { Player } from '../../types/game';
import { 
  LogOut, 
  Menu, 
  Timer, 
  Eye, 
  Users, 
  Settings, 
  RotateCw, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Check, 
  X,
  Lock
} from 'lucide-react';
import { InfiltratorHat } from '../common/UndercoverIcons';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface DescriptionScreenProps {
  round: number;
  players: Player[];
  speechOrderIds: string[];
  undercoverCount: number;
  mrWhiteCount: number;
  onStartVoting: () => void;
  onReturnToLobby: () => void;
  onOpenRulebook: () => void;
  onOpenScoreboard: () => void;
  onRerollWords: () => void;
}

const CIRCLE_COLORS = [
  'bg-[#2DD4BF]', // Teal
  'bg-[#38BDF8]', // Sky Blue
  'bg-[#4ADE80]', // Mint / Light Green
  'bg-[#2DD4BF]', // Teal
  'bg-[#4ADE80]', // Light Green
  'bg-[#F59E0B]', // Amber
  'bg-[#FB7185]', // Rose
  'bg-[#A855F7]', // Purple
  'bg-[#38BDF8]', // Sky Blue
  'bg-[#10B981]', // Emerald
];

export const DescriptionScreen: React.FC<DescriptionScreenProps> = ({
  round: _round,
  players,
  speechOrderIds,
  undercoverCount: _undercoverCount,
  mrWhiteCount: _mrWhiteCount,
  onStartVoting,
  onReturnToLobby,
  onOpenRulebook,
  onOpenScoreboard,
  onRerollWords,
}) => {
  // Menu Sheet State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'TIMER' | 'AMNESIC' | 'PLAYERS' | 'SETTINGS' | null>(null);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Amnesic Mode State
  const [selectedAmnesicPlayerId, setSelectedAmnesicPlayerId] = useState<string>(speechOrderIds[0] || players[0]?.id || '');
  const [isAmnesicPeekRevealed, setIsAmnesicPeekRevealed] = useState(false);

  // Sound States
  const [isBgmActive, setIsBgmActive] = useState(soundEffects.getBgm());
  const [isSfxActive, setIsSfxActive] = useState(soundEffects.getSfx());

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate alive counts
  const alivePlayers = players.filter(p => p.isAlive);
  const aliveUndercoverCount = alivePlayers.filter(p => p.role === 'UNDERCOVER').length;
  const aliveMrWhiteCount = alivePlayers.filter(p => p.role === 'MR_WHITE').length;

  // Ordered alive players list
  const orderedAlivePlayers: Player[] = speechOrderIds
    .map(id => players.find(p => p.id === id))
    .filter((p): p is Player => p !== undefined && p.isAlive);

  // Timer interval effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            soundEffects.playElimination();
            triggerHaptic('heavy');
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds]);

  const handleGoToVoting = () => {
    soundEffects.playPop();
    triggerHaptic('medium');
    onStartVoting();
  };

  const handleToggleMenu = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    setIsMenuOpen(prev => !prev);
  };

  const handleOpenSubModal = (modal: 'TIMER' | 'AMNESIC' | 'PLAYERS' | 'SETTINGS') => {
    soundEffects.playPop();
    triggerHaptic('light');
    setIsMenuOpen(false);
    setActiveSubModal(modal);
  };

  const handleRerollWordsConfirm = () => {
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    setIsMenuOpen(false);
    setToastMessage('Kata rahasia baru berhasil diacak');
    setTimeout(() => setToastMessage(null), 2500);
    onRerollWords();
  };

  const handleToggleBgm = () => {
    soundEffects.playPop();
    const active = soundEffects.toggleBgm();
    setIsBgmActive(active);
  };

  const handleToggleSfx = () => {
    soundEffects.playPop();
    const active = soundEffects.toggleSfx();
    setIsSfxActive(active);
  };

  const selectedAmnesicPlayer = players.find(p => p.id === selectedAmnesicPlayerId);

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {/* Exit / Return to Lobby Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              const confirmExit = window.confirm('Kembali ke menu lobi utama? Game ronde ini akan dibatalkan.');
              if (confirmExit) onReturnToLobby();
            }}
            aria-label="Keluar ke Lobby"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 btn-tactile shadow-md"
          >
            <LogOut className="w-5 h-5 -scale-x-100" />
          </button>

          {/* Screen Title */}
          <h2 className="text-2xl font-black text-[#4ADE80] font-heading tracking-wide">
            Deskripsi Waktu
          </h2>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenRulebook();
            }}
            aria-label="Bantuan & Aturan"
            className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-base flex items-center justify-center shadow-md border border-blue-400/40 btn-tactile"
          >
            ?
          </button>
        </div>

        {/* Subtitle Instruction */}
        <p className="text-xs text-slate-300 text-center max-w-xs mx-auto leading-relaxed">
          Jelaskan kata rahasiamu dalam urutan yang ditunjukkan, hanya menggunakan kata atau frasa.
        </p>

        {/* ================= HUD ROW (Frosted Glass with Reduced Opacity) ================= */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {/* Card 1: Penyusup tersisa */}
          <div className="papan-glass rounded-2xl px-5 py-2 flex flex-col items-center min-w-[130px]">
            <span className="text-[11px] font-semibold text-slate-300 mb-1">
              Penyusup tersisa
            </span>
            <div className="flex items-center gap-3">
              {/* White Hat (Mr. White) */}
              <div className="flex items-center gap-1.5" title="Mr. White tersisa">
                <InfiltratorHat isWhite={true} className="w-5 h-5 filter drop-shadow-xs" />
                <span className="text-sm font-black text-white font-heading">
                  {aliveMrWhiteCount}
                </span>
              </div>
              {/* Black Hat (Undercover) */}
              <div className="flex items-center gap-1.5" title="Undercover tersisa">
                <InfiltratorHat isWhite={false} className="w-5 h-5" />
                <span className="text-sm font-black text-white font-heading">
                  {aliveUndercoverCount}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Peran Khusus */}
          <div className="papan-glass rounded-2xl px-5 py-2 flex flex-col items-center min-w-[130px]">
            <span className="text-[11px] font-semibold text-slate-300 mb-1">
              Peran Khusus
            </span>
            <span className="text-sm font-bold text-slate-300 font-heading">
              Tidak ada
            </span>
          </div>
        </div>
      </div>

      {/* ================= SPEECH ORDER PLAYERS GRID ================= */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-3 gap-y-7 gap-x-4 max-w-sm mx-auto items-center justify-items-center">
          {orderedAlivePlayers.map((player, idx) => {
            const circleColor = CIRCLE_COLORS[idx % CIRCLE_COLORS.length];
            const badgeColor = idx === 0 ? 'bg-[#F43F5E]' : 'bg-[#10B981]';
            const displayName = player.name.trim() || `Pemain ${idx + 1}`;
            const initialLetter = player.name.trim() ? player.name.trim().charAt(0).toUpperCase() : `${idx + 1}`;

            return (
              <div key={player.id} className="flex flex-col items-center">
                {/* Circle Container with Initial / Avatar and Badge */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center relative shadow-lg ${circleColor} transition-transform hover:scale-105`}>
                  {player.avatarImage ? (
                    <img 
                      src={player.avatarImage} 
                      alt={displayName} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-3xl font-black text-white font-heading select-none">
                      {initialLetter}
                    </span>
                  )}

                  {/* Top-Right Number Badge: #1 is Pink, #2+ is Green */}
                  <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-[#0B1120] font-heading ${badgeColor}`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Name Capsule Pill (Translucent Frosted Pill) */}
                <div className="papan-glass rounded-lg px-2.5 py-1 max-w-[95px] text-center shadow-xs mt-2">
                  <span className="text-xs font-bold text-slate-100 block truncate">
                    {displayName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= BOTTOM ACTION BAR ================= */}
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between gap-3 px-1">
          {/* Large Solid Orange "Pergi ke Voting" Button */}
          <button
            type="button"
            onClick={handleGoToVoting}
            className="flex-1 py-4 px-6 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-base shadow-xl text-center btn-tactile font-heading tracking-wide"
          >
            Pergi ke Voting
          </button>

          {/* Floating Orange Hamburger Menu Button */}
          <button
            type="button"
            onClick={handleToggleMenu}
            aria-label="Menu Opsi"
            className="w-14 h-14 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center shadow-xl btn-tactile shrink-0"
          >
            <Menu className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ================= BOTTOM-SHEET POPUP MENU ================= */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Sheet Container (Translucent Frosted Glass) */}
          <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto papan-glass-dark rounded-3xl p-5 shadow-2xl z-50 animate-scale-up space-y-2">
            {/* 1. Timer */}
            <button
              type="button"
              onClick={() => handleOpenSubModal('TIMER')}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shrink-0">
                <Timer className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-white text-base font-bold font-heading">
                Timer
              </span>
            </button>

            {/* 2. Amnesic mode */}
            <button
              type="button"
              onClick={() => handleOpenSubModal('AMNESIC')}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Eye className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-white text-base font-bold font-heading">
                Amnesic mode
              </span>
            </button>

            {/* 3. Daftar Pemain */}
            <button
              type="button"
              onClick={() => handleOpenSubModal('PLAYERS')}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md shrink-0">
                <Users className="w-6 h-6 fill-current stroke-none" />
              </div>
              <span className="text-white text-base font-bold font-heading">
                Daftar Pemain
              </span>
            </button>

            {/* 4. Pengaturan */}
            <button
              type="button"
              onClick={() => handleOpenSubModal('SETTINGS')}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Settings className="w-6 h-6 fill-current stroke-none" />
              </div>
              <span className="text-white text-base font-bold font-heading">
                Pengaturan
              </span>
            </button>

            {/* 5. Pilih ulang kata */}
            <button
              type="button"
              onClick={() => {
                const ok = window.confirm('Pilih ulang kata rahasia? Kata baru akan diacak dan pembukaan kartu diulang.');
                if (ok) {
                  handleRerollWordsConfirm();
                }
              }}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md shrink-0">
                <RotateCw className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-white text-base font-bold font-heading">
                Pilih ulang kata
              </span>
            </button>
          </div>
        </>
      )}

      {/* ================= SUB-MODAL 1: TIMER ================= */}
      {activeSubModal === 'TIMER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="papan-glass-dark rounded-3xl p-6 max-w-sm w-full space-y-5 animate-scale-up shadow-2xl text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white font-heading">Timer Diskusi</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Countdown Display */}
            <div className="py-4">
              <span className={`text-6xl font-black font-heading tracking-tight ${timerSeconds <= 10 && timerSeconds > 0 ? 'text-rose-500 animate-pulse' : 'text-[#4ADE80]'}`}>
                {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, '0')}
              </span>
              <p className="text-xs text-slate-400 mt-2">
                {isTimerActive ? 'Waktu sedang berjalan...' : timerSeconds === 0 ? 'Waktu habis!' : 'Timer dijeda'}
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center justify-center gap-2">
              {[30, 60, 90, 120].map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    setTimerSeconds(sec);
                    setIsTimerActive(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading border btn-tactile ${
                    timerSeconds === sec && !isTimerActive
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sec}d
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setTimerSeconds(60);
                  setIsTimerActive(false);
                }}
                className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 btn-tactile"
                title="Reset ke 60 detik"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setIsTimerActive(prev => !prev);
                }}
                className={`flex-1 py-3 px-6 rounded-full font-black text-sm font-heading shadow-lg flex items-center justify-center gap-2 btn-tactile ${
                  isTimerActive 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isTimerActive ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" /> Jeda Timer
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Mulai Timer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL 2: AMNESIC MODE ================= */}
      {activeSubModal === 'AMNESIC' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="papan-glass-dark rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-black text-white font-heading">Amnesic Mode</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAmnesicPeekRevealed(false);
                  setActiveSubModal(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Lupa kata rahasiamu? Pilih namamu di bawah dan <b>tekan & tahan</b> tombol untuk mengintip kembali katamu tanpa terlihat orang lain.
            </p>

            {/* Select Player */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Pilih Namamu:</label>
              <select
                value={selectedAmnesicPlayerId}
                onChange={(e) => setSelectedAmnesicPlayerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-sky-500"
              >
                {orderedAlivePlayers.map((p, pIdx) => (
                  <option key={p.id} value={p.id}>
                    {p.name.trim() || `Pemain ${pIdx + 1}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Secret Peek Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center min-h-[100px] flex flex-col items-center justify-center">
              {isAmnesicPeekRevealed && selectedAmnesicPlayer ? (
                selectedAmnesicPlayer.role === 'MR_WHITE' ? (
                  <div className="space-y-1 animate-scale-up">
                    <span className="text-base font-black text-amber-400 font-heading">Kamu adalah Mr. White!</span>
                    <p className="text-xs text-slate-400">Kamu tidak memiliki kata rahasia.</p>
                  </div>
                ) : (
                  <div className="space-y-1 animate-scale-up">
                    <span className="text-xs font-bold text-slate-400 uppercase">Kata Rahasiamu:</span>
                    <p className="text-2xl font-black text-[#4ADE80] font-heading tracking-wide">
                      {selectedAmnesicPlayer.word}
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-500">
                  <Lock className="w-6 h-6 stroke-[1.5]" />
                  <span className="text-xs font-medium">Kata tertutup dan aman</span>
                </div>
              )}
            </div>

            {/* Press and Hold Button */}
            <button
              type="button"
              onPointerDown={() => {
                soundEffects.playCardFlip();
                triggerHaptic('light');
                setIsAmnesicPeekRevealed(true);
              }}
              onPointerUp={() => setIsAmnesicPeekRevealed(false)}
              onPointerLeave={() => setIsAmnesicPeekRevealed(false)}
              className="w-full py-4 rounded-2xl bg-sky-600 active:bg-sky-500 text-white font-black text-sm font-heading shadow-lg text-center select-none btn-tactile"
            >
              {isAmnesicPeekRevealed ? 'Lepas untuk Menyembunyikan' : 'Tekan & Tahan untuk Mengintip'}
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL 3: DAFTAR PEMAIN ================= */}
      {activeSubModal === 'PLAYERS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="papan-glass-dark rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white font-heading">Daftar Pemain ({players.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border ${
                    p.isAlive
                      ? 'bg-slate-900/80 border-slate-800 text-white'
                      : 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white font-heading">
                        {(p.name.trim() || `P${idx + 1}`).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold">{p.name.trim() || `Pemain ${idx + 1}`}</span>
                  </div>

                  <div>
                    {p.isAlive ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Hidup
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Keluar
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL 4: PENGATURAN ================= */}
      {activeSubModal === 'SETTINGS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="papan-glass-dark rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-black text-white font-heading">Pengaturan</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  {isSfxActive ? (
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-slate-500" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-white font-heading">Efek Suara (SFX)</p>
                    <p className="text-[11px] text-slate-400">Ketukan & tombol game</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSfx}
                  className={`w-12 h-7 rounded-full p-1 transition-colors btn-tactile ${
                    isSfxActive ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isSfxActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Lo-fi BGM Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3">
                  <Music className={`w-5 h-5 ${isBgmActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-white font-heading">Musik Latar (BGM)</p>
                    <p className="text-[11px] text-slate-400">Musik santai lo-fi synthesizer</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleBgm}
                  className={`w-12 h-7 rounded-full p-1 transition-colors btn-tactile ${
                    isBgmActive ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isBgmActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Scoreboard Modal Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setActiveSubModal(null);
                  onOpenScoreboard();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 btn-tactile"
              >
                Papan Skor Kumulatif
              </button>

              {/* Rulebook Modal Button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setActiveSubModal(null);
                  onOpenRulebook();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 btn-tactile"
              >
                Buku Aturan Permainan
              </button>

              {/* Reset to Lobby */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  const ok = window.confirm('Yakin ingin kembali ke menu awal?');
                  if (ok) {
                    setActiveSubModal(null);
                    onReturnToLobby();
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-800/50 btn-tactile"
              >
                Kembali ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
