import React from 'react';
import type { Player } from '../../types/game';
import { ArrowRight, HeartCrack, Users } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface RoundResultScreenProps {
  round: number;
  eliminatedPlayer: Player | null;
  chainEliminations: Player[];
  players: Player[];
  onNextRound: () => void;
}

export const RoundResultScreen: React.FC<RoundResultScreenProps> = ({
  round,
  eliminatedPlayer,
  chainEliminations,
  players,
  onNextRound,
}) => {
  const alivePlayers = players.filter(p => p.isAlive);
  const deadPlayers = players.filter(p => !p.isAlive);

  const handleNext = () => {
    soundEffects.playClick();
    triggerHaptic('light');
    onNextRound();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg-card border border-theme-border text-xs font-bold uppercase tracking-wider text-theme-text-muted">
          Hasil Akhir Ronde {round}
        </div>
        <h2 className="text-xl font-black text-theme-text-main mt-1">
          Identitas Pemain Tereliminasi
        </h2>
      </div>

      {/* Primary Eliminated Player Card */}
      {eliminatedPlayer && (
        <div className="p-6 rounded-3xl bg-theme-bg-card border-2 border-theme-border shadow-xl text-center space-y-4 animate-scale-up">
          <div className="w-20 h-20 rounded-2xl bg-theme-bg-card-subtle flex items-center justify-center text-4xl shadow-inner border border-theme-border mx-auto">
            {eliminatedPlayer.avatar}
          </div>

          <div>
            <h3 className="text-2xl font-black text-theme-text-main">
              {eliminatedPlayer.name}
            </h3>
            <p className="text-xs text-theme-text-muted mt-0.5">
              Telah Tereliminasi di Ronde {round}
            </p>
          </div>

          {/* Role Reveal Banner */}
          <div className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 ${
            eliminatedPlayer.role === 'CIVILIAN'
              ? 'bg-chameleon-emerald/15 border-chameleon-emerald/30 text-chameleon-emerald'
              : eliminatedPlayer.role === 'UNDERCOVER'
              ? 'bg-chameleon-amber/15 border-chameleon-amber/30 text-chameleon-amber'
              : 'bg-chameleon-sky/15 border-chameleon-sky/30 text-chameleon-sky'
          }`}>
            <span className="text-xl">
              {eliminatedPlayer.role === 'CIVILIAN' ? '🛡️' : eliminatedPlayer.role === 'UNDERCOVER' ? '🕵️' : '🎭'}
            </span>
            <span>
              Peran: {formatRoleName(eliminatedPlayer.role)}
            </span>
          </div>

          {eliminatedPlayer.role === 'CIVILIAN' && (
            <p className="text-xs text-chameleon-rose font-medium">
              Warga sipil yang tak bersalah telah gugur! Penyusup semakin leluasa.
            </p>
          )}

          {eliminatedPlayer.role === 'UNDERCOVER' && (
            <p className="text-xs text-chameleon-emerald font-medium">
              Satu mata-mata Undercover berhasil dibongkar warga!
            </p>
          )}

          {eliminatedPlayer.role === 'MR_WHITE' && (
            <p className="text-xs text-chameleon-sky font-medium">
              Mr. White gagal menebak kata rahasia dan resmi gugur!
            </p>
          )}

          {/* Joy Fool Bonus Notice */}
          {eliminatedPlayer.specialRole === 'THE_JOY_FOOL' && round === 1 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-400 font-medium">
              🤡 The Joy Fool gugur pertama di ronde 1 dan meraih bonus +4 poin!
            </div>
          )}
        </div>
      )}

      {/* Lovers Chain Elimination Card (if any) */}
      {chainEliminations.length > 0 && (
        <div className="space-y-2">
          {chainEliminations.map(cp => (
            <div
              key={cp.id}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2 animate-scale-up"
            >
              <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-sm">
                <HeartCrack className="w-5 h-5" />
                <span>Tragedi The Lovers!</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-theme-text-main font-bold">
                <span className="text-2xl">{cp.avatar}</span>
                <span>{cp.name} ({formatRoleName(cp.role)})</span>
              </div>
              <p className="text-xs text-theme-text-muted">
                Ikut gugur karena pasangannya tereliminasi!
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Game Status Summary */}
      <div className="p-4 rounded-2xl bg-theme-bg-card border border-theme-border space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5">
          <Users className="w-4 h-4 text-chameleon-sky" /> Status Pemain Saat Ini
        </h4>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-chameleon-emerald/10 border border-chameleon-emerald/20">
            <p className="text-2xl font-black text-chameleon-emerald">{alivePlayers.length}</p>
            <p className="text-xs font-semibold text-theme-text-muted">Masih Bertahan</p>
          </div>
          <div className="p-3 rounded-xl bg-chameleon-rose/10 border border-chameleon-rose/20">
            <p className="text-2xl font-black text-chameleon-rose">{deadPlayers.length}</p>
            <p className="text-xs font-semibold text-theme-text-muted">Tereliminasi</p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-chameleon-emerald text-white font-extrabold text-base shadow-lg shadow-chameleon-emerald/25 hover:bg-chameleon-emerald-dark active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>Lanjut Ronde {round + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatRoleName(role: string): string {
  switch (role) {
    case 'CIVILIAN': return 'Civilian (Warga Sipil)';
    case 'UNDERCOVER': return 'Undercover (Penyusup)';
    case 'MR_WHITE': return 'Mr. White';
    default: return role;
  }
}
