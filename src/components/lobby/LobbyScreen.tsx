import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Plus, 
  Minus, 
  ArrowLeft,
  AlertCircle,
  Music
} from 'lucide-react';
import type { GameConfig, PlayerProfile } from '../../types/game';
import { getAllWordPairs } from '../../data/wordPairs';
import { calculateDefaultRoleCounts, validateRoleCounts } from '../../engine/roleDistributor';
import { SliderBoyThumb } from '../common/UndercoverIcons';
import { DEFAULT_AVATARS } from '../../utils/storage';
import { soundEffects, triggerHaptic } from '../../utils/audio';
import { GroupPlayersModal } from './GroupPlayersModal';
import { CategoriesModal } from './CategoriesModal';

interface LobbyScreenProps {
  profiles: PlayerProfile[];
  onUpdateProfiles: (profiles: PlayerProfile[]) => void;
  config: GameConfig;
  onUpdateConfig: (config: GameConfig) => void;
  onStartGame: () => void;
  onOpenPersonalWords: () => void;
  onOpenRulebook: () => void;
  onOpenScoreboard: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  profiles,
  onUpdateProfiles,
  config,
  onUpdateConfig,
  onStartGame,
  onOpenPersonalWords,
  onOpenRulebook,
  onOpenScoreboard,
}) => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(soundEffects.getBgm());

  const playerCount = profiles.length;
  const civilianCount = playerCount - config.undercoverCount - config.mrWhiteCount;
  const validation = validateRoleCounts(playerCount, config.undercoverCount, config.mrWhiteCount);
  const allPairs = getAllWordPairs();

  const handleToggleBgm = () => {
    soundEffects.playPop();
    const active = soundEffects.toggleBgm();
    setIsBgmActive(active);
  };

  // Handle slider change (3 to 20 players)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetCount = parseInt(e.target.value, 10);
    if (isNaN(targetCount) || targetCount === playerCount) return;

    soundEffects.playPop();
    triggerHaptic('light');

    let updatedProfiles = [...profiles];
    if (targetCount > profiles.length) {
      for (let i = profiles.length + 1; i <= targetCount; i++) {
        updatedProfiles.push({
          id: `p-${Date.now()}-${i}`,
          name: '',
          avatar: DEFAULT_AVATARS[(i - 1) % DEFAULT_AVATARS.length] || '🦎',
          totalGames: 0,
          totalWins: 0,
          totalScore: 0,
        });
      }
    } else if (targetCount < profiles.length) {
      updatedProfiles = updatedProfiles.slice(0, targetCount);
    }

    onUpdateProfiles(updatedProfiles);

    const auto = calculateDefaultRoleCounts(targetCount);
    onUpdateConfig({
      ...config,
      playerCount: targetCount,
      undercoverCount: auto.undercoverCount,
      mrWhiteCount: auto.mrWhiteCount,
    });
  };


  const handleToggleCategory = (cat: string) => {
    soundEffects.playPop();
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

  const sliderMin = 3;
  const sliderMax = 20;
  const sliderPercent = Math.min(100, Math.max(0, ((playerCount - sliderMin) / (sliderMax - sliderMin)) * 100));

  return (
    <div className="min-h-screen undercover-solid-bg flex flex-col justify-between max-w-md mx-auto px-5 py-6 select-none relative z-10">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPop();
            const auto = calculateDefaultRoleCounts(5);
            onUpdateConfig({
              ...config,
              undercoverCount: auto.undercoverCount,
              mrWhiteCount: auto.mrWhiteCount,
            });
          }}
          aria-label="Kembali"
          className="w-11 h-11 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-md border border-sky-400/40 btn-tactile"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Center / Right Controls: BGM & Group */}
        <div className="flex items-center gap-3">
          {/* Lo-fi BGM Ambience Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleToggleBgm}
              aria-label="Musik Latar Belakang"
              title="Putar / Hentikan Musik Latar"
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border btn-tactile ${
                isBgmActive
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Music className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-slate-400 mt-1">
              {isBgmActive ? 'BGM On' : 'BGM'}
            </span>
          </div>

          {/* Group Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setIsGroupModalOpen(true);
              }}
              aria-label="Grup Pemain"
              className="w-11 h-11 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-md border border-sky-400/40 btn-tactile"
            >
              <Users className="w-5 h-5 fill-current" />
            </button>
            <span className="text-[11px] font-bold text-sky-400 mt-1">Grup</span>
          </div>
        </div>
      </div>

      {/* ================= CENTER SLIDER & TITLE ================= */}
      <div className="my-auto py-2 space-y-6">
        {/* Player Count Title */}
        <div className="text-center">
          <h2 className="text-3xl font-black text-white tracking-wide">
            Pemain: {playerCount}
          </h2>
        </div>

        {/* Player Slider with Avatar Thumb */}
        <div className="px-2">
          <div className="relative flex items-center h-12">
            {/* Custom Track Background */}
            <div className="w-full h-2 rounded-full bg-slate-700 relative overflow-hidden">
              {/* Active Progress (Solid Amber) */}
              <div 
                className="h-full bg-amber-400 transition-all duration-75"
                style={{ width: `${sliderPercent}%` }}
              />
            </div>

            {/* Slider Avatar Thumb */}
            <div 
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1 transition-all duration-75"
              style={{ left: `${sliderPercent}%` }}
            >
              <SliderBoyThumb className="w-11 h-11 filter drop-shadow-md" />
            </div>

            <input
              type="range"
              min={sliderMin}
              max={sliderMax}
              value={playerCount}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
            />
          </div>
        </div>

        {/* ================= CARD 1: ROLE COMPOSITION (Translucent Frosted Card) ================= */}
        <div className="papan-glass-light text-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
          {/* Civilian Pill */}
          <div className="flex justify-center">
            <span className="px-6 py-2 rounded-full bg-sky-600 text-white font-extrabold text-sm shadow-xs tracking-wide">
              {civilianCount} Civilian
            </span>
          </div>

          {/* Undercover Stepper Pill */}
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (config.undercoverCount > 1) {
                  soundEffects.playPop();
                  onUpdateConfig({ ...config, undercoverCount: config.undercoverCount - 1 });
                }
              }}
              disabled={config.undercoverCount <= 1}
              className="w-7 h-7 rounded-full bg-black text-white font-black text-sm flex items-center justify-center disabled:opacity-30 btn-tactile"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="px-7 py-2 rounded-full bg-black text-white font-extrabold text-sm shadow-xs">
              {config.undercoverCount} Undercover
            </span>

            <button
              type="button"
              onClick={() => {
                if (civilianCount > 2) {
                  soundEffects.playPop();
                  onUpdateConfig({ ...config, undercoverCount: config.undercoverCount + 1 });
                }
              }}
              disabled={civilianCount <= 2}
              className="w-7 h-7 rounded-full bg-black text-white font-black text-sm flex items-center justify-center disabled:opacity-30 btn-tactile"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mr. White Stepper Pill */}
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (config.mrWhiteCount > 0) {
                  soundEffects.playPop();
                  onUpdateConfig({ ...config, mrWhiteCount: config.mrWhiteCount - 1 });
                }
              }}
              disabled={config.mrWhiteCount <= 0}
              className="w-7 h-7 rounded-full bg-white text-black font-black text-sm flex items-center justify-center shadow-xs border border-slate-300 disabled:opacity-30 btn-tactile"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="px-7 py-2 rounded-full bg-white text-black font-extrabold text-sm shadow-xs border border-slate-300">
              {config.mrWhiteCount} Mr. White
            </span>

            <button
              type="button"
              onClick={() => {
                if (civilianCount > 2) {
                  soundEffects.playPop();
                  onUpdateConfig({ ...config, mrWhiteCount: config.mrWhiteCount + 1 });
                }
              }}
              disabled={civilianCount <= 2}
              className="w-7 h-7 rounded-full bg-white text-black font-black text-sm flex items-center justify-center shadow-xs border border-slate-300 disabled:opacity-30 btn-tactile"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {!validation.valid && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 pt-1 text-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validation.reason}</span>
            </div>
          )}
        </div>

        {/* ================= CARD 2: KATA-KATA (Translucent Frosted Capsule) ================= */}
        <div 
          onClick={() => {
            soundEffects.playPop();
            setIsCategoriesModalOpen(true);
          }}
          className="papan-glass-light rounded-2xl py-3 px-6 text-center shadow-lg cursor-pointer hover:brightness-105 max-w-[200px] mx-auto btn-tactile"
        >
          <p className="text-[11px] font-semibold text-slate-500">
            Kata-kata
          </p>
          <p className="text-sm font-black text-rose-600">
            {config.selectedCategories.length === 6 ? 'Standar' : `${config.selectedCategories.length} Kategori`}
          </p>
        </div>
      </div>

      {/* ================= BOTTOM ACTION BAR (Solid Emerald) ================= */}
      <div className="relative pt-4 pb-2">
        {/* Mulai Button: Clean Solid Emerald */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (validation.valid) {
                soundEffects.playPop();
                triggerHaptic('medium');
                onStartGame();
              }
            }}
            disabled={!validation.valid}
            className="w-full max-w-xs py-4 px-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center tracking-wide btn-tactile"
          >
            Mulai
          </button>
        </div>

        {/* Floating Settings & Help Buttons on Bottom Right */}
        <div className="absolute right-0 bottom-2 flex flex-col gap-2.5">
          {/* Settings Pink Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenScoreboard();
            }}
            aria-label="Pengaturan & Papan Skor"
            className="w-11 h-11 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg border border-pink-400/50 btn-tactile"
          >
            <Settings className="w-5 h-5 fill-current stroke-none" />
          </button>

          {/* Help Blue Question Mark Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              onOpenRulebook();
            }}
            aria-label="Bantuan & Aturan"
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg border border-blue-400/50 font-black text-lg btn-tactile"
          >
            ?
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      <GroupPlayersModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        profiles={profiles}
        onUpdateProfiles={onUpdateProfiles}
      />

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        selectedCategories={config.selectedCategories}
        totalWordPairsCount={allPairs.length}
        onToggleCategory={handleToggleCategory}
        onOpenPersonalWords={onOpenPersonalWords}
      />
    </div>
  );
};
