import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Player, WinFaction, ActiveWordPair } from '../../types/game';
import { RotateCcw, Home } from 'lucide-react';
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
        colors: ['#16A34A', '#0284C7', '#F59E0B', '#E11D48'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#16A34A', '#0284C7', '#F59E0B', '#E11D48'],
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
          title: 'Warga Sipil Menang! 🛡️',
          badgeColor: 'bg-chameleon-emerald/15 text-chameleon-emerald border-chameleon-emerald/30',
          desc: 'Semua penyusup berhasil dieliminasi sebelum mereka mengambil alih kota!',
        };
      case 'INFILTRATORS_WIN':
        return {
          title: 'Penyusup Menang! 🕵️',
          badgeColor: 'bg-chameleon-amber/15 text-chameleon-amber border-chameleon-amber/30',
          desc: 'Undercover dan Mr. White sukses mengelabui dan menghabisi warga sipil!',
        };
      case 'MR_WHITE_WIN':
        return {
          title: 'Mr. White Menang Sempurna! 🎭',
          badgeColor: 'bg-chameleon-sky/15 text-chameleon-sky border-chameleon-sky/30',
          desc: 'Mr. White berhasil menebak kata rahasia warga sipil dengan tepat!',
        };
      default:
        return {
          title: 'Permainan Selesai',
          badgeColor: 'bg-theme-bg-card border-theme-border text-theme-text-main',
          desc: winReason,
        };
    }
  };

  const winnerInfo = getWinnerInfo();

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Victory Banner */}
      <div className="p-6 rounded-3xl bg-theme-bg-card border-2 border-theme-border shadow-2xl text-center space-y-3 animate-scale-up">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-3xl mx-auto shadow-sm">
          🏆
        </div>

        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${winnerInfo.badgeColor}`}>
            {winnerInfo.title}
          </span>
          <p className="text-xs text-theme-text-muted mt-2 max-w-sm mx-auto leading-relaxed">
            {winReason || winnerInfo.desc}
          </p>
        </div>
      </div>

      {/* Secret Words Revealed */}
      {activeWordPair && (
        <div className="p-4 rounded-2xl bg-theme-bg-card border border-theme-border space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted text-center">
            Pasangan Kata Rahasia ({activeWordPair.category})
          </h4>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 rounded-xl bg-chameleon-emerald/10 border border-chameleon-emerald/20">
              <p className="text-[11px] font-bold text-chameleon-emerald">Kata Civilian:</p>
              <p className="text-lg font-black text-theme-text-main mt-0.5">
                {activeWordPair.civilianWord}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-chameleon-amber/10 border border-chameleon-amber/20">
              <p className="text-[11px] font-bold text-chameleon-amber">Kata Undercover:</p>
              <p className="text-lg font-black text-theme-text-main mt-0.5">
                {activeWordPair.undercoverWord}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Players & Roles Reveal */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
          Ungkap Seluruh Peran & Poin Ronde Ini:
        </h4>

        <div className="space-y-2">
          {players.map(p => {
            const delta = roundScoreDeltas[p.id] || 0;
            return (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-theme-bg-card border border-theme-border flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm text-theme-text-main">
                        {p.name}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        p.role === 'CIVILIAN'
                          ? 'bg-chameleon-emerald/15 text-chameleon-emerald'
                          : p.role === 'UNDERCOVER'
                          ? 'bg-chameleon-amber/15 text-chameleon-amber'
                          : 'bg-chameleon-sky/15 text-chameleon-sky'
                      }`}>
                        {p.role}
                      </span>
                    </div>

                    <p className="text-xs text-theme-text-muted mt-0.5">
                      {p.isAlive ? 'Bertahan Hidup' : `Gugur di Ronde ${p.eliminatedRound || 1}`}
                      {p.specialRole && ` • ${p.specialRole}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-black ${
                    delta > 0 ? 'text-chameleon-emerald' : 'text-theme-text-muted'
                  }`}>
                    {delta > 0 ? `+${delta}` : '0'} pts
                  </span>
                  <p className="text-[10px] text-theme-text-muted">
                    Total: {p.score} pts
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto flex gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onResetToLobby();
            }}
            className="px-4 py-3.5 rounded-2xl bg-theme-bg-card-subtle border border-theme-border font-bold text-xs text-theme-text-main hover:bg-theme-border transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Lobby</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              triggerHaptic('medium');
              onReplayGame();
            }}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-chameleon-emerald text-white font-extrabold text-sm shadow-lg shadow-chameleon-emerald/25 hover:bg-chameleon-emerald-dark active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Lagi (Kata Baru)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
