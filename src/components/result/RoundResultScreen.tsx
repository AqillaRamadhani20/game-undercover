import React from 'react';
import type { Player } from '../../types/game';
import { ArrowRight, Users } from 'lucide-react';
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
  chainEliminations: _chainEliminations,
  players,
  onNextRound,
}) => {
  const alivePlayers = players.filter(p => p.isAlive);
  const deadPlayers = players.filter(p => !p.isAlive);

  const handleNext = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    onNextRound();
  };

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-5 select-none relative z-10 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full papan-glass text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
          Hasil Akhir Ronde {round}
        </div>
        <h2 className="text-xl font-black text-white mt-1 font-heading">
          Identitas Pemain Tereliminasi
        </h2>
      </div>

      {/* Primary Eliminated Player Card (Frosted Glass Papan) */}
      {eliminatedPlayer && (
        <div className="p-6 rounded-3xl papan-glass shadow-xl text-center space-y-4 animate-scale-up my-3">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center text-4xl shadow-inner mx-auto overflow-hidden">
            {eliminatedPlayer.avatarImage ? (
              <img src={eliminatedPlayer.avatarImage} alt={eliminatedPlayer.name} className="w-full h-full object-cover" />
            ) : (
              eliminatedPlayer.avatar
            )}
          </div>

          <div>
            <h3 className="text-2xl font-black text-white font-heading">
              {eliminatedPlayer.name.trim() || 'Pemain'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Telah Tereliminasi di Ronde {round}
            </p>
          </div>

          {/* Role Reveal Banner */}
          <div className={`p-4 rounded-2xl papan-glass-dark border text-sm font-bold flex items-center justify-center gap-2 font-heading ${
            eliminatedPlayer.role === 'CIVILIAN'
              ? 'border-slate-700 text-slate-200'
              : eliminatedPlayer.role === 'UNDERCOVER'
              ? 'border-amber-600/60 text-amber-300'
              : 'border-sky-600/60 text-sky-300'
          }`}>
            <span>
              Peran: {formatRoleName(eliminatedPlayer.role)}
            </span>
          </div>

          {eliminatedPlayer.role === 'CIVILIAN' && (
            <p className="text-xs text-rose-400 font-medium">
              Warga sipil yang tak bersalah telah gugur. Penyusup semakin kuat.
            </p>
          )}

          {eliminatedPlayer.role === 'UNDERCOVER' && (
            <p className="text-xs text-emerald-400 font-medium">
              Satu mata-mata Undercover berhasil dieliminasi warga.
            </p>
          )}

          {eliminatedPlayer.role === 'MR_WHITE' && (
            <p className="text-xs text-sky-400 font-medium">
              Mr. White gagal menebak kata rahasia dan resmi gugur.
            </p>
          )}
        </div>
      )}

      {/* Survivor Status Bar */}
      <div className="p-3 rounded-2xl papan-glass flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-bold font-heading">
          <Users className="w-4 h-4 text-sky-400" /> Pemain Bertahan: {alivePlayers.length}
        </span>
        <span className="text-slate-400 font-heading">
          Tersingkir: {deadPlayers.length}
        </span>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 papan-glass-dark border-t border-white/10 z-30">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg flex items-center justify-center gap-2 btn-tactile"
          >
            <span>Lanjut Voting Ronde {round + 1}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

function formatRoleName(role: string): string {
  switch (role) {
    case 'CIVILIAN':
      return 'Civilian (Warga Sipil)';
    case 'UNDERCOVER':
      return 'Undercover (Penyusup)';
    case 'MR_WHITE':
      return 'Mr. White (Tanpa Kata)';
    default:
      return role;
  }
}
