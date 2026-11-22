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
        <div className="p-4 rounded-2xl bg-sky-500/15 border border-sky-400/40 text-center space-y-2">
          <div className="text-4xl">{mrWhitePlayer.avatar}</div>
          <h4 className="font-black text-lg text-white">
            {mrWhitePlayer.name} adalah Mr. White!
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kamu terpilih untuk dieliminasi, tetapi kamu punya <b>1x kesempatan emas</b> untuk menebak <b>kata rahasia warga sipil (Civilian Word)</b>!
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Tebakan Kata Civilian:
          </label>
          <input
            type="text"
            required
            autoFocus
            placeholder="Ketik kata tebakanmu di sini..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-base font-bold text-white focus:outline-none focus:border-sky-400 text-center"
          />
        </div>

        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 space-y-1">
          <p className="font-semibold text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Aturan Kemenangan:
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
          className="w-full py-4 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 btn-tactile"
        >
          <Send className="w-4 h-4" />
          <span>Kirim Tebakan Sekarang</span>
        </button>
      </form>
    </Modal>
  );
};
