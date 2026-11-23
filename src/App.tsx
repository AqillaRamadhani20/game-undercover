import { useReducer, useState, useEffect } from 'react';
import {
  gameReducer,
  INITIAL_STATE,
  INITIAL_CONFIG
} from './engine/gameReducer';
import {
  loadSavedProfiles,
  savePlayerProfiles,
  updateCumulativeScores,
  resetCumulativeScores,
  loadSavedConfig,
  saveConfig
} from './utils/storage';
import { calculateDefaultRoleCounts } from './engine/roleDistributor';
import { getStoredPersonalWords, savePersonalWords } from './data/wordPairs';
import type { PlayerProfile, GameConfig, WordPair } from './types/game';

// Components
import { Header } from './components/layout/Header';
import { RulebookModal } from './components/common/RulebookModal';
import { ScoreboardModal } from './components/common/ScoreboardModal';
import { PersonalWordsModal } from './components/lobby/PersonalWordsModal';
import { LobbyScreen } from './components/lobby/LobbyScreen';
import { WordRevealScreen } from './components/reveal/WordRevealScreen';
import { DescriptionScreen } from './components/description/DescriptionScreen';
import { DiscussionScreen } from './components/discussion/DiscussionScreen';
import { VotingScreen } from './components/voting/VotingScreen';
import { TieBreakerModal } from './components/voting/TieBreakerModal';
import { MrWhiteGuessModal } from './components/voting/MrWhiteGuessModal';
import { RevengerChoiceModal } from './components/voting/RevengerChoiceModal';
import { RoundResultScreen } from './components/result/RoundResultScreen';
import { GameOverScreen } from './components/result/GameOverScreen';
import { UndercoverBackground } from './components/common/UndercoverBackground';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Persistent States
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => loadSavedProfiles());
  const [personalWords, setPersonalWords] = useState<WordPair[]>(() => getStoredPersonalWords());
  const [config, setConfig] = useState<GameConfig>(() => {
    const saved = loadSavedConfig();
    return saved ? { ...INITIAL_CONFIG, ...saved } : INITIAL_CONFIG;
  });

  // Modal Visibility
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isPersonalWordsOpen, setIsPersonalWordsOpen] = useState(false);

  // Sync config to localStorage
  const handleUpdateConfig = (newConfig: GameConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Sync player profiles to localStorage & keep config.playerCount synchronized
  const handleUpdateProfiles = (newProfiles: PlayerProfile[]) => {
    setProfiles(newProfiles);
    savePlayerProfiles(newProfiles);
    if (newProfiles.length !== config.playerCount) {
      const auto = calculateDefaultRoleCounts(newProfiles.length);
      handleUpdateConfig({
        ...config,
        playerCount: newProfiles.length,
        undercoverCount: auto.undercoverCount,
        mrWhiteCount: auto.mrWhiteCount,
      });
    }
  };

  // Update a player's name by ID and keep profiles in sync (clears avatarImage when name changes)
  const handleUpdatePlayerNameById = (playerId: string, name: string) => {
    dispatch({ type: 'UPDATE_PLAYER_NAME_BY_ID', playerId, name });
    setProfiles(prev => {
      const updated = prev.map(p => (p.id === playerId ? { ...p, name, avatarImage: undefined } : p));
      savePlayerProfiles(updated);
      return updated;
    });
  };

  // Sync personal words to localStorage
  const handleSavePersonalWords = (words: WordPair[]) => {
    setPersonalWords(words);
    savePersonalWords(words);
  };

  // Reset cumulative scores
  const handleResetScores = () => {
    const resetList = resetCumulativeScores(profiles);
    setProfiles(resetList);
  };

  // On Game Over, update cumulative player scores automatically
  useEffect(() => {
    if (state.phase === 'GAME_OVER' && state.winner) {
      setProfiles(prevProfiles =>
        updateCumulativeScores(prevProfiles, state.roundScoreDeltas, state.winner)
      );
    }
  }, [state.phase, state.winner, state.roundScoreDeltas]);



  const showUniversalHeader = 
    state.phase !== 'LOBBY' && 
    state.phase !== 'WORD_REVEAL' && 
    state.phase !== 'DESCRIPTION';

  return (
    <div className="min-h-screen bg-[#070B16] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* Atmospheric Undercover Nocturnal Background with reduced opacity */}
      <UndercoverBackground opacity={0.38} />
      {/* Universal Header (only in phases where integrated header isn't used) */}
      {showUniversalHeader && (
        <Header
          phase={state.phase}
          round={state.round}
          onOpenRulebook={() => setIsRulebookOpen(true)}
          onOpenScoreboard={() => setIsScoreboardOpen(true)}
          onResetToLobby={() => dispatch({ type: 'RESET_TO_LOBBY' })}
          onRerollWords={() => dispatch({ type: 'REROLL_WORDS' })}
        />
      )}

      {/* Main Screen Router based on FSM State */}
      <main className="flex-1 w-full">
        {state.phase === 'LOBBY' && (
          <LobbyScreen
            profiles={profiles}
            onUpdateProfiles={handleUpdateProfiles}
            config={config}
            onUpdateConfig={handleUpdateConfig}
            onStartGame={() => {
              dispatch({
                type: 'START_GAME',
                config,
                rawPlayers: profiles.map(p => ({
                  id: p.id,
                  name: p.name,
                  avatar: p.avatar,
                  avatarImage: p.avatarImage,
                  score: p.totalScore ?? 0,
                })),
              });
            }}
            onOpenPersonalWords={() => setIsPersonalWordsOpen(true)}
            onOpenRulebook={() => setIsRulebookOpen(true)}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {state.phase === 'WORD_REVEAL' && (
          <WordRevealScreen
            player={state.players[state.revealIndex]}
            playerIndex={state.revealIndex}
            totalPlayers={state.players.length}
            allPlayers={state.players}
            isCardRevealed={state.isCardRevealed}
            undercoverCount={state.config.undercoverCount}
            mrWhiteCount={state.config.mrWhiteCount}
            activeSpecialRoles={state.config.enabledSpecialRoles}
            savedProfiles={profiles}
            partnerPlayer={
              state.players[state.revealIndex]?.loverPartnerId
                ? state.players.find(p => p.id === state.players[state.revealIndex].loverPartnerId)
                : null
            }
            onRevealCard={() => dispatch({ type: 'REVEAL_CURRENT_CARD' })}
            onHideAndNext={() => dispatch({ type: 'HIDE_AND_NEXT_CARD' })}
            onReturnToLobby={() => dispatch({ type: 'RESET_TO_LOBBY' })}
            onOpenRulebook={() => setIsRulebookOpen(true)}
            onUpdatePlayerName={(name) => dispatch({ type: 'UPDATE_PLAYER_NAME', index: state.revealIndex, name })}
            onUpdatePlayerNameById={handleUpdatePlayerNameById}
            onUpdatePlayerProfile={(updates) => {
              dispatch({ type: 'UPDATE_PLAYER_PROFILE', index: state.revealIndex, ...updates });
              const curPlayer = state.players[state.revealIndex];
              if (curPlayer) {
                const updated = profiles.map(p => {
                  if (p.id === curPlayer.id) {
                    return {
                      ...p,
                      name: updates.name ?? p.name,
                      avatar: updates.avatar ?? p.avatar,
                      avatarImage: updates.avatarImage ?? p.avatarImage,
                    };
                  }
                  return p;
                });
                handleUpdateProfiles(updated);
              }
            }}
            onRerollWords={() => dispatch({ type: 'REROLL_WORDS' })}
            onClaimCard={(cardIndex, playerName, avatar, avatarImage, playerId, score) => {
              dispatch({
                type: 'CLAIM_CARD_AND_NEXT',
                cardIndex,
                playerName,
                avatar,
                avatarImage,
                playerId,
                score,
              });
              if (playerId) {
                setProfiles(prev => {
                  const updated = prev.map(p =>
                    p.id === playerId
                      ? {
                          ...p,
                          name: playerName,
                          avatar: avatar || p.avatar,
                          avatarImage: avatarImage !== undefined ? avatarImage : p.avatarImage,
                        }
                      : p
                  );
                  savePlayerProfiles(updated);
                  return updated;
                });
              } else {
                setProfiles(prev => {
                  const updated = [...prev];
                  if (updated[state.revealIndex]) {
                    updated[state.revealIndex] = {
                      ...updated[state.revealIndex],
                      name: playerName,
                      avatar: avatar || updated[state.revealIndex].avatar,
                      avatarImage: avatarImage !== undefined ? avatarImage : updated[state.revealIndex].avatarImage,
                    };
                    savePlayerProfiles(updated);
                  }
                  return updated;
                });
              }
            }}
          />
        )}

        {state.phase === 'DESCRIPTION' && (
          <DescriptionScreen
            round={state.round}
            players={state.players}
            profiles={profiles}
            speechOrderIds={state.speechOrderIds}
            undercoverCount={state.config.undercoverCount}
            mrWhiteCount={state.config.mrWhiteCount}
            onStartVoting={() => dispatch({ type: 'START_VOTING' })}
            onReturnToLobby={() => dispatch({ type: 'RESET_TO_LOBBY' })}
            onOpenRulebook={() => setIsRulebookOpen(true)}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
            onRerollWords={() => dispatch({ type: 'REROLL_WORDS' })}
            onUpdatePlayerNameById={handleUpdatePlayerNameById}
            onDeletePlayer={(playerId) => dispatch({ type: 'REMOVE_PLAYER_IN_GAME', playerId })}
            onAddPlayer={(name) => dispatch({ type: 'ADD_PLAYER_IN_GAME', name })}
          />
        )}

        {state.phase === 'DISCUSSION' && (
          <DiscussionScreen
            round={state.round}
            players={state.players}
            timerSecondsRemaining={state.timerSecondsRemaining}
            isTimerRunning={state.isTimerRunning}
            onTickTimer={() => dispatch({ type: 'TICK_TIMER' })}
            onToggleTimer={() => dispatch({ type: 'TOGGLE_TIMER' })}
            onAddSeconds={(sec) => dispatch({ type: 'ADD_TIMER_SECONDS', seconds: sec })}
            onStartVoting={() => dispatch({ type: 'START_VOTING' })}
          />
        )}

        {state.phase === 'VOTING' && (
          <VotingScreen
            round={state.round}
            players={state.players}
            votes={state.votes}
            quickCandidateId={state.quickCandidateId}
            onCastVote={(voterId, candidateId) =>
              dispatch({ type: 'CAST_VOTE', voterId, candidateId })
            }
            onSetQuickCandidate={(candidateId) =>
              dispatch({ type: 'SET_QUICK_CANDIDATE', candidateId })
            }
            onResolveVoting={() => dispatch({ type: 'RESOLVE_VOTING' })}
          />
        )}

        {state.phase === 'ROUND_RESULT' && (
          <RoundResultScreen
            round={state.round}
            eliminatedPlayer={state.eliminatedPlayer}
            chainEliminations={state.chainEliminations}
            players={state.players}
            onNextRound={() => dispatch({ type: 'NEXT_ROUND' })}
          />
        )}

        {state.phase === 'GAME_OVER' && (
          <GameOverScreen
            winner={state.winner}
            winReason={state.winReason}
            players={state.players}
            activeWordPair={state.activeWordPair}
            roundScoreDeltas={state.roundScoreDeltas}
            onReplayGame={() => dispatch({ type: 'REPLAY_GAME' })}
            onResetToLobby={() => dispatch({ type: 'RESET_TO_LOBBY' })}
          />
        )}
      </main>

      {/* Tie Breaker Modal (when voting results in tie) */}
      <TieBreakerModal
        isOpen={state.phase === 'TIE_BREAKER'}
        tiedPlayerIds={state.tiedPlayerIds}
        players={state.players}
        hasGoddess={false}
        goddessPlayer={null}
        onResolveTie={(mode, chosenPlayerId) =>
          dispatch({ type: 'RESOLVE_TIE_BREAKER', mode, chosenPlayerId })
        }
      />

      {/* Mr. White Guess Modal (1x last guess chance) */}
      {state.eliminatedPlayer && (
        <MrWhiteGuessModal
          isOpen={state.phase === 'MR_WHITE_GUESS'}
          mrWhitePlayer={state.eliminatedPlayer}
          onSubmitGuess={(guess) =>
            dispatch({ type: 'SUBMIT_MR_WHITE_GUESS', guess })
          }
        />
      )}

      {/* Revenger Choice Modal (1x drag down elimination) */}
      {state.eliminatedPlayer && (
        <RevengerChoiceModal
          isOpen={state.phase === 'REVENGER_REVENGE'}
          revenger={state.eliminatedPlayer}
          alivePlayers={state.players.filter(p => p.isAlive && p.id !== state.eliminatedPlayer?.id)}
          onSelectTarget={(targetId) =>
            dispatch({ type: 'EXECUTE_REVENGER_CHOICE', targetId })
          }
        />
      )}

      {/* Rulebook Modal */}
      <RulebookModal
        isOpen={isRulebookOpen}
        onClose={() => setIsRulebookOpen(false)}
      />

      {/* Scoreboard Leaderboard Modal */}
      <ScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
        profiles={profiles}
        onResetScores={handleResetScores}
      />

      {/* Personal Words Modal */}
      <PersonalWordsModal
        isOpen={isPersonalWordsOpen}
        onClose={() => setIsPersonalWordsOpen(false)}
        personalWords={personalWords}
        onSaveWords={handleSavePersonalWords}
      />
    </div>
  );
}

export default App;
