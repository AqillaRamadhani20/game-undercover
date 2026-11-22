import React, { useState } from 'react';
import type { Player } from '../../types/game';
import { Check, UserX, Skull } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface VotingScreenProps {
  round: number;
  players: Player[];
  votes: Record<string, string>;
  quickCandidateId: string | null;
  onCastVote: (voterId: string, candidateId: string) => void;
  onSetQuickCandidate: (candidateId: string | null) => void;
  onResolveVoting: () => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  round,
  players,
  votes,
  quickCandidateId,
  onCastVote,
  onSetQuickCandidate,
  onResolveVoting,
}) => {
  const [voteMode, setVoteMode] = useState<'QUICK' | 'BALLOT'>('QUICK');
  const alivePlayers = players.filter(p => p.isAlive);

  // Compute vote counts for each alive player
  const voteCounts: Record<string, number> = {};
  alivePlayers.forEach(p => {
    voteCounts[p.id] = 0;
  });
  Object.values(votes).forEach(cid => {
    if (voteCounts[cid] !== undefined) {
      voteCounts[cid]++;
    }
  });

  const selectedCandidateId = quickCandidateId;
  const selectedCandidate = players.find(p => p.id === selectedCandidateId);

  const handleSelectQuick = (id: string) => {
    soundEffects.playSelect();
    triggerHaptic('light');
    if (quickCandidateId === id) {
      onSetQuickCandidate(null);
    } else {
      onSetQuickCandidate(id);
    }
  };

  const handleConfirmElimination = () => {
    soundEffects.playElimination();
    triggerHaptic('heavy');
    onResolveVoting();
  };

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider font-heading">
          <Skull className="w-3.5 h-3.5" /> Ronde {round} • Voting Eliminasi
        </div>
        <h2 className="text-xl font-black text-white mt-1 font-heading">
          Bahas Bersama & Pilih Pemain
        </h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto">
          Diskusikan petunjuk pemain di ruangan. Pilih siapa yang dicurigai sebagai penyusup.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 rounded-full bg-slate-900 border border-slate-700 max-w-xs mx-auto my-3 font-heading">
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            setVoteMode('QUICK');
          }}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold btn-tactile ${voteMode === 'QUICK'
            ? 'bg-rose-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          Konsensus Cepat
        </button>
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            setVoteMode('BALLOT');
          }}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold btn-tactile ${voteMode === 'BALLOT'
            ? 'bg-rose-600 text-white shadow-xs'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          Voting Per Pemain
        </button>
      </div>

      {/* Main Voting Body */}
      {voteMode === 'QUICK' ? (
        /* ================= QUICK CONSENSUS SELECTION ================= */
        <div className="space-y-4">
          <p className="text-xs text-slate-400 text-center font-medium">
            Ketuk pemain yang dicurigai:
          </p>

          <div className="grid grid-cols-2 gap-2.5 max-h-[52vh] overflow-y-auto p-1">
            {alivePlayers.map(p => {
              const isSelected = selectedCandidateId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectQuick(p.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer flex items-center gap-3 btn-tactile shadow-sm ${isSelected
                    ? 'bg-rose-600/20 border-rose-500 shadow-rose-500/10'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    }`}
                >
                  {/* Avatar / Photo Thumbnail */}
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg overflow-hidden shrink-0 border border-slate-600">
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.avatar
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-bold text-white truncate font-heading">
                      {p.name.trim() || `Pemain ${alivePlayers.indexOf(p) + 1}`}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isSelected ? 'Terpilih' : 'Ketuk untuk pilih'}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= DETAILED BALLOT TALLY MODE ================= */
        <div className="space-y-4">
          <p className="text-xs text-slate-400 text-center">
            Pemain hidup memberi suara satu persatu:
          </p>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {alivePlayers.map(voter => {
              const currentVoteTarget = votes[voter.id];
              return (
                <div
                  key={voter.id}
                  className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xs">
                        {voter.avatarImage ? (
                          <img src={voter.avatarImage} alt={voter.name} className="w-full h-full object-cover" />
                        ) : (
                          voter.avatar
                        )}
                      </div>
                      <span className="text-xs font-bold text-white font-heading">
                        {voter.name.trim() || `Pemain ${alivePlayers.indexOf(voter) + 1}`}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {currentVoteTarget
                        ? `Memilih: ${players.find(p => p.id === currentVoteTarget)?.name}`
                        : 'Belum memilih'}
                    </span>
                  </div>

                  {/* Target Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {alivePlayers
                      .filter(candidate => candidate.id !== voter.id)
                      .map(candidate => {
                        const isChosen = currentVoteTarget === candidate.id;
                        return (
                          <button
                            key={candidate.id}
                            type="button"
                            onClick={() => {
                              soundEffects.playSelect();
                              onCastVote(voter.id, candidate.id);
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold btn-tactile ${isChosen
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-700 text-slate-300 hover:text-white'
                              }`}
                          >
                            {candidate.name}
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Vote Tally Results */}
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rekap Suara Masuk:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {alivePlayers.map(p => (
                <div
                  key={p.id}
                  className="p-2 rounded-xl bg-slate-900 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-white truncate font-heading">
                    {p.name.trim() || `Pemain ${alivePlayers.indexOf(p) + 1}`}
                  </span>
                  <span className="text-xs font-black text-rose-400 px-2 py-0.5 rounded-full bg-rose-500/20 font-heading">
                    {voteCounts[p.id] || 0} suara
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800 z-30">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleConfirmElimination}
            disabled={voteMode === 'QUICK' && !selectedCandidateId}
            className="w-full py-4 px-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-tactile font-heading"
          >
            <UserX className="w-5 h-5" />
            <span>
              {voteMode === 'QUICK' && selectedCandidate
                ? `Eliminasi ${selectedCandidate.name.trim() || 'Pemain'}`
                : 'Hitung Hasil Voting'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
