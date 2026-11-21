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
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chameleon-amber/15 text-chameleon-amber border border-chameleon-amber/30 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" /> Fase Diskusi • Ronde {round}
        </div>
        <h2 className="text-xl font-black text-theme-text-main mt-1">
          Bahas Petunjuk & Temukan Penyusup!
        </h2>
        <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
          Diskusikan siapa yang memberikan deskripsi mencurigakan, melenceng, atau terlalu umum.
        </p>
      </div>

      {/* Discussion Timer Card */}
      {timerSecondsRemaining > 0 || isTimerRunning ? (
        <div className="p-6 rounded-3xl bg-theme-bg-card border border-theme-border shadow-lg text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-theme-text-muted">
            Sisa Waktu Diskusi
          </p>

          <div className="text-5xl font-black tracking-tight font-mono text-chameleon-amber">
            {formatTime(timerSecondsRemaining)}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onToggleTimer();
              }}
              className="px-4 py-2 rounded-xl bg-theme-bg-card-subtle border border-theme-border text-xs font-bold text-theme-text-main hover:bg-theme-border transition flex items-center gap-1.5"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 text-chameleon-amber" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-chameleon-emerald fill-current" /> Lanjut
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onAddSeconds(30);
              }}
              className="px-4 py-2 rounded-xl bg-theme-bg-card-subtle border border-theme-border text-xs font-bold text-theme-text-main hover:bg-theme-border transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> +30s
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-theme-bg-card border border-theme-border text-center text-xs text-theme-text-muted">
          Timer diskusi dinonaktifkan (Diskusi Bebas).
        </div>
      )}

      {/* Alive Players Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5">
          <Users className="w-4 h-4 text-chameleon-sky" /> Pemain yang Bertahan ({alivePlayers.length})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {alivePlayers.map(p => (
            <div
              key={p.id}
              className="p-3 rounded-2xl bg-theme-bg-card border border-theme-border flex items-center gap-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-theme-bg-card-subtle flex items-center justify-center text-xl shrink-0">
                {p.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-theme-text-main truncate">
                  {p.name}
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chameleon-emerald/20 text-chameleon-emerald font-bold">
                  Hidup
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Advice Callout */}
      <div className="p-4 rounded-2xl bg-chameleon-sky/10 border border-chameleon-sky/20 text-xs text-theme-text-muted space-y-1.5">
        <p className="font-bold text-chameleon-sky flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Tips Diskusi:
        </p>
        <p>
          • <b>Civilian:</b> Curigai pemain yang petunjuknya terlalu luas dan aman (bisa jadi Mr. White).
        </p>
        <p>
          • <b>Undercover:</b> Perhatikan jika ada pemain yang menyebut hal yang berlawanan dengan katamu.
        </p>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleStartVote}
            className="w-full py-4 rounded-2xl bg-chameleon-rose text-white font-extrabold text-base shadow-lg shadow-chameleon-rose/25 hover:bg-chameleon-rose/90 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Mulai Voting Eliminasi</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
