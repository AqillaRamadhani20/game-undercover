import React, { useState, useEffect } from 'react';
import type { Player, PlayerProfile } from '../../types/game';
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
  Lock,
  Pencil,
  Trash2,
  Crown,
  Sparkles
} from 'lucide-react';
import { InfiltratorHat } from '../common/UndercoverIcons';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface DescriptionScreenProps {
  round: number;
  players: Player[];
  profiles?: PlayerProfile[];
  speechOrderIds: string[];
  undercoverCount: number;
  mrWhiteCount: number;
  onStartVoting: () => void;
  onReturnToLobby: () => void;
  onOpenRulebook: () => void;
  onOpenScoreboard: () => void;
  onRerollWords: () => void;
  onUpdatePlayerNameById?: (playerId: string, name: string) => void;
  onDeletePlayer?: (playerId: string) => void;
  onAddPlayer?: (name: string) => void;
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
  profiles: _profiles = [],
  speechOrderIds,
  undercoverCount: _undercoverCount,
  mrWhiteCount: _mrWhiteCount,
  onStartVoting,
  onReturnToLobby,
  onOpenRulebook,
  onOpenScoreboard,
  onRerollWords,
  onUpdatePlayerNameById,
  onDeletePlayer,
  onAddPlayer,
}) => {
  // Menu Sheet State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState<'TIMER' | 'AMNESIC' | 'PLAYERS' | 'LEADERBOARD' | 'SETTINGS' | null>(null);

  // Edit Player Name State
  const [editingPlayer, setEditingPlayer] = useState<{ id: string; name: string } | null>(null);
  const [editingNameInput, setEditingNameInput] = useState('');

  // Delete & Add Player Handlers
  const handleDeletePlayer = (playerId: string, playerName: string) => {
    if (players.length <= 3) {
      alert('Minimal 3 pemain untuk bermain!');
      return;
    }
    const confirmDelete = window.confirm(`Hapus pemain "${playerName}" dari permainan?`);
    if (!confirmDelete) return;

    soundEffects.playPop();
    triggerHaptic('medium');
    if (onDeletePlayer) {
      onDeletePlayer(playerId);
      setToastMessage(`Pemain ${playerName} berhasil dihapus`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleAddNewPlayer = () => {
    const newName = window.prompt('Masukkan nama pemain baru:');
    if (!newName || !newName.trim()) return;

    // Check duplicate
    if (players.some(p => p.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      alert(`Nama "${newName.trim()}" sudah digunakan! Gunakan nama berbeda.`);
      return;
    }

    soundEffects.playPop();
    triggerHaptic('medium');
    if (onAddPlayer) {
      onAddPlayer(newName.trim());
      setToastMessage(`Pemain ${newName.trim()} berhasil ditambahkan!`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

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
  const aliveCivilianCount = alivePlayers.filter(p => p.role === 'CIVILIAN').length;

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

  const handleOpenSubModal = (modal: 'TIMER' | 'AMNESIC' | 'PLAYERS' | 'LEADERBOARD' | 'SETTINGS') => {
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

          {/* Card 2: Warga (Civilian) */}
          <div className="papan-glass rounded-2xl px-5 py-2 flex flex-col items-center min-w-[130px]">
            <span className="text-[11px] font-semibold text-slate-300 mb-1">
              Warga (Civilian)
            </span>
            <span className="text-sm font-black text-sky-400 font-heading">
              {aliveCivilianCount} Hidup
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

                {/* Name Capsule Pill (Translucent Frosted Pill, Tap to Edit Name) */}
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setEditingPlayer({ id: player.id, name: player.name });
                    setEditingNameInput(player.name);
                  }}
                  title="Ketuk untuk ubah nama"
                  className="papan-glass rounded-lg px-2.5 py-1 max-w-[100px] text-center shadow-xs mt-2 hover:border-amber-400/60 transition-colors btn-tactile flex items-center justify-center gap-1 group cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {displayName}
                  </span>
                  <Pencil className="w-2.5 h-2.5 text-slate-400 group-hover:text-amber-400 shrink-0" />
                </button>
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

            {/* 4. Papan Peringkat */}
            <button
              type="button"
              onClick={() => handleOpenSubModal('LEADERBOARD')}
              className="w-full flex items-center gap-4 py-2.5 px-3 rounded-2xl hover:bg-slate-800/60 btn-tactile text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-900 flex items-center justify-center shadow-md shrink-0">
                <Crown className="w-6 h-6 fill-amber-950/80 stroke-none" />
              </div>
              <div>
                <span className="text-white text-base font-bold font-heading block">
                  Papan Peringkat
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Mahkota emas, perak & skor pemain
                </span>
              </div>
            </button>

            {/* 5. Pengaturan */}
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

      {/* ================= SUB-MODAL 3: DAFTAR PEMAIN (IMAGE 6) ================= */}
      {activeSubModal === 'PLAYERS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="papan-glass-dark border border-white/20 rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up shadow-2xl">
            {/* Header: Daftar pemain */}
            <h3 className="text-2xl font-black text-white font-heading text-center tracking-wide">
              Daftar pemain
            </h3>

            {/* Top White Role Capsule: Civilian, Undercover, Mr. White + Pencil Button */}
            <div className="bg-white rounded-full py-2 px-5 flex items-center justify-between shadow-lg max-w-[240px] mx-auto text-slate-900">
              {/* Civilian: Blue silhouette */}
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#38BDF8]">
                  <path d="M12 2C8.69 2 6 4.69 6 8c0 2.21 1.2 4.15 3 5.19V14c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-.81c1.8-1.04 3-2.98 3-5.19 0-3.31-2.69-6-6-6z" />
                  <path d="M4 22c0-3.31 3.58-6 8-6s8 2.69 8 6v1H4v-1z" />
                </svg>
                <span className="text-xs font-black text-slate-900 leading-tight mt-0.5">
                  {aliveCivilianCount}
                </span>
              </div>

              {/* Undercover: Black infiltrator hat */}
              <div className="flex flex-col items-center">
                <InfiltratorHat isWhite={false} className="w-5 h-5" />
                <span className="text-xs font-black text-slate-900 leading-tight mt-0.5">
                  {aliveUndercoverCount}
                </span>
              </div>

              {/* Mr. White: White infiltrator hat */}
              <div className="flex flex-col items-center">
                <InfiltratorHat isWhite={true} className="w-5 h-5 filter drop-shadow-xs" />
                <span className="text-xs font-black text-slate-900 leading-tight mt-0.5">
                  {aliveMrWhiteCount}
                </span>
              </div>

              {/* Pencil icon circle button */}
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setToastMessage(`Peran: ${aliveCivilianCount} Civilian, ${aliveUndercoverCount} Undercover, ${aliveMrWhiteCount} Mr. White`);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                title="Info Komposisi Peran"
                className="w-7 h-7 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center shadow-xs btn-tactile"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* "+ Tambahkan pemain" Row (Pink Circle Button + Text) */}
            <button
              type="button"
              onClick={handleAddNewPlayer}
              className="flex items-center gap-3 w-full px-2 py-1 hover:opacity-90 transition-opacity btn-tactile text-left"
            >
              <div className="w-9 h-9 rounded-full bg-[#FB7185] hover:bg-[#F43F5E] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                +
              </div>
              <span className="text-white text-sm font-bold font-heading">
                Tambahkan pemain
              </span>
            </button>

            {/* Player List Rows (Trash icon, Avatar, Green Pill Name, Score 0 PN) */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {players.map((p, idx) => {
                const circleColor = CIRCLE_COLORS[idx % CIRCLE_COLORS.length];
                const initial = (p.name.trim() || `P${idx + 1}`).charAt(0).toUpperCase();
                const score = p.score ?? 0;

                return (
                  <div key={p.id} className="flex items-center justify-between gap-3">
                    {/* Trash Icon Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePlayer(p.id, p.name)}
                      title={`Hapus ${p.name}`}
                      className="text-slate-400 hover:text-rose-400 p-1 btn-tactile transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5 stroke-[2]" />
                    </button>

                    {/* Circular Avatar with Initial Letter */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm font-heading shrink-0 shadow-md overflow-hidden ${circleColor}`}>
                      {p.avatarImage ? (
                        <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>

                    {/* Green Rounded Pill with Player Name */}
                    <div className="bg-[#4ADE80] text-white font-bold text-xs px-4 py-2 rounded-full flex-1 max-w-[170px] truncate text-left shadow-xs">
                      {p.name.trim() || `Pemain ${idx + 1}`}
                    </div>

                    {/* Score on Right: Number and "PN" */}
                    <div className="text-right shrink-0 min-w-[32px] font-heading">
                      <span className="text-sm font-black text-white block leading-tight">
                        {score}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 block leading-tight">
                        PN
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Circular Cyan Check Button (Image 6) */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playPop();
                  setActiveSubModal(null);
                }}
                className="w-14 h-14 rounded-full bg-[#38BDF8] hover:bg-[#0EA5E9] text-white flex items-center justify-center shadow-xl border-2 border-white/20 btn-tactile"
                aria-label="Tutup Daftar Pemain"
              >
                <Check className="w-8 h-8 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUB-MODAL: PAPAN PERINGKAT ================= */}
      {activeSubModal === 'LEADERBOARD' && (() => {
        const rankedPlayers = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="papan-glass-dark border border-white/20 rounded-3xl p-6 max-w-sm w-full space-y-4 animate-scale-up shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/25 to-yellow-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-md">
                    <Crown className="w-6 h-6 fill-amber-400/30 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white font-heading flex items-center gap-1.5">
                      <span>Papan Peringkat</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Peringkat Mahkota & Skor
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center btn-tactile"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {rankedPlayers.map((p, idx) => {
                  const rank = idx + 1;
                  return (
                    <div
                      key={p.id}
                      className={`relative flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        rank === 1
                          ? 'papan-glass border-amber-400/80 bg-amber-500/10 shadow-[0_4px_20px_rgba(245,158,11,0.2)]'
                          : rank === 2
                          ? 'papan-glass border-slate-300/50 bg-slate-300/10 shadow-sm'
                          : rank === 3
                          ? 'papan-glass border-amber-700/50 bg-amber-800/10 shadow-sm'
                          : 'papan-glass border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 flex items-center justify-center w-8">
                          {rank === 1 ? (
                            <div className="flex flex-col items-center">
                              <Crown className="w-5 h-5 text-amber-300 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                              <span className="text-[10px] font-black text-amber-300 font-heading">#1</span>
                            </div>
                          ) : rank === 2 ? (
                            <div className="flex flex-col items-center">
                              <Crown className="w-4 h-4 text-slate-200 fill-slate-300/60" />
                              <span className="text-[10px] font-black text-slate-200 font-heading">#2</span>
                            </div>
                          ) : rank === 3 ? (
                            <div className="flex flex-col items-center">
                              <Crown className="w-4 h-4 text-amber-600 fill-amber-700/60" />
                              <span className="text-[10px] font-black text-amber-400 font-heading">#3</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-xs font-heading">
                              #{rank}
                            </div>
                          )}
                        </div>

                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-sm font-bold shadow-md shrink-0">
                          {p.avatarImage ? (
                            <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className={`font-heading font-black ${
                              rank === 1 ? 'text-amber-300' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-amber-400' : 'text-white'
                            }`}>
                              {(p.name.trim() || `P${rank}`).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-black text-white font-heading truncate">
                            {p.name.trim() || `Pemain ${rank}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2 font-heading">
                        <span className={`text-lg font-black ${
                          rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-amber-500' : 'text-slate-300'
                        }`}>
                          {p.score ?? 0}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveSubModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold btn-tactile"
              >
                Tutup
              </button>
            </div>
          </div>
        );
      })()}

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

      {/* ================= EDIT PLAYER NAME MODAL ================= */}
      {editingPlayer && (() => {
        const trimmedEditing = editingNameInput.trim().toLowerCase();
        const isDuplicateEditName = Boolean(
          trimmedEditing &&
          players.some(p => p.id !== editingPlayer.id && p.name.trim().toLowerCase() === trimmedEditing)
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="papan-glass-dark rounded-3xl p-6 max-w-xs w-full space-y-4 animate-scale-up shadow-2xl border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-black text-white font-heading">
                    Edit Nama Pemain
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center btn-tactile"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-heading">
                    Nama Baru:
                  </label>
                  <input
                    type="text"
                    value={editingNameInput}
                    onChange={(e) => setEditingNameInput(e.target.value)}
                    placeholder="Ketik nama pemain..."
                    maxLength={16}
                    autoFocus
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border-2 text-white text-sm font-bold text-center focus:outline-none font-heading shadow-inner placeholder:text-slate-500 transition-colors ${
                      isDuplicateEditName 
                        ? 'border-rose-500 focus:border-rose-400' 
                        : 'border-slate-600 focus:border-amber-400'
                    }`}
                  />
                  {isDuplicateEditName && (
                    <p className="text-[11px] text-rose-400 font-bold text-center mt-1">
                      ⚠️ Nama sudah digunakan pemain lain! Gunakan nama berbeda.
                    </p>
                  )}
                </div>

                {/* Save & Cancel Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs btn-tactile font-heading"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={!editingNameInput.trim() || isDuplicateEditName}
                    onClick={() => {
                      const trimmed = editingNameInput.trim();
                      if (trimmed && !isDuplicateEditName) {
                        soundEffects.playPop();
                        triggerHaptic('light');
                        onUpdatePlayerNameById?.(editingPlayer.id, trimmed);
                        setEditingPlayer(null);
                      }
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-black text-xs shadow-md btn-tactile font-heading ${
                      !editingNameInput.trim() || isDuplicateEditName
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-black'
                    }`}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
