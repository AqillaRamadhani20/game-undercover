import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import type { PlayerProfile } from '../../types/game';
import { UserPlus, Trash2, Users, Camera, RotateCcw } from 'lucide-react';
import { DEFAULT_AVATARS, resetAllProfilesToDefault } from '../../utils/storage';
import { soundEffects, triggerHaptic } from '../../utils/audio';
import { processImageFile } from '../../utils/imageUpload';

interface GroupPlayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PlayerProfile[];
  onUpdateProfiles: (profiles: PlayerProfile[]) => void;
}

export const GroupPlayersModal: React.FC<GroupPlayersModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onUpdateProfiles,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [activeUploadIdx, setActiveUploadIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (profiles.length >= 20) return;
    const name = newPlayerName.trim();

    // Prevent duplicate player names
    if (name) {
      const isDuplicate = profiles.some(
        p => p.name.trim().toLowerCase() === name.toLowerCase()
      );
      if (isDuplicate) {
        alert(`Nama "${name}" sudah digunakan! Setiap pemain harus memiliki nama yang berbeda.`);
        return;
      }
    }

    const nextAvatar = DEFAULT_AVATARS[profiles.length % DEFAULT_AVATARS.length] || '🦎';

    const newProfile: PlayerProfile = {
      id: `p-${Date.now()}-${profiles.length + 1}`,
      name,
      avatar: nextAvatar,
      totalGames: 0,
      totalWins: 0,
      totalScore: 0,
    };

    soundEffects.playPop();
    triggerHaptic('light');
    onUpdateProfiles([...profiles, newProfile]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    if (profiles.length <= 3) {
      alert('Minimal harus ada 3 pemain untuk bermain Undercover.');
      return;
    }
    const target = profiles.find(p => p.id === id);
    const targetName = target?.name?.trim() ? `"${target.name.trim()}"` : 'pemain ini';
    if (window.confirm(`Hapus ${targetName} dari daftar pemain?`)) {
      soundEffects.playPop();
      triggerHaptic('light');
      onUpdateProfiles(profiles.filter(p => p.id !== id));
    }
  };

  const handleResetAllPlayers = () => {
    const confirmReset = window.confirm(
      'Yakin ingin mereset semua pemain? Semua nama dan foto yang sudah ditambahkan sebelumnya akan dihapus dan kembali ke setelan awal (5 pemain default).'
    );
    if (!confirmReset) return;
    soundEffects.playPop();
    triggerHaptic('medium');
    const fresh = resetAllProfilesToDefault();
    onUpdateProfiles(fresh);
  };

  const handleCycleAvatar = (index: number) => {
    soundEffects.playPop();
    const currentAvatar = profiles[index].avatar;
    const currentAvatarIdx = DEFAULT_AVATARS.indexOf(currentAvatar);
    const nextAvatar = DEFAULT_AVATARS[(currentAvatarIdx + 1) % DEFAULT_AVATARS.length];

    const updated = [...profiles];
    updated[index] = { ...updated[index], avatar: nextAvatar, avatarImage: undefined };
    onUpdateProfiles(updated);
  };

  const triggerUploadForPlayer = (index: number) => {
    setActiveUploadIdx(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeUploadIdx === null) return;

    try {
      const dataUrl = await processImageFile(file);
      soundEffects.playSelect();
      triggerHaptic('medium');

      const updated = [...profiles];
      updated[activeUploadIdx] = {
        ...updated[activeUploadIdx],
        avatarImage: dataUrl,
      };
      onUpdateProfiles(updated);
    } catch (err: unknown) {
      alert((err as Error).message || 'Gagal mengunggah foto.');
    } finally {
      setActiveUploadIdx(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick feature: Clear all names & photos to start fresh and empty
  const handleClearAllNames = () => {
    soundEffects.playPop();
    triggerHaptic('light');
    const updated = profiles.map(p => ({
      ...p,
      name: '',
      avatarImage: undefined,
    }));
    onUpdateProfiles(updated);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kelola Pemain & Nama" maxWidth="max-w-md">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-4">
        {/* Header & Quick Action Buttons */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-bold font-heading">
            <Users className="w-4 h-4 text-sky-400" /> {profiles.length} Pemain (Min. 3, Maks. 20)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAllNames}
              title="Kosongkan semua nama pemain"
              className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1 btn-tactile"
            >
              <RotateCcw className="w-3 h-3" /> Kosongkan Semua Nama
            </button>
          </div>
        </div>

        {/* Player List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {profiles.map((p, idx) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 border border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {/* Avatar / Photo Thumbnail */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCycleAvatar(idx)}
                    className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-lg shrink-0 overflow-hidden btn-tactile"
                    title="Tap untuk ganti emoji"
                  >
                    {p.avatarImage ? (
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      p.avatar
                    )}
                  </button>

                  {/* Camera Upload Badge */}
                  <button
                    type="button"
                    onClick={() => triggerUploadForPlayer(idx)}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-600 hover:bg-sky-500 border border-slate-800 text-white flex items-center justify-center shadow-xs btn-tactile"
                    title="Unggah Foto Profil"
                  >
                    <Camera className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Name Input (starts empty, placeholder: Pemain X) */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const updated = [...profiles];
                      // Clear custom photo if name is changed
                      updated[idx] = { 
                        ...updated[idx], 
                        name: e.target.value, 
                        avatarImage: undefined 
                      };
                      onUpdateProfiles(updated);
                    }}
                    maxLength={16}
                    placeholder={`Pemain ${idx + 1}`}
                    className={`w-full text-sm font-bold bg-transparent text-white placeholder-slate-500 focus:outline-none focus:border-b font-heading ${
                      p.name.trim() && profiles.some((other, oIdx) => oIdx !== idx && other.name.trim().toLowerCase() === p.name.trim().toLowerCase())
                        ? 'border-b-2 border-rose-500 text-rose-300'
                        : 'focus:border-sky-400'
                    }`}
                  />
                  {p.name.trim() && profiles.some((other, oIdx) => oIdx !== idx && other.name.trim().toLowerCase() === p.name.trim().toLowerCase()) && (
                    <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                      ⚠️ Nama kembar!
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemovePlayer(p.id)}
                disabled={profiles.length <= 3}
                title={profiles.length <= 3 ? "Minimal 3 pemain untuk bermain" : `Hapus ${p.name || `Pemain ${idx + 1}`}`}
                aria-label={`Hapus ${p.name || `Pemain ${idx + 1}`}`}
                className={`px-2.5 py-1.5 text-xs rounded-xl flex items-center gap-1 font-bold btn-tactile ml-2 border transition-all ${
                  profiles.length <= 3
                    ? 'opacity-30 cursor-not-allowed border-slate-700 text-slate-500 bg-slate-900/40'
                    : 'border-rose-500/40 text-rose-400 hover:text-white hover:bg-rose-600 bg-rose-500/10 shadow-xs'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          ))}
        </div>

        {/* Add Player Input */}
        {profiles.length < 20 && (
          <form onSubmit={handleAddPlayer} className="flex gap-2">
            <input
              type="text"
              placeholder={`Tambah nama (opsional)...`}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              maxLength={16}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-heading"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md flex items-center gap-1.5 shrink-0 btn-tactile font-heading"
            >
              <UserPlus className="w-4 h-4" /> Tambah
            </button>
          </form>
        )}

        {/* Reset Semua Pemain Button */}
        <div className="pt-2 border-t border-slate-700/60">
          <button
            type="button"
            onClick={handleResetAllPlayers}
            title="Hapus semua nama dan foto pemain, kembali ke 5 pemain awal"
            className="w-full py-2.5 px-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 btn-tactile font-heading shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Semua Pemain (Hapus Semua Nama)
          </button>
        </div>
      </div>
    </Modal>
  );
};
