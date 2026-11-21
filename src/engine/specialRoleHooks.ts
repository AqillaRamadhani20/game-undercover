import type { Player, SpecialRoleType } from '../types/game';

export interface SpecialRoleHooks {
  /**
   * Called at the beginning of each round (e.g. Mr. Meme curse selection)
   */
  onRoundStart: (params: {
    players: Player[];
    round: number;
    enabledRoles: SpecialRoleType[];
  }) => { memeCursePlayerId: string | null; logMessage?: string };

  /**
   * Called when a tie occurs during voting
   */
  onVoteTie: (params: {
    players: Player[];
    tiedPlayerIds: string[];
    enabledRoles: SpecialRoleType[];
  }) => {
    hasGoddess: boolean;
    goddessPlayer: Player | null;
  };

  /**
   * Called when a player is eliminated (checks Lovers cascade, Joy Fool, Revenger)
   */
  onEliminated: (params: {
    eliminated: Player;
    players: Player[];
    round: number;
    isFirstEliminatedInGame: boolean;
  }) => {
    chainEliminatedIds: string[];
    isJoyFoolBonus: boolean;
    needsRevengerPrompt: boolean;
    needsMrWhiteGuess: boolean;
    logMessages: string[];
  };
}

export const specialRoleHooks: SpecialRoleHooks = {
  onRoundStart: ({ players, round, enabledRoles }) => {
    if (!enabledRoles.includes('MR_MEME')) {
      return { memeCursePlayerId: null };
    }

    const alive = players.filter(p => p.isAlive);
    if (alive.length === 0) return { memeCursePlayerId: null };

    // Randomly select 1 alive player to be cursed by Mr. Meme for this round
    const randomPlayer = alive[Math.floor(Math.random() * alive.length)];
    return {
      memeCursePlayerId: randomPlayer.id,
      logMessage: `[Ronde ${round}] Kutukan Mr. Meme jatuh kepada ${randomPlayer.name}! Wajib mendeskripsikan kata HANYA menggunakan gestur bisu tanpa suara.`,
    };
  },

  onVoteTie: ({ players, enabledRoles }) => {
    if (!enabledRoles.includes('GODDESS_OF_JUSTICE')) {
      return { hasGoddess: false, goddessPlayer: null };
    }

    // Goddess of Justice can decide ties even if eliminated!
    const goddess = players.find(p => p.specialRole === 'GODDESS_OF_JUSTICE');
    if (!goddess) {
      return { hasGoddess: false, goddessPlayer: null };
    }

    return {
      hasGoddess: true,
      goddessPlayer: goddess,
    };
  },

  onEliminated: ({ eliminated, players, round, isFirstEliminatedInGame }) => {
    const chainEliminatedIds: string[] = [];
    const logMessages: string[] = [];
    let isJoyFoolBonus = false;

    // 1. The Lovers cascade: if 1 dies, partner dies
    if (eliminated.specialRole === 'THE_LOVERS' && eliminated.loverPartnerId) {
      const partner = players.find(p => p.id === eliminated.loverPartnerId && p.isAlive);
      if (partner) {
        chainEliminatedIds.push(partner.id);
        logMessages.push(
          `Tragedi Cinta! ${eliminated.name} dan ${partner.name} adalah The Lovers. ${partner.name} ikut gugur karena patah hati!`
        );
      }
    }

    // 2. The Joy Fool: if first eliminated in round 1, earns +4 points bonus
    if (eliminated.specialRole === 'THE_JOY_FOOL' && round === 1 && isFirstEliminatedInGame) {
      isJoyFoolBonus = true;
      logMessages.push(
        `The Joy Fool (${eliminated.name}) tersingkir pertama di ronde 1! Misi badut tercapai: Mendapat bonus +4 poin!`
      );
    }

    // 3. The Revenger: when eliminated, gets to pick 1 alive player to drag down
    const needsRevengerPrompt = eliminated.specialRole === 'THE_REVENGER';
    if (needsRevengerPrompt) {
      logMessages.push(
        `The Revenger (${eliminated.name}) telah dieliminasi! Dendam membara: memilih 1 pemain untuk diseret bersamanya!`
      );
    }

    // 4. Mr. White Guess opportunity
    const needsMrWhiteGuess = eliminated.role === 'MR_WHITE';

    return {
      chainEliminatedIds,
      isJoyFoolBonus,
      needsRevengerPrompt,
      needsMrWhiteGuess,
      logMessages,
    };
  },
};
