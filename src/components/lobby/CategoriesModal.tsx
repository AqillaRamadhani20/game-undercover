import React from 'react';
import { Modal } from '../common/Modal';
import { CATEGORIES } from '../../data/wordPairs';
import { Check, Plus, BookOpen } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  totalWordPairsCount: number;
  onToggleCategory: (cat: string) => void;
  onOpenPersonalWords: () => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategories,
  totalWordPairsCount,
  onToggleCategory,
  onOpenPersonalWords,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Kategori Kata" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-bold">
            <BookOpen className="w-4 h-4 text-emerald-400" /> Tersedia {totalWordPairsCount} Pasang Kata
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPersonalWords();
            }}
            className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Buat Kata Kustom
          </button>
        </div>

        <div className="space-y-2">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <div
                key={cat}
                onClick={() => {
                  soundEffects.playPop();
                  onToggleCategory(cat);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between btn-tactile ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-400 shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                }`}
              >
                <span className="font-bold text-sm text-white">{cat}</span>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500 text-white'
                      : 'border-slate-500 bg-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
