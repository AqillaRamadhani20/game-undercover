import React from 'react';
import type { Player } from '../../types/game';
import { MessageSquare, ArrowRight, VolumeX, CheckCircle2 } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface DescriptionScreenProps {
  round: number;
  players: Player[];
  speechOrderIds: string[];
  currentSpeakerIndex: number;
  memeCursePlayerId: string | null;
  onNextSpeaker: () => void;
  onStartDiscussion: () => void;
}

export const DescriptionScreen: React.FC<DescriptionScreenProps> = ({
  round,
  players,
  speechOrderIds,
  currentSpeakerIndex,
  memeCursePlayerId,
  onNextSpeaker,
  onStartDiscussion,
}) => {
  const currentSpeakerId = speechOrderIds[currentSpeakerIndex];
  const currentSpeaker = players.find(p => p.id === currentSpeakerId);
  const isCursed = currentSpeakerId === memeCursePlayerId;
  const isLastSpeaker = currentSpeakerIndex === speechOrderIds.length - 1;

  const handleNext = () => {
    soundEffects.playClick();
    triggerHaptic('light');
    if (isLastSpeaker) {
      onStartDiscussion();
    } else {
      onNextSpeaker();
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6 pb-28">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-chameleon-sky/15 text-chameleon-sky border border-chameleon-sky/30 text-xs font-bold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" /> Fase Deskripsi Kata • Ronde {round}
        </div>
        <h2 className="text-xl font-black text-theme-text-main mt-1">
          Beri 1 Petunjuk Singkat Bergantian
        </h2>
        <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
          Setiap pemain menyebutkan 1 kata atau kalimat pendek yang mendeskripsikan kata rahasianya. Jangan sebut kata itu sendiri!
        </p>
      </div>

      {/* Active Speaker Hero Card */}
      {currentSpeaker && (
        <div className={`p-6 rounded-3xl border-2 shadow-xl text-center space-y-4 transition-all animate-scale-up ${
          isCursed
            ? 'bg-chameleon-purple/10 border-chameleon-purple shadow-chameleon-purple/10'
            : 'bg-theme-bg-card border-chameleon-emerald shadow-chameleon-emerald/10'
        }`}>
          <div className="inline-block relative">
            <div className="w-20 h-20 rounded-2xl bg-theme-bg-card-subtle flex items-center justify-center text-4xl shadow-inner border border-theme-border mx-auto">
              {currentSpeaker.avatar}
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-chameleon-emerald text-white text-xs font-black flex items-center justify-center shadow-md">
              #{currentSpeakerIndex + 1}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase font-bold tracking-widest text-theme-text-muted">
              Giliran Berbicara Sekarang:
            </p>
            <h3 className="text-2xl font-black text-theme-text-main mt-0.5">
              {currentSpeaker.name}
            </h3>
          </div>

          {/* Mr. Meme Curse Notice */}
          {isCursed ? (
            <div className="p-3.5 rounded-2xl bg-chameleon-purple/20 border border-chameleon-purple/40 text-left text-xs text-chameleon-purple flex items-start gap-2.5">
              <VolumeX className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">🎭 Kutukan Mr. Meme Aktif!</p>
                <p className="text-theme-text-muted mt-0.5">
                  {currentSpeaker.name} <b>DILARANG BERBICARA</b> sama sekali! Deskripsikan kata rahasiamu hanya dengan gerakan tubuh / pantomim bisu!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-theme-text-muted italic">
              "Katakan 1 petunjuk mengenai katamu dengan santai dan jangan terlalu jelas!"
            </p>
          )}
        </div>
      )}

      {/* Turn Order List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
          Urutan Giliran Bicara ({speechOrderIds.length} Pemain)
        </h4>

        <div className="space-y-1.5">
          {speechOrderIds.map((pid, idx) => {
            const player = players.find(p => p.id === pid);
            if (!player) return null;
            const isDone = idx < currentSpeakerIndex;
            const isCurrent = idx === currentSpeakerIndex;
            const isMeme = pid === memeCursePlayerId;

            return (
              <div
                key={pid}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-chameleon-emerald/15 border-chameleon-emerald text-theme-text-main font-bold scale-[1.01]'
                    : isDone
                    ? 'bg-theme-bg-card-subtle/50 border-theme-border text-theme-text-muted opacity-60'
                    : 'bg-theme-bg-card border-theme-border text-theme-text-main'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs font-bold text-theme-text-muted">
                    {idx + 1}.
                  </span>
                  <span className="text-xl">{player.avatar}</span>
                  <div>
                    <span className="text-sm font-semibold">{player.name}</span>
                    {isMeme && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-chameleon-purple/20 text-chameleon-purple font-bold">
                        Pantomim
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-chameleon-emerald" />}
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-chameleon-emerald px-2 py-0.5 rounded-full bg-chameleon-emerald/20">
                      Bicara
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto flex gap-2">
          <button
            type="button"
            onClick={onStartDiscussion}
            className="px-4 py-3.5 rounded-2xl bg-theme-bg-card-subtle border border-theme-border text-xs font-bold text-theme-text-muted hover:text-theme-text-main transition"
          >
            Lewati ke Diskusi
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-chameleon-emerald text-white font-extrabold text-sm shadow-lg shadow-chameleon-emerald/25 hover:bg-chameleon-emerald-dark active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <span>{isLastSpeaker ? 'Selesai & Buka Diskusi' : 'Pemain Berikutnya'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
