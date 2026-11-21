import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Shield, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Play, 
  Wand2, 
  Plus, 
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import type { GameConfig, PlayerProfile, SpecialRoleType } from '../../types/game';
import { CATEGORIES, getAllWordPairs } from '../../data/wordPairs';
import { calculateDefaultRoleCounts, validateRoleCounts } from '../../engine/roleDistributor';
import { DEFAULT_AVATARS } from '../../utils/storage';
import { soundEffects, triggerHaptic } from '../../utils/audio';

interface LobbyScreenProps {
  profiles: PlayerProfile[];
  onUpdateProfiles: (profiles: PlayerProfile[]) => void;
  config: GameConfig;
  onUpdateConfig: (config: GameConfig) => void;
  onStartGame: () => void;
  onOpenPersonalWords: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  profiles,
  onUpdateProfiles,
  config,
  onUpdateConfig,
  onStartGame,
  onOpenPersonalWords,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const playerCount = profiles.length;
  const civilianCount = playerCount - config.undercoverCount - config.mrWhiteCount;
  const validation = validateRoleCounts(playerCount, config.undercoverCount, config.mrWhiteCount);

  // Auto calculate defaults
  const handleAutoRoles = () => {
    soundEffects.playClick();
    triggerHaptic('light');
    const auto = calculateDefaultRoleCounts(playerCount);
    onUpdateConfig({
      ...config,
      undercoverCount: auto.undercoverCount,
      mrWhiteCount: auto.mrWhiteCount,
    });
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerCount >= 20) return;
    const name = newPlayerName.trim() || `Pemain ${playerCount + 1}`;
    const nextAvatar = DEFAULT_AVATARS[playerCount % DEFAULT_AVATARS.length];
    
    const newProfile: PlayerProfile = {
      id: `p-${Date.now()}`,
      name,
      avatar: nextAvatar,
      totalGames: 0,
      totalWins: 0,
      totalScore: 0,
    };

    soundEffects.playClick();
    triggerHaptic('light');
    const newProfiles = [...profiles, newProfile];
    onUpdateProfiles(newProfiles);
    setNewPlayerName('');

    const auto = calculateDefaultRoleCounts(newProfiles.length);
    onUpdateConfig({
      ...config,
      playerCount: newProfiles.length,
      undercoverCount: auto.undercoverCount,
      mrWhiteCount: auto.mrWhiteCount,
    });
  };

  const handleRemovePlayer = (id: string) => {
    if (playerCount <= 3) return;
    soundEffects.playClick();
    triggerHaptic('light');
    const newProfiles = profiles.filter(p => p.id !== id);
    onUpdateProfiles(newProfiles);

    const auto = calculateDefaultRoleCounts(newProfiles.length);
    onUpdateConfig({
      ...config,
      playerCount: newProfiles.length,
      undercoverCount: Math.min(config.undercoverCount, auto.undercoverCount),
      mrWhiteCount: Math.min(config.mrWhiteCount, auto.mrWhiteCount),
    });
  };

  const handleCycleAvatar = (index: number) => {
    soundEffects.playClick();
    const currentAvatar = profiles[index].avatar;
    const currentAvatarIdx = DEFAULT_AVATARS.indexOf(currentAvatar);
    const nextAvatar = DEFAULT_AVATARS[(currentAvatarIdx + 1) % DEFAULT_AVATARS.length];
    
    const updated = [...profiles];
    updated[index] = { ...updated[index], avatar: nextAvatar };
    onUpdateProfiles(updated);
  };

  const handleToggleSpecialRole = (role: SpecialRoleType) => {
    soundEffects.playClick();
    triggerHaptic('light');
    const exists = config.enabledSpecialRoles.includes(role);
    const updated = exists
      ? config.enabledSpecialRoles.filter(r => r !== role)
      : [...config.enabledSpecialRoles, role];
    onUpdateConfig({ ...config, enabledSpecialRoles: updated });
  };

  const handleToggleCategory = (cat: string) => {
    soundEffects.playClick();
    const exists = config.selectedCategories.includes(cat);
    let updated: string[];
    if (exists) {
      if (config.selectedCategories.length <= 1) return;
      updated = config.selectedCategories.filter(c => c !== cat);
    } else {
      updated = [...config.selectedCategories, cat];
    }
    onUpdateConfig({ ...config, selectedCategories: updated });
  };

  const allPairs = getAllWordPairs();

  return (
    <div className="max-w-xl mx-auto px-4 py-5 space-y-6 pb-28">
      {/* Hero Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-chameleon-emerald/15 to-chameleon-sky/15 border border-chameleon-emerald/30 shadow-sm text-center">
        <h2 className="text-xl font-extrabold text-theme-text-main flex items-center justify-center gap-2">
          <span>Pass & Play</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-chameleon-emerald text-white font-semibold">
            1 HP Bersama
          </span>
        </h2>
        <p className="text-xs text-theme-text-muted mt-1">
          Oper satu HP bergantian. Temukan siapa Undercover & Mr. White di antara kalian!
        </p>
      </div>

      {/* Player Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5">
            <Users className="w-4 h-4 text-chameleon-emerald" /> Daftar Pemain ({playerCount}/20)
          </h3>
          <span className="text-xs text-theme-text-muted font-medium">
            Min. 3 Pemain
          </span>
        </div>

        {/* Players List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {profiles.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg-card border border-theme-border shadow-xs hover:border-chameleon-emerald/50 transition-all"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleCycleAvatar(idx)}
                  className="w-10 h-10 rounded-xl bg-theme-bg-card-subtle flex items-center justify-center text-xl shrink-0 hover:scale-105 active:scale-95 transition"
                  title="Klik untuk ganti emoji"
                >
                  {player.avatar}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => {
                      const updated = [...profiles];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      onUpdateProfiles(updated);
                    }}
                    maxLength={16}
                    className="w-full text-sm font-semibold bg-transparent text-theme-text-main focus:outline-none focus:border-b focus:border-chameleon-emerald"
                  />
                  <p className="text-[11px] text-theme-text-muted">
                    Skor: {player.totalScore} pts
                  </p>
                </div>
              </div>

              {playerCount > 3 && (
                <button
                  onClick={() => handleRemovePlayer(player.id)}
                  aria-label="Hapus Pemain"
                  className="p-2 text-theme-text-muted hover:text-chameleon-rose hover:bg-chameleon-rose/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Player Input */}
        {playerCount < 20 && (
          <form onSubmit={handleAddPlayer} className="flex gap-2">
            <input
              type="text"
              placeholder={`Nama pemain ${playerCount + 1}...`}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              maxLength={16}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-theme-bg-card border border-theme-border text-sm text-theme-text-main focus:outline-none focus:border-chameleon-emerald"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-chameleon-emerald/15 border border-chameleon-emerald/30 text-chameleon-emerald font-semibold text-sm hover:bg-chameleon-emerald hover:text-white transition flex items-center gap-1.5 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Tambah
            </button>
          </form>
        )}
      </div>

      {/* Role Composition */}
      <div className="space-y-3 p-4 rounded-2xl bg-theme-bg-card border border-theme-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-theme-text-main flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-chameleon-sky" /> Komposisi Peran
          </h3>
          <button
            type="button"
            onClick={handleAutoRoles}
            className="text-xs text-chameleon-sky hover:underline font-semibold flex items-center gap-1"
          >
            <Wand2 className="w-3.5 h-3.5" /> Rasio Otomatis
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Civilians */}
          <div className="p-3 rounded-xl bg-chameleon-emerald/10 border border-chameleon-emerald/20">
            <span className="text-xl">🛡️</span>
            <p className="text-xs font-bold text-chameleon-emerald mt-1">Civilian</p>
            <p className="text-2xl font-black text-theme-text-main mt-0.5">{civilianCount}</p>
            <p className="text-[10px] text-theme-text-muted">Mayoritas</p>
          </div>

          {/* Undercover */}
          <div className="p-3 rounded-xl bg-chameleon-amber/10 border border-chameleon-amber/20">
            <span className="text-xl">🕵️</span>
            <p className="text-xs font-bold text-chameleon-amber mt-1">Undercover</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (config.undercoverCount > 1) {
                    soundEffects.playClick();
                    onUpdateConfig({ ...config, undercoverCount: config.undercoverCount - 1 });
                  }
                }}
                disabled={config.undercoverCount <= 1}
                className="w-6 h-6 rounded-md bg-theme-bg-card-subtle flex items-center justify-center text-xs disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-2xl font-black text-theme-text-main px-1">
                {config.undercoverCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (civilianCount > 2) {
                    soundEffects.playClick();
                    onUpdateConfig({ ...config, undercoverCount: config.undercoverCount + 1 });
                  }
                }}
                disabled={civilianCount <= 2}
                className="w-6 h-6 rounded-md bg-theme-bg-card-subtle flex items-center justify-center text-xs disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-theme-text-muted">Kata Mirip</p>
          </div>

          {/* Mr. White */}
          <div className="p-3 rounded-xl bg-chameleon-sky/10 border border-chameleon-sky/20">
            <span className="text-xl">🎭</span>
            <p className="text-xs font-bold text-chameleon-sky mt-1">Mr. White</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <button
                type="button"
                onClick={() => {
                  if (config.mrWhiteCount > 0) {
                    soundEffects.playClick();
                    onUpdateConfig({ ...config, mrWhiteCount: config.mrWhiteCount - 1 });
                  }
                }}
                disabled={config.mrWhiteCount <= 0}
                className="w-6 h-6 rounded-md bg-theme-bg-card-subtle flex items-center justify-center text-xs disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-2xl font-black text-theme-text-main px-1">
                {config.mrWhiteCount}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (civilianCount > 2) {
                    soundEffects.playClick();
                    onUpdateConfig({ ...config, mrWhiteCount: config.mrWhiteCount + 1 });
                  }
                }}
                disabled={civilianCount <= 2}
                className="w-6 h-6 rounded-md bg-theme-bg-card-subtle flex items-center justify-center text-xs disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-theme-text-muted">Tanpa Kata</p>
          </div>
        </div>

        {!validation.valid && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-chameleon-rose/10 border border-chameleon-rose/30 text-chameleon-rose text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validation.reason}</span>
          </div>
        )}
      </div>

      {/* Special Roles Expansion */}
      <div className="space-y-3 p-4 rounded-2xl bg-theme-bg-card border border-theme-border">
        <h3 className="font-bold text-sm text-theme-text-main flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-chameleon-purple" /> Peran Spesial (Modular Hooks)
        </h3>
        
        <div className="space-y-2">
          {/* Goddess of Justice */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg-card-subtle border border-theme-border cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚖️</span>
              <div>
                <p className="font-bold text-xs text-theme-text-main">Goddess of Justice</p>
                <p className="text-[11px] text-theme-text-muted">Memutus suara seri jika voting imbang</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.enabledSpecialRoles.includes('GODDESS_OF_JUSTICE')}
              onChange={() => handleToggleSpecialRole('GODDESS_OF_JUSTICE')}
              className="w-5 h-5 accent-chameleon-emerald rounded cursor-pointer"
            />
          </label>

          {/* The Lovers */}
          <label className={`flex items-center justify-between p-2.5 rounded-xl border select-none ${
            playerCount < 5 
              ? 'opacity-40 bg-theme-bg-card-subtle/50 border-theme-border cursor-not-allowed'
              : 'bg-theme-bg-card-subtle border-theme-border cursor-pointer'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💖</span>
              <div>
                <p className="font-bold text-xs text-theme-text-main">
                  The Lovers {playerCount < 5 && <span className="text-[10px] text-chameleon-rose font-normal">(Min. 5 pemain)</span>}
                </p>
                <p className="text-[11px] text-theme-text-muted">2 pemain saling terikat; satu gugur, pasangannya ikut gugur</p>
              </div>
            </div>
            <input
              type="checkbox"
              disabled={playerCount < 5}
              checked={config.enabledSpecialRoles.includes('THE_LOVERS')}
              onChange={() => handleToggleSpecialRole('THE_LOVERS')}
              className="w-5 h-5 accent-chameleon-emerald rounded cursor-pointer"
            />
          </label>

          {/* Mr. Meme */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg-card-subtle border border-theme-border cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🤫</span>
              <div>
                <p className="font-bold text-xs text-theme-text-main">Mr. Meme</p>
                <p className="text-[11px] text-theme-text-muted">Tiap ronde 1 pemain acak wajib deskripsi dengan pantomim/bisu</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.enabledSpecialRoles.includes('MR_MEME')}
              onChange={() => handleToggleSpecialRole('MR_MEME')}
              className="w-5 h-5 accent-chameleon-emerald rounded cursor-pointer"
            />
          </label>

          {/* The Revenger */}
          <label className={`flex items-center justify-between p-2.5 rounded-xl border select-none ${
            playerCount < 5 
              ? 'opacity-40 bg-theme-bg-card-subtle/50 border-theme-border cursor-not-allowed'
              : 'bg-theme-bg-card-subtle border-theme-border cursor-pointer'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚔️</span>
              <div>
                <p className="font-bold text-xs text-theme-text-main">
                  The Revenger {playerCount < 5 && <span className="text-[10px] text-chameleon-rose font-normal">(Min. 5 pemain)</span>}
                </p>
                <p className="text-[11px] text-theme-text-muted">Saat dieliminasi, berhak menyeret 1 pemain lain ikut keluar</p>
              </div>
            </div>
            <input
              type="checkbox"
              disabled={playerCount < 5}
              checked={config.enabledSpecialRoles.includes('THE_REVENGER')}
              onChange={() => handleToggleSpecialRole('THE_REVENGER')}
              className="w-5 h-5 accent-chameleon-emerald rounded cursor-pointer"
            />
          </label>

          {/* The Joy Fool */}
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg-card-subtle border border-theme-border cursor-pointer select-none">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🤡</span>
              <div>
                <p className="font-bold text-xs text-theme-text-main">The Joy Fool</p>
                <p className="text-[11px] text-theme-text-muted">Dapat bonus +4 poin jika menjadi pemain pertama yang gugur di ronde 1</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={config.enabledSpecialRoles.includes('THE_JOY_FOOL')}
              onChange={() => handleToggleSpecialRole('THE_JOY_FOOL')}
              className="w-5 h-5 accent-chameleon-emerald rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Word Categories & Personal Words */}
      <div className="space-y-3 p-4 rounded-2xl bg-theme-bg-card border border-theme-border">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-theme-text-main flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-chameleon-emerald" /> Kategori Kata ({allPairs.length} Pasang)
          </h3>
          <button
            type="button"
            onClick={onOpenPersonalWords}
            className="text-xs text-chameleon-emerald hover:underline font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Kata Kustom
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => {
            const isSelected = config.selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleToggleCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-chameleon-emerald text-white shadow-xs'
                    : 'bg-theme-bg-card-subtle text-theme-text-muted hover:text-theme-text-main'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discussion Timer Setting */}
      <div className="p-4 rounded-2xl bg-theme-bg-card border border-theme-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-chameleon-amber" />
          <div>
            <p className="text-xs font-bold text-theme-text-main">Timer Diskusi</p>
            <p className="text-[11px] text-theme-text-muted">Batas waktu berdebat sebelum voting</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[0, 30, 60, 90].map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onUpdateConfig({ ...config, discussionTimerSeconds: sec });
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                config.discussionTimerSeconds === sec
                  ? 'bg-chameleon-amber text-black'
                  : 'bg-theme-bg-card-subtle text-theme-text-muted'
              }`}
            >
              {sec === 0 ? 'Bebas' : `${sec}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border z-30">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => {
              if (validation.valid) {
                soundEffects.playClick();
                triggerHaptic('medium');
                onStartGame();
              }
            }}
            disabled={!validation.valid}
            className="w-full py-4 rounded-2xl bg-chameleon-emerald text-white font-extrabold text-base shadow-lg shadow-chameleon-emerald/25 hover:bg-chameleon-emerald-dark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Mulai Permainan ({playerCount} Pemain)
          </button>
        </div>
      </div>
    </div>
  );
};
