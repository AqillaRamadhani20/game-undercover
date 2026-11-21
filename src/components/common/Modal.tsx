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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full ${maxWidth} bg-theme-bg-card border border-theme-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border bg-theme-bg-card-subtle/50">
          <h3 className="text-lg font-bold text-theme-text-main flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-card-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-theme-text-main">
          {children}
        </div>
      </div>
    </div>
  );
};
