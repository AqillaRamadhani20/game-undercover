import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Player, WinFaction, ActiveWordPair } from '../../types/game';
import { RotateCcw, Home, Trophy, Crown } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface GameOverScreenProps {
  winner: WinFaction | null;
  winReason: string;
  players: Player[];
  activeWordPair: ActiveWordPair | null;
  roundScoreDeltas: Record<string, number>;
  onReplayGame: () => void;
  onResetToLobby: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  winReason,
  players,
  activeWordPair,
  roundScoreDeltas,
  onReplayGame,
  onResetToLobby,
}) => {
  useEffect(() => {
    soundEffects.playVictory();
    triggerHaptic('double');

    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#0284C7', '#F59E0B', '#EC4899'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#0284C7', '#F59E0B', '#EC4899'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const getWinnerInfo = () => {
    switch (winner) {
      case 'CIVILIANS_WIN':
        return {
          title: 'Warga Sipil Menang',
          badgeColor: 'bg-emerald-950/70 text-emerald-300 border-emerald-600',
          desc: 'Semua penyusup berhasil dieliminasi sebelum mereka mengambil alih permainan.',
        };
      case 'INFILTRATORS_WIN':
        return {
          title: 'Penyusup Menang',
          badgeColor: 'bg-amber-950/70 text-amber-300 border-amber-600',
          desc: 'Undercover dan Mr. White berhasil menyusup dan mengalahkan warga sipil.',
        };
      case 'MR_WHITE_WIN':
        return {
          title: 'Mr. White Menang Sempurna',
          badgeColor: 'bg-sky-950/70 text-sky-300 border-sky-600',
          desc: 'Mr. White berhasil menebak kata rahasia warga sipil dengan tepat.',
        };
      default:
        return {
          title: 'Permainan Selesai',
          badgeColor: 'bg-slate-800 border-slate-700 text-white',
          desc: winReason,
        };
    }
  };

  const winnerInfo = getWinnerInfo();

  // Sort players by total score descending to show final rankings
  const rankedPlayers = [...players].sort((a, b) => {
    const scoreA = (a.score || 0) + (roundScoreDeltas[a.id] || 0);
    const scoreB = (b.score || 0) + (roundScoreDeltas[b.id] || 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    if (a.isAlive !== b.isAlive) return a.isAlive ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10 pb-28">
      {/* Victory Banner (Frosted Glass Papan) */}
      <div className="p-6 rounded-3xl papan-glass shadow-2xl text-center space-y-3 animate-scale-up my-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-sm">
          <Trophy className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div>
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border font-heading ${winnerInfo.badgeColor}`}>
            {winnerInfo.title}
          </span>
          <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed">
            {winReason || winnerInfo.desc}
          </p>
        </div>

        {/* Word Pair Reveal */}
        {activeWordPair && (
          <div className="p-4 rounded-2xl papan-glass-dark text-left space-y-2 mt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-heading">
              Kata Rahasia ({activeWordPair.category}):
            </p>
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Civilian: </span>
                <span className="font-extrabold text-white font-heading">{activeWordPair.civilianWord}</span>
              </div>
              <div>
                <span className="text-slate-400">Undercover: </span>
                <span className="font-extrabold text-amber-400 font-heading">{activeWordPair.undercoverWord}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Final Player Roster & Scores */}
      <div className="space-y-3 my-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 font-heading">
          Peringkat & Skor Akhir Pemain:
        </h4>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {rankedPlayers.map((p, idx) => {
            const rank = idx + 1;
            const delta = roundScoreDeltas[p.id] || 0;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border flex items-center justify-between shadow-sm transition-all ${rank === 1
                    ? 'papan-glass border-amber-400/50 shadow-sm'
                    : rank === 2
                      ? 'papan-glass border-slate-300/40'
                      : rank === 3
                        ? 'papan-glass border-amber-700/40'
                        : 'papan-glass border-white/5'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0 flex items-center justify-center w-7">
                    {rank === 1 ? (
                      <div className="flex flex-col items-center">
                        <Crown className="w-4 h-4 text-amber-300 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                        <span className="text-[10px] font-black text-amber-300 font-heading">#1</span>
                      </div>
                    ) : rank === 2 ? (
                      <div className="flex flex-col items-center">
                        <Crown className="w-3.5 h-3.5 text-slate-200 fill-slate-300/60" />
                        <span className="text-[10px] font-black text-slate-200 font-heading">#2</span>
                      </div>
                    ) : rank === 3 ? (
                      <div className="flex flex-col items-center">
                        <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-700/60" />
                        <span className="text-[10px] font-black text-amber-400 font-heading">#3</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center font-bold text-[11px] font-heading">
                        #{rank}
                      </div>
                    )}
                  </div>

                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg overflow-hidden shrink-0">
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white">{(p.name.trim() || `P${rank}`).charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
                      <span>{p.name.trim() || `Pemain ${rank}`}</span>
                      {!p.isAlive && (
                        <span className="text-[10px] text-slate-500 font-normal">(Gugur)</span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {p.role === 'CIVILIAN' ? 'Civilian' : p.role === 'UNDERCOVER' ? 'Undercover' : 'Mr. White'}
                    </p>
                  </div>
                </div>

                <div className="text-right font-heading">
                  <span className={`text-xs font-black ${delta > 0 ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                    {delta > 0 ? `+${delta}` : '0'} pts
                  </span>
                  <p className="text-[10px] text-slate-400 font-normal">
                    Total: {p.score + delta} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar (Frosted Glass) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 papan-glass-dark border-t border-white/10 z-30">
        <div className="max-w-md mx-auto flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onResetToLobby();
            }}
            className="px-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 font-bold text-xs text-slate-200 hover:bg-slate-700 flex items-center justify-center gap-1.5 btn-tactile font-heading"
          >
            <Home className="w-4 h-4" />
            <span>Lobby</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              triggerHaptic('medium');
              onReplayGame();
            }}
            className="flex-1 py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 btn-tactile font-heading"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi (Langsung Buka Kartu)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
