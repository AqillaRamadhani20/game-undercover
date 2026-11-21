import type { Player, WinFaction } from '../types/game';

export interface WinEvaluationResult {
  winner: WinFaction | null;
  winReason: string;
  roundScoreDeltas: Record<string, number>;
}

/**
 * Evaluates game victory condition in the strict order specified:
 * 1. If eliminated.role === 'MR_WHITE' and guess matches civilianWord -> MR_WHITE_WIN (+6 pts)
 * 2. If aliveUndercover === 0 && aliveMrWhite === 0 -> CIVILIANS_WIN (+2 pts per Civilian)
 * 3. If aliveCivilians <= 1 -> INFILTRATORS_WIN (Undercover +10 pts, Mr. White +6 pts)
 * 4. Otherwise -> null (game continues)
 */
export function evaluateWinCondition(params: {
  players: Player[];
  eliminatedPlayer?: Player | null;
  mrWhiteGuess?: string;
  civilianWord?: string;
}): WinEvaluationResult {
  const { players, eliminatedPlayer, mrWhiteGuess, civilianWord } = params;

  // 1. Check Mr. White correct guess
  if (
    eliminatedPlayer &&
    eliminatedPlayer.role === 'MR_WHITE' &&
    mrWhiteGuess &&
    civilianWord
  ) {
    const cleanGuess = mrWhiteGuess.trim().toLowerCase();
    const cleanCivilian = civilianWord.trim().toLowerCase();
    
    if (cleanGuess === cleanCivilian) {
      const deltas: Record<string, number> = {};
      players.forEach(p => {
        deltas[p.id] = p.role === 'MR_WHITE' ? 6 : 0;
      });
      return {
        winner: 'MR_WHITE_WIN',
        winReason: `Mr. White (${eliminatedPlayer.name}) berhasil menebak kata Civilian "${civilianWord}" secara tepat!`,
        roundScoreDeltas: deltas,
      };
    }
  }

  const alivePlayers = players.filter(p => p.isAlive);
  const aliveCivilians = alivePlayers.filter(p => p.role === 'CIVILIAN').length;
  const aliveUndercover = alivePlayers.filter(p => p.role === 'UNDERCOVER').length;
  const aliveMrWhite = alivePlayers.filter(p => p.role === 'MR_WHITE').length;

  // 2. All Infiltrators (Undercovers & Mr. Whites) eliminated -> Civilians win
  if (aliveUndercover === 0 && aliveMrWhite === 0) {
    const deltas: Record<string, number> = {};
    players.forEach(p => {
      deltas[p.id] = p.role === 'CIVILIAN' ? 2 : 0;
    });
    return {
      winner: 'CIVILIANS_WIN',
      winReason: 'Seluruh penyusup (Undercover & Mr. White) telah berhasil dieliminasi! Warga sipil menang damai.',
      roundScoreDeltas: deltas,
    };
  }

  // 3. Infiltrators dominate: Alive civilians <= 1 -> Infiltrators win
  if (aliveCivilians <= 1) {
    const deltas: Record<string, number> = {};
    players.forEach(p => {
      if (p.role === 'UNDERCOVER') {
        deltas[p.id] = 10;
      } else if (p.role === 'MR_WHITE') {
        deltas[p.id] = 6;
      } else {
        deltas[p.id] = 0;
      }
    });
    return {
      winner: 'INFILTRATORS_WIN',
      winReason: 'Penyusup menguasai permainan! Hanya tersisa 1 atau 0 warga sipil yang bertahan.',
      roundScoreDeltas: deltas,
    };
  }

  // 4. Game Continues
  return {
    winner: null,
    winReason: '',
    roundScoreDeltas: {},
  };
}

/**
 * Validates a Mr. White guess against the civilian secret word
 */
export function checkMrWhiteGuess(guess: string, civilianWord: string): boolean {
  if (!guess || !civilianWord) return false;
  const g = guess.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const c = civilianWord.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return g === c;
}
