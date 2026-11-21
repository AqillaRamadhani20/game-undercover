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
    soundEffects.playClick();
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
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chameleon-rose/15 text-chameleon-rose border border-chameleon-rose/30 text-xs font-bold uppercase tracking-wider">
          <Skull className="w-3.5 h-3.5" /> Fase Voting • Ronde {round}
        </div>
        <h2 className="text-xl font-black text-theme-text-main mt-1">
          Pilih 1 Pemain untuk Dieliminasi
        </h2>
        <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
          Pemain dengan suara terbanyak akan dikeluarkan dari permainan.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 rounded-xl bg-theme-bg-card-subtle border border-theme-border max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setVoteMode('QUICK');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
            voteMode === 'QUICK'
              ? 'bg-theme-bg-card text-theme-text-main shadow-xs'
              : 'text-theme-text-muted'
          }`}
        >
          Konsensus Cepat
        </button>
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setVoteMode('BALLOT');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
            voteMode === 'BALLOT'
              ? 'bg-theme-bg-card text-theme-text-main shadow-xs'
              : 'text-theme-text-muted'
          }`}
        >
          Hitung Suara Satuan
        </button>
      </div>

      {voteMode === 'QUICK' ? (
        /* ================= QUICK SELECTION MODE ================= */
        <div className="space-y-3">
          <p className="text-xs text-theme-text-muted text-center">
            Sentuh nama pemain yang disepakati untuk dieliminasi:
          </p>

          <div className="space-y-2">
            {alivePlayers.map(p => {
              const isSelected = selectedCandidateId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectQuick(p.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-chameleon-rose/15 border-chameleon-rose shadow-md scale-[1.01]'
                      : 'bg-theme-bg-card border-theme-border hover:border-chameleon-rose/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.avatar}</span>
                    <div>
                      <p className="font-bold text-sm text-theme-text-main">
                        {p.name}
                      </p>
                      <p className="text-xs text-theme-text-muted">
                        Pemain Aktif
                      </p>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-chameleon-rose border-chameleon-rose text-white shadow-sm'
                      : 'border-theme-border text-transparent'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= DETAILED BALLOT TALLY MODE ================= */
        <div className="space-y-4">
          <p className="text-xs text-theme-text-muted text-center">
            Pemain hidup memberi suara satu persatu:
          </p>

          <div className="space-y-3">
            {alivePlayers.map(voter => {
              const currentVoteTarget = votes[voter.id];
              return (
                <div
                  key={voter.id}
                  className="p-3 rounded-xl bg-theme-bg-card border border-theme-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{voter.avatar}</span>
                      <span className="text-xs font-bold text-theme-text-main">
                        {voter.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-theme-text-muted">
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
                              soundEffects.playClick();
                              onCastVote(voter.id, candidate.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              isChosen
                                ? 'bg-chameleon-rose text-white'
                                : 'bg-theme-bg-card-subtle text-theme-text-muted hover:text-theme-text-main'
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
          <div className="p-4 rounded-2xl bg-theme-bg-card border border-theme-border space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
              Rekap Suara Masuk:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {alivePlayers.map(p => (
                <div
                  key={p.id}
                  className="p-2 rounded-xl bg-theme-bg-card-subtle flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-theme-text-main truncate">
                    {p.name}
                  </span>
                  <span className="text-xs font-black text-chameleon-rose px-2 py-0.5 rounded-full bg-chameleon-rose/10">
                    {voteCounts[p.id] || 0} suara
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleConfirmElimination}
            disabled={voteMode === 'QUICK' && !selectedCandidateId}
            className="w-full py-4 rounded-2xl bg-chameleon-rose text-white font-extrabold text-base shadow-lg shadow-chameleon-rose/25 hover:bg-chameleon-rose/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UserX className="w-5 h-5" />
            <span>
              {voteMode === 'QUICK' && selectedCandidate
                ? `Eliminasi ${selectedCandidate.name}`
                : 'Hitung Hasil Voting'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
