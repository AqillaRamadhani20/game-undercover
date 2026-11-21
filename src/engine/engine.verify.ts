import { calculateDefaultRoleCounts, validateRoleCounts } from './roleDistributor';
import { evaluateWinCondition } from './winEvaluator';
import { DEFAULT_WORD_PAIRS, selectRandomWordPair } from '../data/wordPairs';
import { generateSpeechOrder } from './gameReducer';
import { specialRoleHooks } from './specialRoleHooks';
import type { Player } from '../types/game';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    throw new Error(msg);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('--- STARTING UNDERCOVER ENGINE VERIFICATION ---');

// 1. Role Distribution Tests
console.log('\n[1. Role Distribution]');
for (let n = 3; n <= 20; n++) {
  const counts = calculateDefaultRoleCounts(n);
  const val = validateRoleCounts(n, counts.undercoverCount, counts.mrWhiteCount);
  assert(val.valid, `Valid roles for ${n} players: Civ=${counts.civilianCount}, Und=${counts.undercoverCount}, Wh=${counts.mrWhiteCount}`);
  assert(counts.civilianCount > counts.undercoverCount + counts.mrWhiteCount, `Civilian is strict majority for ${n} players`);
  assert(counts.undercoverCount >= 1, `At least 1 undercover for ${n} players`);
}

// 2. Word Pair Pool & Anti-Repeat Tests
console.log('\n[2. Word Pair Pool & Random Swap]');
assert(DEFAULT_WORD_PAIRS.length >= 35, `Word pool count (${DEFAULT_WORD_PAIRS.length}) >= 35`);
const selectedPairs = new Set<string>();
const usedIds: string[] = [];
for (let i = 0; i < 10; i++) {
  const { pair, civilianWord, undercoverWord } = selectRandomWordPair([], usedIds);
  assert(pair.wordA !== pair.wordB, `WordA and WordB are distinct: ${pair.wordA} vs ${pair.wordB}`);
  assert(
    (civilianWord === pair.wordA && undercoverWord === pair.wordB) ||
    (civilianWord === pair.wordB && undercoverWord === pair.wordA),
    `Random swap works properly for "${civilianWord}" & "${undercoverWord}"`
  );
  usedIds.push(pair.id);
  selectedPairs.add(pair.id);
}
assert(selectedPairs.size === 10, 'No repeat in 10 consecutive selections');

// 3. Win Condition Evaluation (Strict User-Ordered Rules)
console.log('\n[3. Win Evaluator Tests]');

// Rule 1: Mr White correct guess
const mrWhitePlayer: Player = {
  id: 'p-white',
  name: 'Mr. White Player',
  avatar: '🎭',
  role: 'MR_WHITE',
  specialRole: null,
  word: '',
  isAlive: false,
  score: 0,
};
const dummyPlayers: Player[] = [
  mrWhitePlayer,
  { id: 'p-civ1', name: 'Civ 1', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p-und1', name: 'Und 1', avatar: '🕵️', role: 'UNDERCOVER', specialRole: null, word: 'Teh', isAlive: true, score: 0 },
];

const resMrWhiteWin = evaluateWinCondition({
  players: dummyPlayers,
  eliminatedPlayer: mrWhitePlayer,
  mrWhiteGuess: '   kOpi  ',
  civilianWord: 'Kopi',
});
assert(resMrWhiteWin.winner === 'MR_WHITE_WIN', 'Mr. White correct guess results in MR_WHITE_WIN');
assert(resMrWhiteWin.roundScoreDeltas['p-white'] === 6, 'Mr. White receives +6 points on win');

// Rule 2: Civilians Win (All infiltrators eliminated)
const civWinPlayers: Player[] = [
  { id: 'p1', name: 'Civ1', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p2', name: 'Civ2', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p3', name: 'Und1', avatar: '🕵️', role: 'UNDERCOVER', specialRole: null, word: 'Teh', isAlive: false, score: 0 },
  { id: 'p4', name: 'Wh1', avatar: '🎭', role: 'MR_WHITE', specialRole: null, word: '', isAlive: false, score: 0 },
];
const resCivWin = evaluateWinCondition({
  players: civWinPlayers,
  eliminatedPlayer: civWinPlayers[2],
  civilianWord: 'Kopi',
});
assert(resCivWin.winner === 'CIVILIANS_WIN', 'All infiltrators dead results in CIVILIANS_WIN');
assert(resCivWin.roundScoreDeltas['p1'] === 2 && resCivWin.roundScoreDeltas['p2'] === 2, 'Civilians receive +2 points each');

// Rule 3: Infiltrators Win (Alive Civilians <= 1)
const infWinPlayers: Player[] = [
  { id: 'p1', name: 'Civ1', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p2', name: 'Civ2', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: false, score: 0 },
  { id: 'p3', name: 'Und1', avatar: '🕵️', role: 'UNDERCOVER', specialRole: null, word: 'Teh', isAlive: true, score: 0 },
  { id: 'p4', name: 'Wh1', avatar: '🎭', role: 'MR_WHITE', specialRole: null, word: '', isAlive: true, score: 0 },
];
const resInfWin = evaluateWinCondition({
  players: infWinPlayers,
  eliminatedPlayer: infWinPlayers[1],
  civilianWord: 'Kopi',
});
assert(resInfWin.winner === 'INFILTRATORS_WIN', 'Alive civilians <= 1 results in INFILTRATORS_WIN');
assert(resInfWin.roundScoreDeltas['p3'] === 10, 'Undercover receives +10 points');
assert(resInfWin.roundScoreDeltas['p4'] === 6, 'Mr. White receives +6 points');

// Rule 4: Ongoing game
const ongoingPlayers: Player[] = [
  { id: 'p1', name: 'Civ1', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p2', name: 'Civ2', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p3', name: 'Civ3', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p4', name: 'Und1', avatar: '🕵️', role: 'UNDERCOVER', specialRole: null, word: 'Teh', isAlive: true, score: 0 },
];
const resOngoing = evaluateWinCondition({
  players: ongoingPlayers,
  civilianWord: 'Kopi',
});
assert(resOngoing.winner === null, 'Game continues when conditions not met');

// 4. Special Roles & Speech Order
console.log('\n[4. Special Roles & Speech Order]');
const testSpeechPlayers: Player[] = [
  { id: 'p1', name: 'White', avatar: '🎭', role: 'MR_WHITE', specialRole: null, word: '', isAlive: true, score: 0 },
  { id: 'p2', name: 'Civ1', avatar: '🦎', role: 'CIVILIAN', specialRole: null, word: 'Kopi', isAlive: true, score: 0 },
  { id: 'p3', name: 'Und1', avatar: '🕵️', role: 'UNDERCOVER', specialRole: null, word: 'Teh', isAlive: true, score: 0 },
];
for (let i = 0; i < 50; i++) {
  const order = generateSpeechOrder(testSpeechPlayers, 1);
  assert(order[0] !== 'p1', 'Mr. White is NOT first speaker in Round 1');
}

// Lovers Chain Test
const loversElim = specialRoleHooks.onEliminated({
  eliminated: {
    id: 'l1',
    name: 'Romeo',
    avatar: '🐱',
    role: 'CIVILIAN',
    specialRole: 'THE_LOVERS',
    loverPartnerId: 'l2',
    word: 'Kopi',
    isAlive: true,
    score: 0,
  },
  players: [
    { id: 'l1', name: 'Romeo', avatar: '🐱', role: 'CIVILIAN', specialRole: 'THE_LOVERS', loverPartnerId: 'l2', word: 'Kopi', isAlive: true, score: 0 },
    { id: 'l2', name: 'Juliet', avatar: '🐼', role: 'CIVILIAN', specialRole: 'THE_LOVERS', loverPartnerId: 'l1', word: 'Kopi', isAlive: true, score: 0 },
  ],
  round: 1,
  isFirstEliminatedInGame: true,
});
assert(loversElim.chainEliminatedIds.includes('l2'), 'The Lovers partner is automatically chained for elimination');

// Joy Fool Test
const joyFoolElim = specialRoleHooks.onEliminated({
  eliminated: {
    id: 'jf',
    name: 'Joker',
    avatar: '🤡',
    role: 'CIVILIAN',
    specialRole: 'THE_JOY_FOOL',
    word: 'Kopi',
    isAlive: true,
    score: 0,
  },
  players: [],
  round: 1,
  isFirstEliminatedInGame: true,
});
assert(joyFoolElim.isJoyFoolBonus === true, 'The Joy Fool receives bonus if eliminated first in round 1');

console.log('\n========================================');
console.log('🎉 ALL ENGINE VERIFICATION CHECKS PASSED!');
console.log('========================================\n');
