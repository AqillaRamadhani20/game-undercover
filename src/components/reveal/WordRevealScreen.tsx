import React from 'react';
import type { Player } from '../../types/game';
import { Eye, EyeOff, AlertTriangle, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface WordRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  isCardRevealed: boolean;
  partnerPlayer?: Player | null;
  onRevealCard: () => void;
  onHideAndNext: () => void;
}

export const WordRevealScreen: React.FC<WordRevealScreenProps> = ({
  player,
  playerIndex,
  totalPlayers,
  isCardRevealed,
  partnerPlayer,
  onRevealCard,
  onHideAndNext,
}) => {
  const isLastPlayer = playerIndex === totalPlayers - 1;

  const handleReveal = () => {
    soundEffects.playCardFlip();
    triggerHaptic('medium');
    onRevealCard();
  };

  const handleNext = () => {
    soundEffects.playClick();
    triggerHaptic('light');
    onHideAndNext();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-between min-h-[calc(100vh-4rem)]">
      {/* Step Tracker */}
      <div className="w-full text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-theme-bg-card border border-theme-border text-xs font-semibold text-theme-text-muted">
          <span>Pemain {playerIndex + 1} dari {totalPlayers}</span>
        </div>
        <div className="w-full bg-theme-border h-1.5 rounded-full overflow-hidden mt-2">
          <div 
            className="bg-chameleon-emerald h-full transition-all duration-300"
            style={{ width: `${((playerIndex + 1) / totalPlayers) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card View (Strict Privacy Guard 2-Tahap) */}
      <div className="w-full my-auto py-4">
        {!isCardRevealed ? (
          /* ================= STAGE 1: CLOSED / PRIVACY GUARD ================= */
          /* NOTE: The secret word and role are strictly NOT rendered in DOM here */
          <div className="w-full p-8 rounded-3xl bg-theme-bg-card border-2 border-dashed border-theme-border text-center shadow-xl flex flex-col items-center justify-center space-y-6 animate-scale-up">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-theme-bg-card-subtle flex items-center justify-center text-5xl shadow-inner border border-theme-border">
                {player.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-chameleon-sky text-white shadow-md">
                <EyeOff className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-chameleon-emerald">
                Giliran Melihat Kata
              </p>
              <h2 className="text-2xl font-black text-theme-text-main mt-1">
                Oper HP ke <span className="text-chameleon-sky">{player.name}</span>
              </h2>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-2 max-w-xs text-left">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Pemain lain dilarang mengintip layar saat kata rahasia dibuka!</span>
            </div>

            <button
              type="button"
              onClick={handleReveal}
              className="w-full py-4 px-6 rounded-2xl bg-chameleon-emerald text-white font-extrabold text-base shadow-lg shadow-chameleon-emerald/25 hover:bg-chameleon-emerald-dark active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Buka Kata Rahasia
            </button>
          </div>
        ) : (
          /* ================= STAGE 2: OPEN / WORD REVEALED ================= */
          <div className="w-full p-8 rounded-3xl bg-theme-bg-card border-2 border-chameleon-emerald/40 text-center shadow-2xl flex flex-col items-center justify-center space-y-6 animate-flip">
            <div className="w-20 h-20 rounded-2xl bg-theme-bg-card-subtle flex items-center justify-center text-4xl shadow-inner border border-theme-border">
              {player.avatar}
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-theme-text-muted">
                Halo, {player.name}!
              </p>

              {/* Conditional word display */}
              {player.role === 'MR_WHITE' ? (
                <div className="mt-4 p-5 rounded-2xl bg-chameleon-sky/15 border border-chameleon-sky/40">
                  <span className="text-3xl">🎭</span>
                  <h3 className="text-xl font-black text-chameleon-sky mt-1">
                    Kamu adalah MR. WHITE!
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    Kamu <b>TIDAK memiliki kata</b>! Dengarkan baik-baik petunjuk pemain lain saat giliran bicara, menyamarlah, dan tebak apa kata warga sipil!
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-5 rounded-2xl bg-chameleon-emerald/15 border border-chameleon-emerald/40">
                  <p className="text-xs font-semibold text-chameleon-emerald tracking-wider uppercase">
                    Kata Rahasiamu:
                  </p>
                  <h3 className="text-3xl font-black text-theme-text-main mt-1 tracking-wide">
                    {player.word}
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-2 leading-relaxed">
                    Ingat kata ini baik-baik! Jangan sebutkan kata ini secara langsung saat giliran mendeskripsikan.
                  </p>
                </div>
              )}
            </div>

            {/* Special Role Notification */}
            {player.specialRole && (
              <div className="w-full p-3.5 rounded-xl bg-chameleon-purple/15 border border-chameleon-purple/30 text-left text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-chameleon-purple">
                  <Sparkles className="w-4 h-4" />
                  <span>Peran Spesial: {formatSpecialRoleName(player.specialRole)}</span>
                </div>
                {player.specialRole === 'THE_LOVERS' && partnerPlayer && (
                  <p className="text-theme-text-muted flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    Kekasih rahasiamu adalah <b>{partnerPlayer.name}</b>! Lindungi satu sama lain.
                  </p>
                )}
                {player.specialRole === 'GODDESS_OF_JUSTICE' && (
                  <p className="text-theme-text-muted">
                    Jika hasil voting eliminasi seri, kamu yang memegang hak mutlak memutuskan!
                  </p>
                )}
                {player.specialRole === 'THE_REVENGER' && (
                  <p className="text-theme-text-muted">
                    Jika kamu tereliminasi, kamu berhak menyeret 1 pemain lain ikut keluar!
                  </p>
                )}
                {player.specialRole === 'THE_JOY_FOOL' && (
                  <p className="text-theme-text-muted">
                    Jika kamu menjadi pemain pertama yang tereliminasi di Ronde 1, kamu mendapat bonus +4 poin!
                  </p>
                )}
                {player.specialRole === 'MR_MEME' && (
                  <p className="text-theme-text-muted">
                    Kutukan pantomim bisu Mr. Meme aktif dalam permainan ini!
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl bg-theme-bg-card-subtle border border-theme-border text-theme-text-main font-extrabold text-base hover:bg-theme-border active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <EyeOff className="w-5 h-5 text-chameleon-rose" />
              <span>
                {isLastPlayer ? 'Sembunyikan & Mulai Ronde 1' : 'Sembunyikan & Oper Berikutnya'}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-theme-text-muted">
        Undercover Word Party Game • Pass and Play Offline
      </div>
    </div>
  );
};

function formatSpecialRoleName(role: string): string {
  switch (role) {
    case 'GODDESS_OF_JUSTICE': return 'Goddess of Justice ⚖️';
    case 'THE_LOVERS': return 'The Lovers 💖';
    case 'MR_MEME': return 'Mr. Meme 🤫';
    case 'THE_REVENGER': return 'The Revenger ⚔️';
    case 'THE_JOY_FOOL': return 'The Joy Fool 🤡';
    default: return role;
  }
}
