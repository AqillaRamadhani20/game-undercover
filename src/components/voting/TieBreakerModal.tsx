import React from 'react';
import { Modal } from '../common/Modal';
import type { Player } from '../../types/game';
import { Scale, RotateCcw, Swords } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface TieBreakerModalProps {
  isOpen: boolean;
  tiedPlayerIds: string[];
  players: Player[];
  hasGoddess: boolean;
  goddessPlayer: Player | null;
  onResolveTie: (mode: 'REVOTE' | 'SUIT' | 'GODDESS', chosenPlayerId?: string) => void;
}

export const TieBreakerModal: React.FC<TieBreakerModalProps> = ({
  isOpen,
  tiedPlayerIds,
  players,
  hasGoddess,
  goddessPlayer,
  onResolveTie,
}) => {
  const tiedPlayers = players.filter(p => tiedPlayerIds.includes(p.id));

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Hasil Voting Seri! ⚖️" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
          Suara terbanyak diperoleh seimbang oleh:{' '}
          <span className="font-bold">
            {tiedPlayers.map(p => p.name).join(' dan ')}
          </span>.
          Pilih metode pemecah seri:
        </div>

        {/* Option 1: Goddess of Justice Decision (if present) */}
        {hasGoddess && goddessPlayer && (
          <div className="p-3.5 rounded-2xl bg-chameleon-purple/15 border border-chameleon-purple/40 space-y-3">
            <div className="flex items-center gap-2 text-chameleon-purple font-bold text-xs">
              <Scale className="w-4 h-4" />
              <span>Keputusan Goddess of Justice ({goddessPlayer.name})</span>
            </div>
            <p className="text-[11px] text-theme-text-muted">
              Dewi Keadilan memiliki hak mutlak untuk memilih siapa di antara pemain seri yang harus tereliminasi:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {tiedPlayers.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playElimination();
                    triggerHaptic('heavy');
                    onResolveTie('GODDESS', p.id);
                  }}
                  className="p-2.5 rounded-xl bg-theme-bg-card border border-theme-border hover:border-chameleon-purple font-bold text-xs text-theme-text-main flex items-center justify-center gap-2 transition"
                >
                  <span>{p.avatar}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Option 2: Suit Manual (RPS) */}
        <div className="p-3.5 rounded-2xl bg-theme-bg-card-subtle border border-theme-border space-y-3">
          <div className="flex items-center gap-2 text-chameleon-sky font-bold text-xs">
            <Swords className="w-4 h-4" />
            <span>Suit Manual (Batu-Gunting-Kertas)</span>
          </div>
          <p className="text-[11px] text-theme-text-muted">
            Lakukan suit manual di dunia nyata antara pemain seri. Pilih siapa yang kalah untuk dieliminasi:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {tiedPlayers.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  soundEffects.playElimination();
                  triggerHaptic('heavy');
                  onResolveTie('SUIT', p.id);
                }}
                className="p-2.5 rounded-xl bg-theme-bg-card border border-theme-border hover:border-chameleon-sky font-bold text-xs text-theme-text-main flex items-center justify-center gap-2 transition"
              >
                <span>{p.avatar}</span>
                <span>{p.name} Kalah</span>
              </button>
            ))}
          </div>
        </div>

        {/* Option 3: Voting Ulang */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            onResolveTie('REVOTE');
          }}
          className="w-full py-3 px-4 rounded-xl bg-theme-bg-card border border-theme-border hover:bg-theme-border text-xs font-bold text-theme-text-main transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-chameleon-emerald" />
          <span>Voting Ulang (Hanya Antara Pemain Seri)</span>
        </button>
      </div>
    </Modal>
  );
};
