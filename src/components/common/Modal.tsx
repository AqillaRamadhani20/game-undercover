import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`w-full ${maxWidth} bg-slate-900/95 border-2 border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            aria-label="Tutup"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-white">
          {children}
        </div>
      </div>
    </div>
  );
};
