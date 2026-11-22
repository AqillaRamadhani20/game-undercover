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
    <Modal isOpen={isOpen} onClose={() => { }} title="Hasil Voting Seri! ⚖️" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-200">
          Suara terbanyak diperoleh seimbang oleh:{' '}
          <span className="font-bold">
            {tiedPlayers.map(p => p.name).join(' dan ')}
          </span>.
          Pilih metode pemecah seri:
        </div>

        {/* Option 1: Goddess of Justice Decision (if present) */}
        {hasGoddess && goddessPlayer && (
          <div className="p-3.5 rounded-2xl bg-purple-500/15 border border-purple-400/40 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
              <Scale className="w-4 h-4" />
              <span>Keputusan Goddess of Justice ({goddessPlayer.name})</span>
            </div>
            <p className="text-[11px] text-slate-300">
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
                  className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-purple-400 font-bold text-xs text-white flex items-center justify-center gap-2 btn-tactile"
                >
                  <span>{p.avatar}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Option 2: Suit Manual (RPS) */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
            <Swords className="w-4 h-4" />
            <span>Suit Manual (Batu-Gunting-Kertas)</span>
          </div>
          <p className="text-[11px] text-slate-300">
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
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-400 font-bold text-xs text-white flex items-center justify-center gap-2 btn-tactile"
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
            soundEffects.playPop();
            onResolveTie('REVOTE');
          }}
          className="w-full py-3.5 px-4 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-2 btn-tactile"
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Voting Ulang (Hanya Antara Pemain Seri)</span>
        </button>
      </div>
    </Modal>
  );
};
