import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { WordPair } from '../../types/game';
import { CATEGORIES } from '../../data/wordPairs';
import { Plus, Trash2 } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface PersonalWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalWords: WordPair[];
  onSaveWords: (words: WordPair[]) => void;
}

export const PersonalWordsModal: React.FC<PersonalWordsModalProps> = ({
  isOpen,
  onClose,
  personalWords,
  onSaveWords,
}) => {
  const [wordA, setWordA] = useState('');
  const [wordB, setWordB] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [hint, setHint] = useState('');
  const [error, setError] = useState('');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordA.trim() || !wordB.trim()) {
      setError('Kata A dan Kata B wajib diisi!');
      return;
    }
    if (wordA.trim().toLowerCase() === wordB.trim().toLowerCase()) {
      setError('Kata A dan Kata B tidak boleh persis sama!');
      return;
    }
    if (wordA.trim().includes(' ') || wordB.trim().includes(' ')) {
      setError('Gunakan 1 kata saja untuk masing-masing kata (tanpa spasi)!');
      return;
    }

    const newPair: WordPair = {
      id: `custom-${Date.now()}`,
      category,
      wordA: wordA.trim(),
      wordB: wordB.trim(),
      hint: hint.trim() || undefined,
      isCustom: true,
    };

    soundEffects.playClick();
    onSaveWords([...personalWords, newPair]);
    setWordA('');
    setWordB('');
    setHint('');
    setError('');
  };

  const handleDeleteWord = (id: string) => {
    soundEffects.playClick();
    onSaveWords(personalWords.filter(w => w.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kelola Kata Kustom (Personal Words)" maxWidth="max-w-md">
      <div className="space-y-5">
        {/* Form */}
        <form onSubmit={handleAddWord} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 shadow-inner">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Tambah Pasangan Kata Baru
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-300">Kata 1 (Warga/Penyusup)</label>
              <input
                type="text"
                placeholder="mis. Boba"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Kata 2 (Mirip tapi beda)</label>
              <input
                type="text"
                placeholder="mis. Cendol"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-300">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 transition"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Kustom Pribadi">Kustom Pribadi</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Petunjuk / Hint (Opsional)</label>
              <input
                type="text"
                placeholder="mis. Minuman manis"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md btn-tactile"
          >
            <Plus className="w-4 h-4" /> Simpan Pasangan Kata
          </button>
        </form>

        {/* Existing custom words */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daftar Kata Kustom ({personalWords.length})
            </h4>
          </div>

          {personalWords.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-700 rounded-2xl text-slate-400 text-xs">
              Belum ada kata kustom. Buat kata rahasiamu sendiri di form atas!
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {personalWords.map(word => (
                <div
                  key={word.id}
                  className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between hover:border-slate-600 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {word.wordA} <span className="text-cyan-400 font-normal">vs</span> {word.wordB}
                    </p>
                    <p className="text-xs text-slate-400">
                      {word.category} {word.hint ? `• ${word.hint}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWord(word.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Hapus kata"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
