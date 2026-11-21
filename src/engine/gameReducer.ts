import type { 
  GameState, 
  Player, 
  GameConfig
} from '../types/game';
import { selectRandomWordPair } from '../data/wordPairs';
import { 
  distributeRolesAndWords, 
  shuffleArray
} from './roleDistributor';
import { evaluateWinCondition, checkMrWhiteGuess } from './winEvaluator';
import { specialRoleHooks } from './specialRoleHooks';

export type GameAction =
  | { type: 'START_GAME'; config: GameConfig; rawPlayers: Array<{ id: string; name: string; avatar: string; score?: number }> }
  | { type: 'REVEAL_CURRENT_CARD' }
  | { type: 'HIDE_AND_NEXT_CARD' }
  | { type: 'NEXT_SPEAKER' }
  | { type: 'START_DISCUSSION' }
  | { type: 'TICK_TIMER' }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'ADD_TIMER_SECONDS'; seconds: number }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; voterId: string; candidateId: string }
  | { type: 'SET_QUICK_CANDIDATE'; candidateId: string | null }
  | { type: 'RESOLVE_VOTING' }
  | { type: 'RESOLVE_TIE_BREAKER'; mode: 'REVOTE' | 'SUIT' | 'GODDESS'; chosenPlayerId?: string }
  | { type: 'SUBMIT_MR_WHITE_GUESS'; guess: string }
  | { type: 'EXECUTE_REVENGER_CHOICE'; targetId: string }
  | { type: 'NEXT_ROUND' }
  | { type: 'REPLAY_GAME' }
  | { type: 'RESET_TO_LOBBY' };

export const INITIAL_CONFIG: GameConfig = {
  playerCount: 5,
  undercoverCount: 1,
  mrWhiteCount: 1,
  enabledSpecialRoles: ['GODDESS_OF_JUSTICE', 'THE_LOVERS'],
  selectedCategories: [
    'Makanan & Minuman',
    'Benda Sehari-hari',
    'Hewan & Alam',
    'Teknologi & Pop',
    'Profesi & Transportasi',
  ],
  discussionTimerSeconds: 60,
};

export const INITIAL_STATE: GameState = {
  phase: 'LOBBY',
  players: [],
  round: 1,
  config: INITIAL_CONFIG,
  activeWordPair: null,
  usedWordPairIds: [],
  revealIndex: 0,
  isCardRevealed: false,
  speechOrderIds: [],
  currentSpeakerIndex: 0,
  timerSecondsRemaining: 60,
  isTimerRunning: false,
  votes: {},
  quickCandidateId: null,
  eliminatedPlayer: null,
  chainEliminations: [],
  tiedPlayerIds: [],
  tieBreakerMode: null,
  mrWhiteGuess: '',
  winner: null,
  winReason: '',
  roundScoreDeltas: {},
  firstEliminatedInGameId: null,
  memeCursePlayerId: null,
  historyLog: [],
};

/**
 * Computes randomized speech order for alive players.
 * Guarantees Mr. White is NOT the first speaker in Round 1.
 */
export function generateSpeechOrder(players: Player[], round: number): string[] {
  const alivePlayers = players.filter(p => p.isAlive);
  if (alivePlayers.length === 0) return [];

  let order = shuffleArray(alivePlayers);

  // In Round 1, Mr. White cannot be the first speaker
  if (round === 1 && order.length > 1 && order[0].role === 'MR_WHITE') {
    const nonMrWhiteIndex = order.findIndex(p => p.role !== 'MR_WHITE');
    if (nonMrWhiteIndex > 0) {
      const temp = order[0];
      order[0] = order[nonMrWhiteIndex];
      order[nonMrWhiteIndex] = temp;
    }
  }

  return order.map(p => p.id);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const { config, rawPlayers } = action;
      
      const { pair, civilianWord, undercoverWord } = selectRandomWordPair(
        config.selectedCategories,
        state.usedWordPairIds
      );

      const players = distributeRolesAndWords(
        rawPlayers,
        config.undercoverCount,
        config.mrWhiteCount,
        civilianWord,
        undercoverWord,
        config.enabledSpecialRoles
      );

      const activeWordPair = {
        id: pair.id,
        civilianWord,
        undercoverWord,
        category: pair.category,
      };

      const updatedUsedIds = [...state.usedWordPairIds, pair.id];

      return {
        ...INITIAL_STATE,
        phase: 'WORD_REVEAL',
        players,
        round: 1,
        config,
        activeWordPair,
        usedWordPairIds: updatedUsedIds,
        revealIndex: 0,
        isCardRevealed: false,
        historyLog: [`Game dimulai! Ronde 1 dengan ${players.length} pemain.`],
      };
    }

    case 'REVEAL_CURRENT_CARD': {
      return {
        ...state,
        isCardRevealed: true,
      };
    }

    case 'HIDE_AND_NEXT_CARD': {
      const nextIndex = state.revealIndex + 1;
      
      if (nextIndex >= state.players.length) {
        const speechOrderIds = generateSpeechOrder(state.players, 1);
        const memeResult = specialRoleHooks.onRoundStart({
          players: state.players,
          round: 1,
          enabledRoles: state.config.enabledSpecialRoles,
        });

        const logs = [...state.historyLog, 'Semua pemain telah melihat kata rahasia. Memulai fase deskripsi kata.'];
        if (memeResult.logMessage) {
          logs.push(memeResult.logMessage);
        }

        return {
          ...state,
          phase: 'DESCRIPTION',
          revealIndex: 0,
          isCardRevealed: false,
          speechOrderIds,
          currentSpeakerIndex: 0,
          memeCursePlayerId: memeResult.memeCursePlayerId,
          historyLog: logs,
        };
      }

      return {
        ...state,
        revealIndex: nextIndex,
        isCardRevealed: false,
      };
    }

    case 'NEXT_SPEAKER': {
      const nextSpeaker = state.currentSpeakerIndex + 1;
      if (nextSpeaker >= state.speechOrderIds.length) {
        return {
          ...state,
          phase: 'DISCUSSION',
          currentSpeakerIndex: 0,
          timerSecondsRemaining: state.config.discussionTimerSeconds,
          isTimerRunning: state.config.discussionTimerSeconds > 0,
          historyLog: [...state.historyLog, 'Fase deskripsi selesai. Masuk ke fase diskusi.'],
        };
      }
      return {
        ...state,
        currentSpeakerIndex: nextSpeaker,
      };
    }

    case 'START_DISCUSSION': {
      return {
        ...state,
        phase: 'DISCUSSION',
        timerSecondsRemaining: state.config.discussionTimerSeconds,
        isTimerRunning: state.config.discussionTimerSeconds > 0,
        historyLog: [...state.historyLog, 'Masuk ke fase diskusi.'],
      };
    }

    case 'TICK_TIMER': {
      if (!state.isTimerRunning || state.timerSecondsRemaining <= 0) {
        return state;
      }
      const newSec = state.timerSecondsRemaining - 1;
      return {
        ...state,
        timerSecondsRemaining: newSec,
        isTimerRunning: newSec > 0,
      };
    }

    case 'TOGGLE_TIMER': {
      return {
        ...state,
        isTimerRunning: !state.isTimerRunning,
      };
    }

    case 'ADD_TIMER_SECONDS': {
      return {
        ...state,
        timerSecondsRemaining: state.timerSecondsRemaining + action.seconds,
        isTimerRunning: true,
      };
    }

    case 'START_VOTING': {
      return {
        ...state,
        phase: 'VOTING',
        isTimerRunning: false,
        votes: {},
        quickCandidateId: null,
        tiedPlayerIds: [],
        tieBreakerMode: null,
        historyLog: [...state.historyLog, 'Fase voting eliminasi dimulai.'],
      };
    }

    case 'CAST_VOTE': {
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.voterId]: action.candidateId,
        },
      };
    }

    case 'SET_QUICK_CANDIDATE': {
      return {
        ...state,
        quickCandidateId: action.candidateId,
      };
    }

    case 'RESOLVE_VOTING': {
      let candidateId: string | null = state.quickCandidateId;

      if (!candidateId && Object.keys(state.votes).length > 0) {
        const tallies: Record<string, number> = {};
        Object.values(state.votes).forEach(cid => {
          tallies[cid] = (tallies[cid] || 0) + 1;
        });

        let highestVotes = 0;
        let topCandidates: string[] = [];

        Object.entries(tallies).forEach(([cid, count]) => {
          if (count > highestVotes) {
            highestVotes = count;
            topCandidates = [cid];
          } else if (count === highestVotes) {
            topCandidates.push(cid);
          }
        });

        if (topCandidates.length > 1) {
          return {
            ...state,
            phase: 'TIE_BREAKER',
            tiedPlayerIds: topCandidates,
            historyLog: [
              ...state.historyLog,
              `Voting seri antara ${topCandidates.map(id => state.players.find(p => p.id === id)?.name).join(', ')}.`,
            ],
          };
        }

        candidateId = topCandidates[0] || null;
      }

      if (!candidateId) {
        return state;
      }

      const targetPlayer = state.players.find(p => p.id === candidateId);
      if (!targetPlayer) return state;

      const isFirstEliminated = state.firstEliminatedInGameId === null;
      const hooksResult = specialRoleHooks.onEliminated({
        eliminated: targetPlayer,
        players: state.players,
        round: state.round,
        isFirstEliminatedInGame: isFirstEliminated,
      });

      if (hooksResult.needsMrWhiteGuess) {
        return {
          ...state,
          phase: 'MR_WHITE_GUESS',
          eliminatedPlayer: targetPlayer,
          historyLog: [
            ...state.historyLog,
            `${targetPlayer.name} terpilih untuk dieliminasi dan ternyata adalah MR. WHITE!`,
          ],
        };
      }

      if (hooksResult.needsRevengerPrompt) {
        return {
          ...state,
          phase: 'REVENGER_REVENGE',
          eliminatedPlayer: targetPlayer,
          historyLog: [
            ...state.historyLog,
            `${targetPlayer.name} (The Revenger) tereliminasi dan bersiap membalas dendam!`,
          ],
        };
      }

      return executeElimination(state, targetPlayer, hooksResult.chainEliminatedIds, hooksResult.isJoyFoolBonus);
    }

    case 'RESOLVE_TIE_BREAKER': {
      const { mode, chosenPlayerId } = action;

      if (mode === 'REVOTE') {
        return {
          ...state,
          phase: 'VOTING',
          votes: {},
          quickCandidateId: null,
          historyLog: [...state.historyLog, 'Voting ulang dilakukan untuk menentukan eliminasi.'],
        };
      }

      if (chosenPlayerId) {
        const targetPlayer = state.players.find(p => p.id === chosenPlayerId);
        if (!targetPlayer) return state;

        const isFirstEliminated = state.firstEliminatedInGameId === null;
        const hooksResult = specialRoleHooks.onEliminated({
          eliminated: targetPlayer,
          players: state.players,
          round: state.round,
          isFirstEliminatedInGame: isFirstEliminated,
        });

        if (hooksResult.needsMrWhiteGuess) {
          return {
            ...state,
            phase: 'MR_WHITE_GUESS',
            eliminatedPlayer: targetPlayer,
          };
        }

        if (hooksResult.needsRevengerPrompt) {
          return {
            ...state,
            phase: 'REVENGER_REVENGE',
            eliminatedPlayer: targetPlayer,
          };
        }

        return executeElimination(state, targetPlayer, hooksResult.chainEliminatedIds, hooksResult.isJoyFoolBonus);
      }

      return state;
    }

    case 'SUBMIT_MR_WHITE_GUESS': {
      const guess = action.guess.trim();
      const civilianWord = state.activeWordPair?.civilianWord || '';
      const isCorrect = checkMrWhiteGuess(guess, civilianWord);

      if (isCorrect) {
        const winResult = evaluateWinCondition({
          players: state.players,
          eliminatedPlayer: state.eliminatedPlayer,
          mrWhiteGuess: guess,
          civilianWord,
        });

        const updatedPlayers = state.players.map(p => ({
          ...p,
          score: p.score + (winResult.roundScoreDeltas[p.id] || 0),
        }));

        return {
          ...state,
          phase: 'GAME_OVER',
          players: updatedPlayers,
          winner: winResult.winner,
          winReason: winResult.winReason,
          roundScoreDeltas: winResult.roundScoreDeltas,
          mrWhiteGuess: guess,
          historyLog: [
            ...state.historyLog,
            `Mr. White (${state.eliminatedPlayer?.name}) berhasil menebak "${civilianWord}" dengan benar dan memenangkan game!`,
          ],
        };
      }

      const targetPlayer = state.eliminatedPlayer!;
      const isFirstEliminated = state.firstEliminatedInGameId === null;
      const hooksResult = specialRoleHooks.onEliminated({
        eliminated: targetPlayer,
        players: state.players,
        round: state.round,
        isFirstEliminatedInGame: isFirstEliminated,
      });

      return {
        ...executeElimination(state, targetPlayer, hooksResult.chainEliminatedIds, hooksResult.isJoyFoolBonus),
        mrWhiteGuess: guess,
      };
    }

    case 'EXECUTE_REVENGER_CHOICE': {
      const revenger = state.eliminatedPlayer!;
      const target = state.players.find(p => p.id === action.targetId);
      
      const chainIds: string[] = [];
      if (target) {
        chainIds.push(target.id);
        if (target.specialRole === 'THE_LOVERS' && target.loverPartnerId) {
          chainIds.push(target.loverPartnerId);
        }
      }

      const isFirstEliminated = state.firstEliminatedInGameId === null;
      const hooksResult = specialRoleHooks.onEliminated({
        eliminated: revenger,
        players: state.players,
        round: state.round,
        isFirstEliminatedInGame: isFirstEliminated,
      });

      const allChains = Array.from(new Set([...hooksResult.chainEliminatedIds, ...chainIds]));
      return executeElimination(state, revenger, allChains, hooksResult.isJoyFoolBonus);
    }

    case 'NEXT_ROUND': {
      const nextRound = state.round + 1;
      const speechOrderIds = generateSpeechOrder(state.players, nextRound);
      
      const memeResult = specialRoleHooks.onRoundStart({
        players: state.players,
        round: nextRound,
        enabledRoles: state.config.enabledSpecialRoles,
      });

      const logs = [...state.historyLog, `Memulai Ronde ${nextRound}.`];
      if (memeResult.logMessage) {
        logs.push(memeResult.logMessage);
      }

      return {
        ...state,
        phase: 'DESCRIPTION',
        round: nextRound,
        speechOrderIds,
        currentSpeakerIndex: 0,
        eliminatedPlayer: null,
        chainEliminations: [],
        votes: {},
        quickCandidateId: null,
        mrWhiteGuess: '',
        memeCursePlayerId: memeResult.memeCursePlayerId,
        historyLog: logs,
      };
    }

    case 'REPLAY_GAME': {
      const rawPlayers = state.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        score: p.score,
      }));

      const { pair, civilianWord, undercoverWord } = selectRandomWordPair(
        state.config.selectedCategories,
        state.usedWordPairIds
      );

      const players = distributeRolesAndWords(
        rawPlayers,
        state.config.undercoverCount,
        state.config.mrWhiteCount,
        civilianWord,
        undercoverWord,
        state.config.enabledSpecialRoles
      );

      return {
        ...INITIAL_STATE,
        phase: 'WORD_REVEAL',
        players,
        round: 1,
        config: state.config,
        activeWordPair: {
          id: pair.id,
          civilianWord,
          undercoverWord,
          category: pair.category,
        },
        usedWordPairIds: [...state.usedWordPairIds, pair.id],
        historyLog: ['Game baru dimulai!'],
      };
    }

    case 'RESET_TO_LOBBY': {
      return {
        ...INITIAL_STATE,
        phase: 'LOBBY',
        usedWordPairIds: state.usedWordPairIds,
        players: state.players.map(p => ({
          ...p,
          isAlive: true,
          word: '',
          role: 'CIVILIAN',
          specialRole: null,
          loverPartnerId: null,
          eliminatedRound: null,
          isMemeCurse: false,
        })),
        config: state.config,
      };
    }

    default:
      return state;
  }
}

function executeElimination(
  state: GameState,
  targetPlayer: Player,
  chainEliminatedIds: string[],
  isJoyFoolBonus: boolean
): GameState {
  const eliminatedIds = [targetPlayer.id, ...chainEliminatedIds];
  const chainPlayers = state.players.filter(p => chainEliminatedIds.includes(p.id));

  let updatedPlayers = state.players.map(p => {
    if (eliminatedIds.includes(p.id)) {
      return {
        ...p,
        isAlive: false,
        eliminatedRound: state.round,
        score: isJoyFoolBonus && p.id === targetPlayer.id ? p.score + 4 : p.score,
      };
    }
    return p;
  });

  const firstElimId = state.firstEliminatedInGameId ?? targetPlayer.id;

  const winResult = evaluateWinCondition({
    players: updatedPlayers,
    eliminatedPlayer: targetPlayer,
    mrWhiteGuess: state.mrWhiteGuess,
    civilianWord: state.activeWordPair?.civilianWord,
  });

  const logs = [...state.historyLog];
  logs.push(`${targetPlayer.name} (${targetPlayer.role}) telah dieliminasi.`);
  chainPlayers.forEach(cp => {
    logs.push(`${cp.name} (${cp.role}) ikut tereliminasi.`);
  });

  if (isJoyFoolBonus) {
    logs.push(`${targetPlayer.name} mendapat bonus +4 poin sebagai The Joy Fool!`);
  }

  if (winResult.winner) {
    updatedPlayers = updatedPlayers.map(p => ({
      ...p,
      score: p.score + (winResult.roundScoreDeltas[p.id] || 0),
    }));

    logs.push(`GAME OVER: ${winResult.winReason}`);

    return {
      ...state,
      phase: 'GAME_OVER',
      players: updatedPlayers,
      eliminatedPlayer: targetPlayer,
      chainEliminations: chainPlayers,
      firstEliminatedInGameId: firstElimId,
      winner: winResult.winner,
      winReason: winResult.winReason,
      roundScoreDeltas: winResult.roundScoreDeltas,
      historyLog: logs,
    };
  }

  return {
    ...state,
    phase: 'ROUND_RESULT',
    players: updatedPlayers,
    eliminatedPlayer: targetPlayer,
    chainEliminations: chainPlayers,
    firstEliminatedInGameId: firstElimId,
    winner: null,
    winReason: '',
    roundScoreDeltas: {},
    historyLog: logs,
  };
}
