import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Player } from '../../types/game';
import { Sparkles, Send } from 'lucide-react';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface MrWhiteGuessModalProps {
  isOpen: boolean;
  mrWhitePlayer: Player;
  onSubmitGuess: (guess: string) => void;
}

export const MrWhiteGuessModal: React.FC<MrWhiteGuessModalProps> = ({
  isOpen,
  mrWhitePlayer,
  onSubmitGuess,
}) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    soundEffects.playClick();
    triggerHaptic('medium');
    onSubmitGuess(guess);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Kesempatan Terakhir Mr. White! 🎭" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-2xl bg-chameleon-sky/15 border border-chameleon-sky/40 text-center space-y-2">
          <div className="text-4xl">{mrWhitePlayer.avatar}</div>
          <h4 className="font-black text-lg text-theme-text-main">
            {mrWhitePlayer.name} adalah Mr. White!
          </h4>
          <p className="text-xs text-theme-text-muted leading-relaxed">
            Kamu terpilih untuk dieliminasi, tetapi kamu punya <b>1x kesempatan emas</b> untuk menebak <b>kata rahasia warga sipil (Civilian Word)</b>!
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
            Tebakan Kata Civilian:
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="Ketik kata tebakanmu di sini..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-theme-bg-card-subtle border border-theme-border text-base font-bold text-theme-text-main focus:outline-none focus:border-chameleon-sky text-center"
          />
        </div>

        <div className="p-3 rounded-xl bg-theme-bg-card-subtle border border-theme-border text-[11px] text-theme-text-muted space-y-1">
          <p className="font-semibold text-theme-text-main flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-chameleon-sky" /> Aturan Kemenangan:
          </p>
          <p>
            • Jika tebakanmu <b>BENAR</b>: Kamu langsung memenangkan seluruh permainan dan mendapat <b>+6 poin</b>!
          </p>
          <p>
            • Jika <b>SALAH</b>: Kamu resmi tereliminasi dan permainan dilanjutkan.
          </p>
        </div>

        <button
          type="submit"
          disabled={!guess.trim()}
          className="w-full py-4 rounded-2xl bg-chameleon-sky text-white font-extrabold text-sm shadow-lg shadow-chameleon-sky/25 hover:bg-chameleon-sky/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Tebakan Sekarang</span>
        </button>
      </form>
    </Modal>
  );
};
