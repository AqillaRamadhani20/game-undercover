export type Role = 'CIVILIAN' | 'UNDERCOVER' | 'MR_WHITE';

export type SpecialRoleType = 
  | 'GODDESS_OF_JUSTICE' 
  | 'THE_LOVERS' 
  | 'MR_MEME' 
  | 'THE_REVENGER' 
  | 'THE_JOY_FOOL';

export type GamePhase = 
  | 'LOBBY' 
  | 'WORD_REVEAL' 
  | 'DESCRIPTION' 
  | 'DISCUSSION' 
  | 'VOTING' 
  | 'TIE_BREAKER' 
  | 'MR_WHITE_GUESS' 
  | 'REVENGER_REVENGE' 
  | 'ROUND_RESULT' 
  | 'GAME_OVER';

export type WinFaction = 'CIVILIANS_WIN' | 'INFILTRATORS_WIN' | 'MR_WHITE_WIN';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  avatarImage?: string;
  role: Role;
  specialRole: SpecialRoleType | null;
  loverPartnerId?: string | null;
  word: string;
  isAlive: boolean;
  score: number;
  eliminatedRound?: number | null;
  isMemeCurse?: boolean;
}

export interface WordPair {
  id: string;
  category: string;
  wordA: string;
  wordB: string;
  hint?: string;
  isCustom?: boolean;
}

export interface GameConfig {
  playerCount: number;
  undercoverCount: number;
  mrWhiteCount: number;
  enabledSpecialRoles: SpecialRoleType[];
  selectedCategories: string[];
  discussionTimerSeconds: number; // 0 for disabled
}

export interface ActiveWordPair {
  id: string;
  civilianWord: string;
  undercoverWord: string;
  category: string;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  round: number;
  config: GameConfig;
  activeWordPair: ActiveWordPair | null;
  usedWordPairIds: string[];
  // Reveal phase state
  revealIndex: number;
  isCardRevealed: boolean;
  // Description phase state
  speechOrderIds: string[];
  currentSpeakerIndex: number;
  // Discussion / Timer state
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  // Voting state
  votes: Record<string, string>; // voterId -> candidatePlayerId
  quickCandidateId: string | null;
  eliminatedPlayer: Player | null;
  chainEliminations: Player[];
  tiedPlayerIds: string[];
  tieBreakerMode: 'REVOTE' | 'SUIT' | 'GODDESS' | null;
  // Mr White guess
  mrWhiteGuess: string;
  // Game over state
  winner: WinFaction | null;
  winReason: string;
  roundScoreDeltas: Record<string, number>;
  // Tracking
  firstEliminatedInGameId: string | null;
  memeCursePlayerId: string | null;
  historyLog: string[];
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  avatarImage?: string;
  totalGames: number;
  totalWins: number;
  totalScore: number;
}
