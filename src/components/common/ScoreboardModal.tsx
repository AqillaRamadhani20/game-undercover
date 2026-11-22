import React from 'react';
import { Modal } from './Modal';
import { RotateCcw, Crown, Sparkles } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Papan Skor & Peringkat Pemain" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Header Notice */}
        <div className="flex items-center justify-between pb-1">
          <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Peringkat 1 Mahkota Emas, 2 Perak, 3 Perunggu</span>
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Yakin ingin mereset seluruh akumulasi skor pemain?')) {
                soundEffects.playClick();
                onResetScores();
              }
            }}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold btn-tactile font-heading"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Skor
          </button>
        </div>

        {/* Players Leaderboard */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {sortedProfiles.map((p, index) => {
            const rank = index + 1;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'papan-glass border-amber-400/80 bg-amber-500/15 shadow-[0_4px_20px_rgba(245,158,11,0.2)]'
                    : rank === 2
                    ? 'papan-glass border-slate-300/50 bg-slate-300/10 shadow-sm'
                    : rank === 3
                    ? 'papan-glass border-amber-700/50 bg-amber-800/10 shadow-sm'
                    : 'papan-glass border-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Crown / Badge */}
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

                  {/* Profile Avatar */}
                  <div className={`w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center text-sm font-bold shadow-md shrink-0 ${
                    rank === 1
                      ? 'border-2 border-amber-400 ring-2 ring-amber-400/30'
                      : rank === 2
                      ? 'border-2 border-slate-300'
                      : rank === 3
                      ? 'border-2 border-amber-700'
                      : 'border border-white/10'
                  }`}>
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

                  <div>
                    <p className="font-bold text-sm text-white flex items-center gap-1.5 font-heading">
                      {p.name.trim() || `Pemain ${rank}`}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {p.totalGames} game • {p.totalWins} menang ({p.totalGames > 0 ? Math.round((p.totalWins / p.totalGames) * 100) : 0}%)
                    </p>
                  </div>
                </div>

                <div className="text-right font-heading">
                  <span className={`text-xl font-black ${
                    rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-200' : rank === 3 ? 'text-amber-500' : 'text-emerald-400'
                  }`}>
                    {p.totalScore}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1 font-bold">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
