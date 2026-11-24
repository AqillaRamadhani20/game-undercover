import { gameReducer, INITIAL_CONFIG, INITIAL_STATE } from './gameReducer';
import { calculateDefaultRoleCounts, validateRoleCounts } from './roleDistributor';
import type { GameState } from '../types/game';

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

function assertStrictEqual<T>(actual: T, expected: T, msg: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${msg}\n  Expected: ${String(expected)}\n  Actual:   ${String(actual)}`);
  }
}

function assertNotStrictEqual<T>(actual: T, expected: T, msg: string) {
  if (actual === expected) {
    throw new Error(`Assertion failed: ${msg}\n  Did not expect: ${String(expected)}`);
  }
}

console.log('=====================================================');
console.log('🎮 STARTING 8-PLAYER COMPREHENSIVE GAMEPLAY TEST');
console.log('=====================================================\n');

// ----------------------------------------------------
// STEP 1: LOBBY CONFIGURATION FOR 8 PLAYERS
// ----------------------------------------------------
console.log('[STEP 1: Lobby Setup for 8 Players]');
const config8 = {
  ...INITIAL_CONFIG,
  playerCount: 8,
  ...calculateDefaultRoleCounts(8),
};

console.log(`Config for 8 players: Undercover=${config8.undercoverCount}, Mr. White=${config8.mrWhiteCount}`);
assertStrictEqual(config8.undercoverCount, 2, '8 players should have 2 Undercovers');
assertStrictEqual(config8.mrWhiteCount, 1, '8 players should have 1 Mr. White');

const civCount8 = config8.playerCount - config8.undercoverCount - config8.mrWhiteCount;
assertStrictEqual(civCount8, 5, '8 players should have 5 Civilians');
assert(civCount8 > config8.undercoverCount + config8.mrWhiteCount, 'Civilians must be strict majority (5 > 3)');

const validation = validateRoleCounts(8, config8.undercoverCount, config8.mrWhiteCount);
assertStrictEqual(validation.valid, true, 'Role distribution for 8 players is valid');
console.log('✅ PASSED: Lobby role configuration for 8 players is valid (5 Civilian, 2 Undercover, 1 Mr. White)');

// ----------------------------------------------------
// STEP 2: START GAME WITH 8 PLAYERS
// ----------------------------------------------------
console.log('\n[STEP 2: Starting Game with 8 Players]');
const raw8Players = [
  { id: 'p1', name: 'Fatih', avatar: '🦎', score: 0 },
  { id: 'p2', name: 'Aqil', avatar: '🦊', score: 0 },
  { id: 'p3', name: 'Budi', avatar: '🐱', score: 0 },
  { id: 'p4', name: 'Citra', avatar: '🐼', score: 0 },
  { id: 'p5', name: 'Doni', avatar: '🐯', score: 0 },
  { id: 'p6', name: 'Eka', avatar: '🦁', score: 0 },
  { id: 'p7', name: 'Gani', avatar: '🐵', score: 0 },
  { id: 'p8', name: 'Hana', avatar: '🐸', score: 0 },
];

let state: GameState = gameReducer(INITIAL_STATE, {
  type: 'START_GAME',
  config: config8,
  rawPlayers: raw8Players,
});

assertStrictEqual(state.phase, 'WORD_REVEAL', 'Game phase must be WORD_REVEAL');
assertStrictEqual(state.players.length, 8, 'There must be exactly 8 players');
assertStrictEqual(state.round, 1, 'Round starts at 1');
assertStrictEqual(state.revealIndex, 0, 'Reveal index starts at 0 (Player 1)');
assertStrictEqual(state.isReplay, false, 'Fresh start must have isReplay: false');

const civs = state.players.filter(p => p.role === 'CIVILIAN');
const unds = state.players.filter(p => p.role === 'UNDERCOVER');
const whites = state.players.filter(p => p.role === 'MR_WHITE');

assertStrictEqual(civs.length, 5, 'Exactly 5 Civilians assigned');
assertStrictEqual(unds.length, 2, 'Exactly 2 Undercovers assigned');
assertStrictEqual(whites.length, 1, 'Exactly 1 Mr. White assigned');

const civWord = state.activeWordPair!.civilianWord;
const undWord = state.activeWordPair!.undercoverWord;
assert(civWord && civWord.length > 0, 'Civilian word is non-empty');
assert(undWord && undWord.length > 0, 'Undercover word is non-empty');
assertNotStrictEqual(civWord, undWord, 'Civilian and Undercover words are different');

civs.forEach(c => assertStrictEqual(c.word, civWord, 'Civilian has civilian word'));
unds.forEach(u => assertStrictEqual(u.word, undWord, 'Undercover has undercover word'));
whites.forEach(w => assertStrictEqual(w.word, '', 'Mr. White has blank word'));

console.log(`Active words: Civilian="${civWord}", Undercover="${undWord}"`);
console.log('✅ PASSED: Roles and secret words correctly distributed across 8 players');

// ----------------------------------------------------
// STEP 3: ARBITRARY CARD REVEAL & CLAIM FOR 8 PLAYERS
// ----------------------------------------------------
console.log('\n[STEP 3: 8 Players Choosing & Claiming Mystery Cards]');

// 8 players pick cards in arbitrary order:
const cardPicks = [
  { playerIdx: 0, cardIdx: 6, name: 'Fatih' },
  { playerIdx: 1, cardIdx: 1, name: 'Aqil' },
  { playerIdx: 2, cardIdx: 4, name: 'Budi' },
  { playerIdx: 3, cardIdx: 7, name: 'Citra' },
  { playerIdx: 4, cardIdx: 0, name: 'Doni' },
  { playerIdx: 5, cardIdx: 3, name: 'Eka' },
  { playerIdx: 6, cardIdx: 5, name: 'Gani' },
  { playerIdx: 7, cardIdx: 2, name: 'Hana' },
];

cardPicks.forEach(({ playerIdx, cardIdx, name }) => {
  assertStrictEqual(state.revealIndex, playerIdx, `Player ${playerIdx + 1} turn`);
  state = gameReducer(state, {
    type: 'CLAIM_CARD_AND_NEXT',
    cardIndex: cardIdx,
    playerName: name,
    playerId: `p${playerIdx + 1}`,
    score: 0,
  });
  assertStrictEqual(state.players[cardIdx].name, name, `Card #${cardIdx + 1} claimed by ${name}`);
  console.log(`  🃏 Player ${playerIdx + 1} (${name}) picked Card #${cardIdx + 1} [Role: ${state.players[cardIdx].role}]`);
});

assertStrictEqual(state.phase, 'DESCRIPTION', 'All 8 cards claimed -> phase must be DESCRIPTION');
console.log('✅ PASSED: All 8 players successfully chose distinct cards and claimed them!');

// ----------------------------------------------------
// STEP 4: DESCRIPTION PHASE & SPEECH ORDER
// ----------------------------------------------------
console.log('\n[STEP 4: Deskripsi Waktu (Speech Order & Rules)]');
assertStrictEqual(state.speechOrderIds.length, 8, 'Speech order has all 8 players');

// Rule: Mr. White is NOT first speaker in Round 1
const firstSpeaker = state.players.find(p => p.id === state.speechOrderIds[0]);
assert(firstSpeaker, 'First speaker exists');
assertNotStrictEqual(firstSpeaker?.role, 'MR_WHITE', 'Mr. White CANNOT be the first speaker in Round 1');
console.log(`  🎤 First speaker: ${firstSpeaker?.name} (${firstSpeaker?.role})`);
console.log(`  📋 Speech order: ${state.speechOrderIds.map(id => state.players.find(p => p.id === id)?.name).join(' -> ')}`);
console.log('✅ PASSED: Speech order correctly generated with Mr. White rule respected!');

// ----------------------------------------------------
// STEP 5: IN-GAME PLAYER MANAGEMENT (IMAGE 6)
// ----------------------------------------------------
console.log('\n[STEP 5: In-Game Add & Delete Player in Deskripsi Waktu]');
// Delete Doni (p5)
state = gameReducer(state, {
  type: 'REMOVE_PLAYER_IN_GAME',
  playerId: 'p5',
});
assertStrictEqual(state.players.length, 7, 'Player count reduced to 7 after deletion');
assertStrictEqual(state.speechOrderIds.length, 7, 'Speech order reduced to 7');
assert(!state.players.some(p => p.id === 'p5'), 'Doni no longer in players list');
console.log('  🗑️ Successfully removed player "Doni" from 8-player roster');

// Add Zaki
state = gameReducer(state, {
  type: 'ADD_PLAYER_IN_GAME',
  name: 'Zaki',
});
assertStrictEqual(state.players.length, 8, 'Player count restored to 8 after addition');
assertStrictEqual(state.speechOrderIds.length, 8, 'Speech order restored to 8');
const zaki = state.players.find(p => p.name === 'Zaki');
assert(zaki, 'Zaki exists in player roster');
assertStrictEqual(zaki?.role, 'CIVILIAN', 'Newly added player is default Civilian');
assertStrictEqual(zaki?.word, civWord, 'Newly added player gets active civilian word');
console.log('  ➕ Successfully added new player "Zaki" as Civilian with word');
console.log('✅ PASSED: In-game player management functions flawlessly!');

// ----------------------------------------------------
// STEP 6: VOTING PHASE & ELIMINATION
// ----------------------------------------------------
console.log('\n[STEP 6: Voting Phase & Elimination]');
state = gameReducer(state, { type: 'START_VOTING' });
assertStrictEqual(state.phase, 'VOTING', 'Phase must be VOTING');

// Find an undercover player to vote out
const targetUndercover = state.players.find(p => p.role === 'UNDERCOVER' && p.isAlive)!;
assert(targetUndercover, 'At least 1 alive undercover exists');
console.log(`  🎯 Target to eliminate: ${targetUndercover.name} (UNDERCOVER)`);

// Cast votes: 5 players vote for the target undercover, 2 for another, 1 for another
const aliveVoters = state.players.filter(p => p.isAlive);
aliveVoters.forEach((voter, idx) => {
  const targetId = idx < 5 ? targetUndercover.id : aliveVoters[(idx + 1) % aliveVoters.length].id;
  state = gameReducer(state, {
    type: 'CAST_VOTE',
    voterId: voter.id,
    candidateId: targetId,
  });
});
assertStrictEqual(Object.keys(state.votes).length, 8, 'All 8 players cast votes');

// Resolve voting
state = gameReducer(state, { type: 'RESOLVE_VOTING' });
assertStrictEqual(state.eliminatedPlayer?.id, targetUndercover.id, `${targetUndercover.name} is eliminated`);
console.log(`  ☠️ Eliminated player: ${targetUndercover.name} (${targetUndercover.role})`);

// ----------------------------------------------------
// STEP 7: ADVANCING TO ROUND 2
// ----------------------------------------------------
console.log('\n[STEP 7: Advancing to Round 2]');
state = gameReducer(state, { type: 'NEXT_ROUND' });
assertStrictEqual(state.round, 2, 'Round is now 2');
assertStrictEqual(state.phase, 'DESCRIPTION', 'Phase returns to DESCRIPTION for Round 2');
assertStrictEqual(state.speechOrderIds.length, 7, 'Speech order in Round 2 has 7 alive players');
console.log('✅ PASSED: Round 2 successfully initialized with 7 surviving players');

// ----------------------------------------------------
// STEP 8: REPLAY ("MAIN LAGI") TEST FOR 8 PLAYERS
// ----------------------------------------------------
console.log('\n[STEP 8: Replay "Main Lagi" with 8 Players]');
const replay8State = gameReducer(state, { type: 'REPLAY_GAME' });

assertStrictEqual(replay8State.phase, 'WORD_REVEAL', 'Replay directly enters WORD_REVEAL');
assertStrictEqual(replay8State.isReplay, true, 'Replay state has isReplay = true');
assertStrictEqual(replay8State.players.length, 8, 'All 8 players preserved in replay');
assertStrictEqual(replay8State.revealIndex, 0, 'Card reveal index ready at Player 1');

// Verify that player names are preserved from previous game
const preservedNames = replay8State.players.map(p => p.name);
console.log(`  👥 Preserved player names for replay: ${preservedNames.join(', ')}`);
assert(preservedNames.includes('Fatih'), 'Fatih preserved');
assert(preservedNames.includes('Aqil'), 'Aqil preserved');

// Verify avatar images are cleared on replay
replay8State.players.forEach(p => {
  assertStrictEqual(p.avatarImage, undefined, `Avatar image cleared for ${p.name}`);
});

console.log('✅ PASSED: Replay "Main Lagi" mode correctly preserves 8 player names and sets isReplay: true!');

console.log('\n=====================================================');
console.log('🎉 ALL 8-PLAYER TEST SUITES PASSED FLAWLESSLY! (8/8)');
console.log('=====================================================\n');
