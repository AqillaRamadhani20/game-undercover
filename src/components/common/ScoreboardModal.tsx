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
          <p className="text-xs text-slate-400">
            Skor tersimpan permanen di perangkat ini.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Yakin ingin mereset seluruh akumulasi skor pemain?')) {
                soundEffects.playClick();
                onResetScores();
              }
            }}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Skor
          </button>
        </div>

        {/* Players Leaderboard */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {sortedProfiles.map((p, index) => {
            let rankBadge = (
              <span className="w-6 text-center text-xs font-semibold text-slate-400">
                #{index + 1}
              </span>
            );

            if (index === 0) {
              rankBadge = <Medal className="w-6 h-6 text-yellow-400 shrink-0" />;
            } else if (index === 1) {
              rankBadge = <Medal className="w-6 h-6 text-slate-300 shrink-0" />;
            } else if (index === 2) {
              rankBadge = <Medal className="w-6 h-6 text-amber-500 shrink-0" />;
            }

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  index === 0
                    ? 'bg-amber-500/15 border-amber-400/50 shadow-md'
                    : 'bg-slate-800/80 border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  {rankBadge}
                  {p.avatarImage ? (
                    <img src={p.avatarImage} alt={p.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm text-white flex items-center gap-1.5 font-heading">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.totalGames} game • {p.totalWins} menang ({p.totalGames > 0 ? Math.round((p.totalWins / p.totalGames) * 100) : 0}%)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 font-heading">
                    {p.totalScore}
                  </span>
                  <span className="text-xs text-slate-400 ml-1 font-heading">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
