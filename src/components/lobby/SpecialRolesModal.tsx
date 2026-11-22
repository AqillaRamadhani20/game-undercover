import React from 'react';
import { Modal } from '../common/Modal';
import type { SpecialRoleType } from '../../types/game';
import { 
  JesterSilhouette, 
  LoversSilhouette, 
  GoddessSilhouette, 
  RevengerSilhouette, 
  MemeSilhouette 
} from '../common/UndercoverIcons';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface SpecialRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCount: number;
  enabledRoles: SpecialRoleType[];
  onToggleRole: (role: SpecialRoleType) => void;
}

export const SpecialRolesModal: React.FC<SpecialRolesModalProps> = ({
  isOpen,
  onClose,
  playerCount,
  enabledRoles,
  onToggleRole,
}) => {
  const rolesList: Array<{
    id: SpecialRoleType;
    name: string;
    desc: string;
    minPlayers?: number;
    color: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'THE_JOY_FOOL',
      name: 'The Joy Fool',
      desc: 'Mendapat bonus +4 poin jika menjadi pemain pertama yang tereliminasi di Ronde 1.',
      color: 'text-amber-400',
      icon: <JesterSilhouette className="w-8 h-8" active={enabledRoles.includes('THE_JOY_FOOL')} />,
    },
    {
      id: 'THE_LOVERS',
      name: 'The Lovers',
      desc: '2 pemain terikat cinta rahasia. Jika 1 gugur, pasangannya otomatis ikut tereliminasi!',
      minPlayers: 5,
      color: 'text-rose-400',
      icon: <LoversSilhouette className="w-8 h-8" active={enabledRoles.includes('THE_LOVERS')} />,
    },
    {
      id: 'GODDESS_OF_JUSTICE',
      name: 'Goddess of Justice',
      desc: 'Memutuskan siapa yang gugur jika hasil voting eliminasi seri (tetap aktif meski sudah mati).',
      color: 'text-purple-400',
      icon: <GoddessSilhouette className="w-8 h-8" active={enabledRoles.includes('GODDESS_OF_JUSTICE')} />,
    },
    {
      id: 'THE_REVENGER',
      name: 'The Revenger',
      desc: 'Saat tersingkir oleh voting, berhak menyeret 1 pemain lain yang masih hidup ikut keluar.',
      minPlayers: 5,
      color: 'text-red-400',
      icon: <RevengerSilhouette className="w-8 h-8" active={enabledRoles.includes('THE_REVENGER')} />,
    },
    {
      id: 'MR_MEME',
      name: 'Mr. Meme',
      desc: 'Setiap ronde 1 pemain acak dikutuk dan wajib mendeskripsikan kata HANYA dengan pantomim/gestur bisu.',
      color: 'text-cyan-400',
      icon: <MemeSilhouette className="w-8 h-8" active={enabledRoles.includes('MR_MEME')} />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Peran Khusus" maxWidth="max-w-md">
      <div className="space-y-3">
        <p className="text-xs text-slate-300">
          Sentuh peran khusus di bawah untuk mengaktifkan atau menonaktifkannya dalam permainan:
        </p>

        <div className="space-y-2">
          {rolesList.map(role => {
            const isEnabled = enabledRoles.includes(role.id);
            const isDisabled = !!role.minPlayers && playerCount < role.minPlayers;

            return (
              <div
                key={role.id}
                onClick={() => {
                  if (!isDisabled) {
                    soundEffects.playPop();
                    triggerHaptic('light');
                    onToggleRole(role.id);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between btn-tactile ${
                  isDisabled
                    ? 'opacity-40 bg-slate-800/40 border-slate-700/40 cursor-not-allowed'
                    : isEnabled
                    ? 'bg-slate-800 border-sky-400 shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-900/60 shrink-0">
                    {role.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isEnabled ? 'text-white' : 'text-slate-200'}`}>
                      {role.name}{' '}
                      {isDisabled && (
                        <span className="text-[10px] text-rose-400 font-normal">
                          (Min. {role.minPlayers} pemain)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {role.desc}
                    </p>
                  </div>
                </div>

                <div className="ml-3 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isEnabled
                        ? 'border-sky-400 bg-sky-500 text-white'
                        : 'border-slate-500 bg-transparent'
                    }`}
                  >
                    {isEnabled && <span className="text-xs font-black">✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
