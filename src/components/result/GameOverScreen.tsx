import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Player, WinFaction, ActiveWordPair } from '../../types/game';
import { RotateCcw, Home, Trophy } from 'lucide-react';
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

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10 pb-28">
      {/* Victory Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl text-center space-y-3 animate-scale-up my-3">
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
          <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-left space-y-2 mt-2">
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
          Peran & Skor Akhir Pemain:
        </h4>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {players.map(p => {
            const delta = roundScoreDeltas[p.id] || 0;
            return (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg overflow-hidden shrink-0">
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white">{p.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
                      <span>{p.name.trim() || `Pemain ${players.indexOf(p) + 1}`}</span>
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
                  <span className={`text-xs font-black ${
                    delta > 0 ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {delta > 0 ? `+${delta}` : '0'} pts
                  </span>
                  <p className="text-[10px] text-slate-400 font-normal">
                    Total: {p.score} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 z-30">
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
