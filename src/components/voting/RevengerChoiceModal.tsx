import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Player } from '../../types/game';
import { Skull } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface RevengerChoiceModalProps {
  isOpen: boolean;
  revenger: Player;
  alivePlayers: Player[];
  onSelectTarget: (targetId: string) => void;
}

export const RevengerChoiceModal: React.FC<RevengerChoiceModalProps> = ({
  isOpen,
  revenger,
  alivePlayers,
  onSelectTarget,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const targets = alivePlayers.filter(p => p.id !== revenger.id);

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    soundEffects.playElimination();
    triggerHaptic('heavy');
    onSelectTarget(selectedTargetId);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Dendam The Revenger! ⚔️" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-chameleon-rose/15 border border-chameleon-rose/40 text-center space-y-2">
          <div className="text-4xl">{revenger.avatar}</div>
          <h4 className="font-black text-lg text-theme-text-main">
            {revenger.name} adalah The Revenger!
          </h4>
          <p className="text-xs text-theme-text-muted leading-relaxed">
            Sebelum gugur, The Revenger berhak menarik <b>1 pemain lain yang masih hidup</b> untuk ikut tereliminasi bersamanya!
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
            Pilih Target Balas Dendam:
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {targets.map(p => {
              const isSelected = selectedTargetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedTargetId(p.id);
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 transition ${
                    isSelected
                      ? 'bg-chameleon-rose/20 border-chameleon-rose text-chameleon-rose shadow-xs'
                      : 'bg-theme-bg-card-subtle border-theme-border text-theme-text-main hover:border-chameleon-rose/40'
                  }`}
                >
                  <span className="text-xl">{p.avatar}</span>
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedTargetId}
          className="w-full py-4 rounded-2xl bg-chameleon-rose text-white font-extrabold text-sm shadow-lg shadow-chameleon-rose/25 hover:bg-chameleon-rose/90 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Skull className="w-4 h-4" />
          <span>Seret Pemain Ini ke Eliminasi!</span>
        </button>
      </div>
    </Modal>
  );
};
