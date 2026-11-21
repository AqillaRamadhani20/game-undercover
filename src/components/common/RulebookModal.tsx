import React from 'react';
import { Modal } from './Modal';
import { Shield, Sparkles, Heart, Award, Swords, Smile } from 'lucide-react';

interface RulebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulebookModal: React.FC<RulebookModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Panduan Permainan Undercover" maxWidth="max-w-lg">
      <div className="space-y-6 text-sm">
        {/* Intro */}
        <div className="p-3.5 rounded-xl bg-chameleon-sky/10 border border-chameleon-sky/20">
          <p className="font-semibold text-chameleon-sky text-base mb-1">
            Misi & Cara Bermain 🦎
          </p>
          <p className="text-theme-text-muted leading-relaxed">
            Undercover adalah permainan deduksi kata sosial. Setiap pemain menerima kata rahasia di HP secara bergantian, kecuali <b>Mr. White</b> yang tidak mendapat kata sama sekali! Temukan siapa penyusup di antara kalian sebelum terlambat.
          </p>
        </div>

        {/* Roles */}
        <div>
          <h4 className="font-bold text-base text-theme-text-main mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-chameleon-emerald" /> Peran Utama
          </h4>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-theme-bg-card-subtle border border-theme-border flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-chameleon-emerald/20 text-chameleon-emerald flex items-center justify-center font-bold text-lg shrink-0">
                🛡️
              </div>
              <div>
                <p className="font-bold text-chameleon-emerald">Civilian (Warga Sipil)</p>
                <p className="text-theme-text-muted text-xs mt-0.5">
                  Mayoritas pemain. Semua warga sipil mendapat <b>kata yang sama persis</b>. Misi kalian adalah saling mengenali sesama warga dan mengeliminasi seluruh penyusup!
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-theme-bg-card-subtle border border-theme-border flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-chameleon-amber/20 text-chameleon-amber flex items-center justify-center font-bold text-lg shrink-0">
                🕵️
              </div>
              <div>
                <p className="font-bold text-chameleon-amber">Undercover (Penyusup)</p>
                <p className="text-theme-text-muted text-xs mt-0.5">
                  Mendapat kata yang <b>sangat mirip</b> dengan kata Civilian (misal: Teh vs Kopi). Undercover harus membaur, mendengarkan baik-baik, dan tidak ketahuan!
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-theme-bg-card-subtle border border-theme-border flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-chameleon-sky/20 text-chameleon-sky flex items-center justify-center font-bold text-lg shrink-0">
                🎭
              </div>
              <div>
                <p className="font-bold text-chameleon-sky">Mr. White (Tanpa Kata)</p>
                <p className="text-theme-text-muted text-xs mt-0.5">
                  Tidak memiliki kata sama sekali! Mr. White harus mengarang petunjuk berdasarkan kata pemain lain. Jika tereliminasi, Mr. White mendapat <b>1x kesempatan menebak kata Civilian</b> untuk langsung menang seketika!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Roles */}
        <div>
          <h4 className="font-bold text-base text-theme-text-main mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-chameleon-purple" /> Peran Spesial (Opsional)
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-start gap-2.5">
              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-theme-text-main text-xs">Goddess of Justice</p>
                <p className="text-theme-text-muted text-xs">Memutuskan siapa yang tereliminasi jika hasil voting seri (tetap aktif meski sudah mati).</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-start gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-theme-text-main text-xs">The Lovers (Min. 5 pemain)</p>
                <p className="text-theme-text-muted text-xs">2 pemain terikat cinta rahasia. Jika salah satu tersingkir, pasangannya otomatis ikut gugur karena patah hati!</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-start gap-2.5">
              <Smile className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-theme-text-main text-xs">Mr. Meme</p>
                <p className="text-theme-text-muted text-xs">Di setiap ronde, 1 pemain acak dikutuk dan wajib memberikan deskripsi hanya dengan gerakan tubuh tanpa bersuara.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-start gap-2.5">
              <Swords className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-theme-text-main text-xs">The Revenger (Min. 5 pemain)</p>
                <p className="text-theme-text-muted text-xs">Jika tersingkir oleh voting, berhak memilih 1 pemain hidup lainnya untuk diseret ikut tereliminasi.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-theme-bg-card-subtle border border-theme-border flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-theme-text-main text-xs">The Joy Fool</p>
                <p className="text-theme-text-muted text-xs">Jika berhasil menjadi pemain pertama yang tereliminasi di ronde 1, langsung mendapatkan bonus +4 poin!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div>
          <h4 className="font-bold text-base text-theme-text-main mb-2">
            🏆 Sistem Penilaian & Skor
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-theme-text-muted">
            <li><b>Mr. White Menang Tebakan:</b> Mr. White mendapat <b>+6 poin</b>.</li>
            <li><b>Semua Penyusup Gugur (Civilian Menang):</b> Setiap Civilian mendapat <b>+2 poin</b>.</li>
            <li><b>Penyusup Menguasai Permainan (Warga sisa &le; 1):</b> Undercover mendapat <b>+10 poin</b> dan Mr. White mendapat <b>+6 poin</b>.</li>
            <li><b>Bonus Joy Fool:</b> <b>+4 poin</b> jika gugur pertama di Ronde 1.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
