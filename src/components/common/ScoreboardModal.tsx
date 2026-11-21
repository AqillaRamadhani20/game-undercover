import React from 'react';
import { Modal } from './Modal';
import { RotateCcw, Medal } from 'lucide-react';
import type { PlayerProfile } from '../../types/game';
import { soundEffects } from '../../utils/audio';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PlayerProfile[];
  onResetScores: () => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onResetScores,
}) => {
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return b.totalWins - a.totalWins;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Papan Skor & Prestasi" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-theme-text-muted">
            Skor tersimpan permanen di perangkat ini.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Yakin ingin mereset seluruh akumulasi skor pemain?')) {
                soundEffects.playClick();
                onResetScores();
              }
            }}
            className="text-xs text-chameleon-rose hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Skor
          </button>
        </div>

        {/* Players Leaderboard */}
        <div className="space-y-2">
          {sortedProfiles.map((p, index) => {
            let rankBadge = (
              <span className="w-6 text-center text-xs font-semibold text-theme-text-muted">
                #{index + 1}
              </span>
            );

            if (index === 0) {
              rankBadge = <Medal className="w-6 h-6 text-yellow-400 shrink-0" />;
            } else if (index === 1) {
              rankBadge = <Medal className="w-6 h-6 text-slate-400 shrink-0" />;
            } else if (index === 2) {
              rankBadge = <Medal className="w-6 h-6 text-amber-600 shrink-0" />;
            }

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  index === 0
                    ? 'bg-chameleon-amber/10 border-chameleon-amber/40 shadow-sm'
                    : 'bg-theme-bg-card-subtle border-theme-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  {rankBadge}
                  <span className="text-2xl">{p.avatar}</span>
                  <div>
                    <p className="font-bold text-sm text-theme-text-main flex items-center gap-1.5">
                      {p.name}
                    </p>
                    <p className="text-xs text-theme-text-muted">
                      {p.totalGames} game • {p.totalWins} menang ({p.totalGames > 0 ? Math.round((p.totalWins / p.totalGames) * 100) : 0}%)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-chameleon-emerald">
                    {p.totalScore}
                  </span>
                  <span className="text-xs text-theme-text-muted ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
