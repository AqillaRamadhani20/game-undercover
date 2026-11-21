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
        <form onSubmit={handleAddWord} className="p-4 rounded-xl bg-theme-bg-card-subtle border border-theme-border space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
            Tambah Pasangan Kata Baru
          </p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-theme-text-muted">Kata 1 (Warga/Penyusup)</label>
              <input
                type="text"
                placeholder="mis. Boba"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-theme-bg border border-theme-border text-theme-text-main focus:outline-none focus:border-chameleon-emerald"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-theme-text-muted">Kata 2 (Mirip tapi beda)</label>
              <input
                type="text"
                placeholder="mis. Cendol"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-theme-bg border border-theme-border text-theme-text-main focus:outline-none focus:border-chameleon-emerald"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-theme-text-muted">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-theme-bg border border-theme-border text-theme-text-main focus:outline-none focus:border-chameleon-emerald"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Kustom Pribadi">Kustom Pribadi</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-theme-text-muted">Petunjuk / Hint (Opsional)</label>
              <input
                type="text"
                placeholder="mis. Minuman manis"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-theme-bg border border-theme-border text-theme-text-main focus:outline-none focus:border-chameleon-emerald"
              />
            </div>
          </div>

          {error && <p className="text-xs text-chameleon-rose font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-chameleon-emerald text-white font-semibold text-sm hover:bg-chameleon-emerald-dark transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Simpan Pasangan Kata
          </button>
        </form>

        {/* Existing custom words */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text-muted">
              Daftar Kata Kustom ({personalWords.length})
            </h4>
          </div>

          {personalWords.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-theme-border rounded-xl text-theme-text-muted text-xs">
              Belum ada kata kustom. Buat kata rahasiamu sendiri di form atas!
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {personalWords.map(word => (
                <div
                  key={word.id}
                  className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-theme-text-main">
                      {word.wordA} <span className="text-chameleon-sky font-normal">vs</span> {word.wordB}
                    </p>
                    <p className="text-xs text-theme-text-muted">
                      {word.category} {word.hint ? `• ${word.hint}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWord(word.id)}
                    className="p-1.5 text-chameleon-rose hover:bg-chameleon-rose/10 rounded-lg transition"
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
