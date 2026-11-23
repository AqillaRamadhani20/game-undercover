import type { PlayerProfile, GameConfig } from '../types/game';

const PLAYERS_KEY = 'undercover_saved_player_profiles';
const CONFIG_KEY = 'undercover_saved_config';
const THEME_KEY = 'undercover_theme_dark';

export const DEFAULT_AVATARS = [
  '🦎', '🦊', '🐱', '🐼', '🐯', 
  '🦁', '🐵', '🐸', '🦉', '🦄', 
  '🐙', '🐨', '🐺', '🐰', '🐻', 
  '🐧', '🦅', '🐬', '🦝', '🐹'
];

export const DEFAULT_PLAYER_PROFILES: PlayerProfile[] = [
  { id: 'p-1', name: '', avatar: '🦎', totalGames: 0, totalWins: 0, totalScore: 0 },
  { id: 'p-2', name: '', avatar: '🦊', totalGames: 0, totalWins: 0, totalScore: 0 },
  { id: 'p-3', name: '', avatar: '🐱', totalGames: 0, totalWins: 0, totalScore: 0 },
  { id: 'p-4', name: '', avatar: '🐼', totalGames: 0, totalWins: 0, totalScore: 0 },
  { id: 'p-5', name: '', avatar: '🐯', totalGames: 0, totalWins: 0, totalScore: 0 },
];

const DUMMY_NAMES = ['Budi', 'Siti', 'Andi', 'Rina', 'Doni'];

export function loadSavedProfiles(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(PLAYERS_KEY);
    if (!raw) return DEFAULT_PLAYER_PROFILES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 3) {
      // Clear out legacy dummy names (Budi, Siti, etc.) so names start fresh and empty
      return parsed.map(p => ({
        ...p,
        name: DUMMY_NAMES.includes(p.name) ? '' : p.name,
      }));
    }
    return DEFAULT_PLAYER_PROFILES;
  } catch {
    return DEFAULT_PLAYER_PROFILES;
  }
}

export function savePlayerProfiles(profiles: PlayerProfile[]): void {
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save players to localStorage', err);
  }
}

export function resetAllProfilesToDefault(): PlayerProfile[] {
  const fresh: PlayerProfile[] = [
    { id: 'p-1', name: '', avatar: '🦎', totalGames: 0, totalWins: 0, totalScore: 0 },
    { id: 'p-2', name: '', avatar: '🦊', totalGames: 0, totalWins: 0, totalScore: 0 },
    { id: 'p-3', name: '', avatar: '🐱', totalGames: 0, totalWins: 0, totalScore: 0 },
    { id: 'p-4', name: '', avatar: '🐼', totalGames: 0, totalWins: 0, totalScore: 0 },
    { id: 'p-5', name: '', avatar: '🐯', totalGames: 0, totalWins: 0, totalScore: 0 },
  ];
  savePlayerProfiles(fresh);
  return fresh;
}

export function updateCumulativeScores(
  profiles: PlayerProfile[],
  roundDeltas: Record<string, number>,
  _winnerFaction?: string | null
): PlayerProfile[] {
  const updated = profiles.map(profile => {
    const scoreAdd = roundDeltas[profile.id] || 0;
    const isWinner = scoreAdd > 0;
    return {
      ...profile,
      totalGames: profile.totalGames + 1,
      totalWins: isWinner ? profile.totalWins + 1 : profile.totalWins,
      totalScore: profile.totalScore + scoreAdd,
    };
  });
  savePlayerProfiles(updated);
  return updated;
}

export function resetCumulativeScores(profiles: PlayerProfile[]): PlayerProfile[] {
  const resetList = profiles.map(p => ({
    ...p,
    totalGames: 0,
    totalWins: 0,
    totalScore: 0,
  }));
  savePlayerProfiles(resetList);
  return resetList;
}

export function loadSavedConfig(): Partial<GameConfig> | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveConfig(config: GameConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save config to localStorage', err);
  }
}

export function loadSavedTheme(): boolean {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw !== null) return JSON.parse(raw);
    return true;
  } catch {
    return true;
  }
}

export function saveTheme(isDark: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  } catch (err) {
    console.error(err);
  }
}
