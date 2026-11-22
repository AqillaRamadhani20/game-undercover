import React, { useEffect } from 'react';
import type { Player } from '../../types/game';
import { Play, Pause, Plus, ArrowRight, Clock, HelpCircle, Users } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface DiscussionScreenProps {
  round: number;
  players: Player[];
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  onTickTimer: () => void;
  onToggleTimer: () => void;
  onAddSeconds: (seconds: number) => void;
  onStartVoting: () => void;
}

export const DiscussionScreen: React.FC<DiscussionScreenProps> = ({
  round,
  players,
  timerSecondsRemaining,
  isTimerRunning,
  onTickTimer,
  onToggleTimer,
  onAddSeconds,
  onStartVoting,
}) => {
  const alivePlayers = players.filter(p => p.isAlive);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSecondsRemaining > 0) {
      interval = setInterval(() => {
        onTickTimer();
        if (timerSecondsRemaining <= 5 && timerSecondsRemaining > 0) {
          soundEffects.playTimerTick();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsRemaining, onTickTimer]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartVote = () => {
    soundEffects.playClick();
    triggerHaptic('medium');
    onStartVoting();
  };

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full papan-glass text-amber-300 text-xs font-bold uppercase tracking-wider font-heading">
          <Clock className="w-3.5 h-3.5" /> Fase Diskusi • Ronde {round}
        </div>
        <h2 className="text-xl font-black text-white mt-1 font-heading">
          Bahas Petunjuk & Temukan Penyusup!
        </h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto">
          Diskusikan siapa yang memberikan deskripsi mencurigakan, janggal, atau terlalu umum.
        </p>
      </div>

      {/* Discussion Timer Card (Frosted Glass Papan) */}
      {timerSecondsRemaining > 0 || isTimerRunning ? (
        <div className="p-6 rounded-3xl papan-glass text-center space-y-4 my-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 font-heading">
            Sisa Waktu Diskusi
          </p>

          <div className="text-5xl font-black tracking-tight font-mono text-amber-400 drop-shadow-md">
            {formatTime(timerSecondsRemaining)}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onToggleTimer();
              }}
              className="px-4 py-2 rounded-full papan-glass-dark text-xs font-bold text-white hover:bg-slate-700 transition flex items-center gap-1.5 btn-tactile font-heading"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400 fill-current" /> Lanjut
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onAddSeconds(30);
              }}
              className="px-4 py-2 rounded-full papan-glass-dark text-xs font-bold text-white hover:bg-slate-700 transition flex items-center gap-1.5 btn-tactile font-heading"
            >
              <Plus className="w-4 h-4" /> +30s
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl papan-glass text-center text-xs text-slate-300 my-3">
          Timer diskusi dinonaktifkan (Diskusi Bebas).
        </div>
      )}

      {/* Alive Players Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-heading">
          <Users className="w-4 h-4 text-cyan-400" /> Pemain yang Bertahan ({alivePlayers.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
          {alivePlayers.map(p => (
            <div
              key={p.id}
              className="p-3 rounded-2xl papan-glass flex items-center gap-2.5 shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                {p.avatarImage ? (
                  <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  p.avatar
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-white truncate font-heading">
                  {p.name.trim() || 'Pemain'}
                </p>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  Hidup
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Advice Callout */}
      <div className="p-3.5 rounded-2xl papan-glass text-xs text-slate-300 space-y-1 my-2">
        <p className="font-bold text-sky-400 flex items-center gap-1.5 font-heading">
          <HelpCircle className="w-3.5 h-3.5" /> Tips Diskusi:
        </p>
        <p className="text-[11px] leading-relaxed">
          • <b>Civilian:</b> Curigai pemain yang petunjuknya terlalu luas dan aman (bisa jadi Mr. White).
        </p>
        <p className="text-[11px] leading-relaxed">
          • <b>Undercover:</b> Perhatikan jika ada pemain yang menyebut hal yang berlawanan dengan katamu.
        </p>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 papan-glass-dark border-t border-white/10 z-30">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleStartVote}
            className="w-full py-4 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 btn-tactile font-heading tracking-wide"
          >
            <span>Mulai Voting Eliminasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
