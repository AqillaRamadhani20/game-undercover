import React from 'react';
import { Modal } from './Modal';
import { Shield, Award, BookOpen } from 'lucide-react';

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Panduan Permainan Undercover" maxWidth="max-w-lg">
      <div className="space-y-5 text-sm">
        {/* Intro */}
        <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700">
          <p className="font-bold text-white text-sm mb-1 font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Misi & Cara Bermain
          </p>
          <p className="text-slate-300 text-xs leading-relaxed">
            Undercover adalah permainan pesta deduksi kata pass-and-play. Setiap pemain melihat kartu rahasia di HP secara bergiliran. Ada yang menjadi <b>Civilian</b>, <b>Undercover</b> yang memiliki kata sedikit berbeda, dan <b>Mr. White</b> yang tidak mendapat kata sama sekali.
          </p>
        </div>

        {/* Roles */}
        <div>
          <h4 className="font-bold text-sm text-white mb-2.5 flex items-center gap-2 font-heading">
            <Shield className="w-4 h-4 text-sky-400" /> Peran Permainan
          </h4>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                CIV
              </div>
              <div>
                <p className="font-bold text-sky-400 text-xs font-heading">Civilian (Warga Sipil)</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                  Mayoritas pemain. Semua warga sipil mendapat <b>kata yang sama persis</b>. Misi kalian adalah saling mengenali sesama warga melalui petunjuk dan menyingkirkan penyusup melalui voting.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                UNC
              </div>
              <div>
                <p className="font-bold text-amber-400 text-xs font-heading">Undercover (Penyusup)</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                  Mendapat kata yang <b>sangat mirip</b> dengan kata Civilian (misalnya: Teh vs Kopi). Undercover harus membaur, mendengarkan petunjuk pemain lain, dan bertahan tanpa ketahuan.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                MW
              </div>
              <div>
                <p className="font-bold text-rose-400 text-xs font-heading">Mr. White (Tanpa Kata)</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                  Tidak memiliki kata rahasia sama sekali. Mr. White harus mengarang petunjuk berdasarkan deskripsi pemain lain. Jika tereliminasi saat voting, Mr. White mendapat <b>1x kesempatan menebak kata Civilian</b> untuk langsung menang seketika.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div>
          <h4 className="font-bold text-sm text-white mb-2 flex items-center gap-2 font-heading">
            <Award className="w-4 h-4 text-emerald-400" /> Sistem Penilaian & Skor
          </h4>
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>Civilian Menang (Semua Penyusup Gugur):</span>
              <span className="font-bold text-emerald-400 font-heading">+2 Poin / Orang</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/60 pt-2">
              <span>Penyusup Menang (Warga sisa &le; 1):</span>
              <span className="font-bold text-amber-400 font-heading">Undercover +10 Poin, Mr. White +6 Poin</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-700/60 pt-2">
              <span>Mr. White Berhasil Menebak Kata:</span>
              <span className="font-bold text-rose-400 font-heading">+6 Poin</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
