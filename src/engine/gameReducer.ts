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
  | { type: 'START_GAME'; config: GameConfig; rawPlayers: Array<{ id: string; name: string; avatar: string; avatarImage?: string; score?: number }> }
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
  | { type: 'UPDATE_PLAYER_NAME'; index: number; name: string }
  | { type: 'UPDATE_PLAYER_NAME_BY_ID'; playerId: string; name: string }
  | { type: 'UPDATE_PLAYER_PROFILE'; index: number; name?: string; avatar?: string; avatarImage?: string }
  | { type: 'REROLL_WORDS' }
  | { 
      type: 'CLAIM_CARD_AND_NEXT'; 
      cardIndex: number; 
      playerName: string; 
      avatar?: string; 
      avatarImage?: string; 
      playerId?: string;
      score?: number;
    }
  | { type: 'REMOVE_PLAYER_IN_GAME'; playerId: string }
  | { type: 'ADD_PLAYER_IN_GAME'; name: string }
  | { type: 'NEXT_ROUND' }
  | { type: 'REPLAY_GAME' }
  | { type: 'RESET_TO_LOBBY' };

export const INITIAL_CONFIG: GameConfig = {
  playerCount: 5,
  undercoverCount: 1,
  mrWhiteCount: 1,
  enabledSpecialRoles: [],
  selectedCategories: [
    'Makanan & Minuman',
    'Benda Sehari-hari',
    'Hewan & Alam',
    'Teknologi & Pop',
    'Profesi & Transportasi',
    'Artis & Superhero',
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

    case 'UPDATE_PLAYER_NAME': {
      const { index, name } = action;
      if (!state.players[index]) return state;
      const updatedPlayers = [...state.players];
      updatedPlayers[index] = { ...updatedPlayers[index], name };
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case 'UPDATE_PLAYER_NAME_BY_ID': {
      const { playerId, name } = action;
      const updatedPlayers = state.players.map(p => 
        p.id === playerId ? { ...p, name } : p
      );
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case 'UPDATE_PLAYER_PROFILE': {
      const { index, name, avatar, avatarImage } = action;
      if (!state.players[index]) return state;
      const updatedPlayers = [...state.players];
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        name: name !== undefined ? name : updatedPlayers[index].name,
        avatar: avatar !== undefined ? avatar : updatedPlayers[index].avatar,
        avatarImage: avatarImage !== undefined ? avatarImage : updatedPlayers[index].avatarImage,
      };
      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case 'REROLL_WORDS': {
      if (!state.activeWordPair) return state;

      // Select new pair
      const { pair, civilianWord, undercoverWord } = selectRandomWordPair(
        state.config.selectedCategories,
        state.usedWordPairIds
      );

      // Reassign word according to role
      const updatedPlayers = state.players.map(p => {
        let word = '';
        if (p.role === 'CIVILIAN') {
          word = civilianWord;
        } else if (p.role === 'UNDERCOVER') {
          word = undercoverWord;
        } else if (p.role === 'MR_WHITE') {
          word = '';
        }
        return {
          ...p,
          word,
        };
      });

      const updatedActiveWordPair = {
        id: pair.id,
        civilianWord,
        undercoverWord,
        category: pair.category,
      };

      return {
        ...state,
        phase: 'WORD_REVEAL',
        players: updatedPlayers,
        activeWordPair: updatedActiveWordPair,
        usedWordPairIds: [...state.usedWordPairIds, pair.id],
        revealIndex: 0,
        isCardRevealed: false,
        historyLog: [
          ...state.historyLog,
          `Kata rahasia diacak ulang: Kategori ${pair.category}. Buka kartu dimulai kembali dari Player 1.`,
        ],
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
        const speechOrder = generateSpeechOrder(state.players, state.round);
        return {
          ...state,
          phase: 'DESCRIPTION',
          speechOrderIds: speechOrder,
          currentSpeakerIndex: 0,
          revealIndex: 0,
          isCardRevealed: false,
          historyLog: [
            ...state.historyLog,
            'Semua pemain telah melihat kata masing-masing. Masuk ke fase Deskripsi Waktu.',
          ],
        };
      }

      return {
        ...state,
        revealIndex: nextIndex,
        isCardRevealed: false,
      };
    }

    case 'CLAIM_CARD_AND_NEXT': {
      const { cardIndex, playerName, avatar, avatarImage, playerId, score } = action;
      const updatedPlayers = [...state.players];
      if (updatedPlayers[cardIndex]) {
        updatedPlayers[cardIndex] = {
          ...updatedPlayers[cardIndex],
          name: playerName.trim() || updatedPlayers[cardIndex].name,
          id: playerId || updatedPlayers[cardIndex].id,
          avatar: avatar || updatedPlayers[cardIndex].avatar,
          avatarImage: avatarImage !== undefined ? avatarImage : updatedPlayers[cardIndex].avatarImage,
          score: score !== undefined ? score : updatedPlayers[cardIndex].score,
        };
      }

      const nextRevealIndex = state.revealIndex + 1;
      if (nextRevealIndex >= updatedPlayers.length) {
        const speechOrder = generateSpeechOrder(updatedPlayers, state.round);
        return {
          ...state,
          phase: 'DESCRIPTION',
          players: updatedPlayers,
          speechOrderIds: speechOrder,
          currentSpeakerIndex: 0,
          revealIndex: 0,
          isCardRevealed: false,
          historyLog: [
            ...state.historyLog,
            'Semua pemain telah memilih kartu dan melihat kata rahasia. Memulai Fase Deskripsi Waktu!',
          ],
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        revealIndex: nextRevealIndex,
        isCardRevealed: false,
      };
    }

    case 'REMOVE_PLAYER_IN_GAME': {
      const { playerId } = action;
      const updatedPlayers = state.players.filter(p => p.id !== playerId);
      const updatedSpeechOrder = state.speechOrderIds.filter(id => id !== playerId);
      return {
        ...state,
        players: updatedPlayers,
        speechOrderIds: updatedSpeechOrder,
        historyLog: [...state.historyLog, 'Pemain dihapus dari permainan.'],
      };
    }

    case 'ADD_PLAYER_IN_GAME': {
      const { name } = action;
      const newId = `player-added-${Date.now()}`;
      const newPlayer: Player = {
        id: newId,
        name: name.trim(),
        avatar: '👤',
        role: 'CIVILIAN',
        specialRole: null,
        word: state.activeWordPair?.civilianWord || '',
        isAlive: true,
        score: 0,
      };
      const updatedPlayers = [...state.players, newPlayer];
      const updatedSpeechOrder = [...state.speechOrderIds, newId];
      return {
        ...state,
        players: updatedPlayers,
        speechOrderIds: updatedSpeechOrder,
        historyLog: [...state.historyLog, `Pemain baru (${name.trim()}) ditambahkan ke permainan.`],
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
      const speechOrder = generateSpeechOrder(state.players, nextRound);
      return {
        ...state,
        phase: 'DESCRIPTION',
        round: nextRound,
        speechOrderIds: speechOrder,
        currentSpeakerIndex: 0,
        eliminatedPlayer: null,
        chainEliminations: [],
        votes: {},
        quickCandidateId: null,
        mrWhiteGuess: '',
        roundScoreDeltas: {},
        historyLog: [...state.historyLog, `Memulai Ronde ${nextRound}. Fase Deskripsi Waktu.`],
      };
    }

    case 'REPLAY_GAME': {
      const rawPlayers = state.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        avatarImage: undefined, // Clear foto profil on replay so it resets cleanly
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
        historyLog: ['Game baru dimulai! Langsung buka kartu masing-masing tanpa perlu input ulang nama.'],
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
