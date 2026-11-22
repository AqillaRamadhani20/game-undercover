import type { Role, SpecialRoleType, Player } from '../types/game';

export interface RoleCounts {
  undercoverCount: number;
  mrWhiteCount: number;
  civilianCount: number;
}

/**
 * Calculates standard Undercover role distribution:
 * Ensures Civilian is always the strict majority.
 */
export function calculateDefaultRoleCounts(playerCount: number): RoleCounts {
  const count = Math.max(3, Math.min(20, playerCount));
  
  let undercoverCount = 1;
  let mrWhiteCount = 0;

  if (count >= 5 && count <= 6) {
    undercoverCount = 1;
    mrWhiteCount = 1;
  } else if (count >= 7 && count <= 8) {
    undercoverCount = 2;
    mrWhiteCount = 1;
  } else if (count >= 9 && count <= 10) {
    undercoverCount = 2;
    mrWhiteCount = 2;
  } else if (count >= 11 && count <= 14) {
    undercoverCount = 3;
    mrWhiteCount = 2;
  } else if (count >= 15 && count <= 20) {
    undercoverCount = 4;
    mrWhiteCount = 3;
  }

  const civilianCount = count - undercoverCount - mrWhiteCount;
  return { undercoverCount, mrWhiteCount, civilianCount };
}

/**
 * Validates if custom role setup maintains game balance
 */
export function validateRoleCounts(
  playerCount: number,
  undercoverCount: number,
  mrWhiteCount: number
): { valid: boolean; reason?: string } {
  if (undercoverCount < 1) {
    return { valid: false, reason: 'Minimal harus ada 1 Undercover.' };
  }
  if (mrWhiteCount < 0) {
    return { valid: false, reason: 'Jumlah Mr. White tidak boleh negatif.' };
  }
  const civilianCount = playerCount - undercoverCount - mrWhiteCount;
  if (civilianCount <= undercoverCount + mrWhiteCount) {
    return { valid: false, reason: 'Civilian harus menjadi mayoritas pemain.' };
  }
  return { valid: true };
}

/**
 * Fisher-Yates shuffle array in place
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Assigns main roles, words, and optional special roles
 */
export function distributeRolesAndWords(
  rawPlayers: Array<{ id: string; name: string; avatar: string; avatarImage?: string; score?: number }>,
  undercoverCount: number,
  mrWhiteCount: number,
  civilianWord: string,
  undercoverWord: string,
  enabledSpecialRoles: SpecialRoleType[] = []
): Player[] {
  const playerCount = rawPlayers.length;
  const civilianCount = playerCount - undercoverCount - mrWhiteCount;

  // Build role pool
  const rolePool: Role[] = [
    ...Array(civilianCount).fill('CIVILIAN'),
    ...Array(undercoverCount).fill('UNDERCOVER'),
    ...Array(mrWhiteCount).fill('MR_WHITE'),
  ];
  const shuffledRoles = shuffleArray(rolePool);

  // Initial assignment
  const players: Player[] = rawPlayers.map((p, index) => {
    const role = shuffledRoles[index];
    let word = '';
    if (role === 'CIVILIAN') {
      word = civilianWord;
    } else if (role === 'UNDERCOVER') {
      word = undercoverWord;
    } else {
      word = ''; // Mr. White gets no word
    }

    return {
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      avatarImage: p.avatarImage,
      role,
      specialRole: null,
      loverPartnerId: null,
      word,
      isAlive: true,
      score: p.score ?? 0,
      eliminatedRound: null,
      isMemeCurse: false,
    };
  });

  // Assign Special Roles if enabled
  const validSpecialRoles = [...enabledSpecialRoles];

  // The Lovers requires at least 5 players
  const enableLovers = validSpecialRoles.includes('THE_LOVERS') && playerCount >= 5;
  const enableRevenger = validSpecialRoles.includes('THE_REVENGER') && playerCount >= 5;
  const enableGoddess = validSpecialRoles.includes('GODDESS_OF_JUSTICE');
  const enableJoyFool = validSpecialRoles.includes('THE_JOY_FOOL');
  const enableMrMeme = validSpecialRoles.includes('MR_MEME');

  // Random player indices for special role assignment
  const indices = shuffleArray(Array.from({ length: playerCount }, (_, i) => i));
  let cursor = 0;

  // The Lovers: 2 players
  if (enableLovers && indices.length >= cursor + 2) {
    const idx1 = indices[cursor++];
    const idx2 = indices[cursor++];
    players[idx1].specialRole = 'THE_LOVERS';
    players[idx1].loverPartnerId = players[idx2].id;
    players[idx2].specialRole = 'THE_LOVERS';
    players[idx2].loverPartnerId = players[idx1].id;
  }

  // Goddess of Justice: 1 player
  if (enableGoddess && cursor < indices.length) {
    const idx = indices[cursor++];
    players[idx].specialRole = 'GODDESS_OF_JUSTICE';
  }

  // The Revenger: 1 player
  if (enableRevenger && cursor < indices.length) {
    const idx = indices[cursor++];
    players[idx].specialRole = 'THE_REVENGER';
  }

  // The Joy Fool: 1 player
  if (enableJoyFool && cursor < indices.length) {
    const idx = indices[cursor++];
    players[idx].specialRole = 'THE_JOY_FOOL';
  }

  // Mr Meme: Special role marker on 1 player (creator/curser)
  if (enableMrMeme && cursor < indices.length) {
    const idx = indices[cursor++];
    players[idx].specialRole = 'MR_MEME';
  }

  return players;
}
