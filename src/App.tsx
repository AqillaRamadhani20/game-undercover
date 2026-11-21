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
  loadSavedTheme, 
  saveTheme,
  loadSavedConfig,
  saveConfig
} from './utils/storage';
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
import { specialRoleHooks } from './engine/specialRoleHooks';

export function App() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Persistent States
  const [profiles, setProfiles] = useState<PlayerProfile[]>(() => loadSavedProfiles());
  const [personalWords, setPersonalWords] = useState<WordPair[]>(() => getStoredPersonalWords());
  const [isDark, setIsDark] = useState<boolean>(() => loadSavedTheme());
  const [config, setConfig] = useState<GameConfig>(() => {
    const saved = loadSavedConfig();
    return saved ? { ...INITIAL_CONFIG, ...saved } : INITIAL_CONFIG;
  });

  // Modal Visibility
  const [isRulebookOpen, setIsRulebookOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isPersonalWordsOpen, setIsPersonalWordsOpen] = useState(false);

  // Sync theme class to document body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(isDark);
  }, [isDark]);

  // Sync config to localStorage
  const handleUpdateConfig = (newConfig: GameConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Sync player profiles to localStorage
  const handleUpdateProfiles = (newProfiles: PlayerProfile[]) => {
    setProfiles(newProfiles);
    savePlayerProfiles(newProfiles);
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

  // Check Goddess presence for tie-breaker
  const tieGoddessCheck = specialRoleHooks.onVoteTie({
    players: state.players,
    tiedPlayerIds: state.tiedPlayerIds,
    enabledRoles: state.config.enabledSpecialRoles,
  });

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text-main flex flex-col font-sans transition-colors duration-200">
      {/* Universal Header */}
      <Header
        phase={state.phase}
        round={state.round}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenRulebook={() => setIsRulebookOpen(true)}
        onOpenScoreboard={() => setIsScoreboardOpen(true)}
        onResetToLobby={() => dispatch({ type: 'RESET_TO_LOBBY' })}
      />

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
                  score: 0,
                })),
              });
            }}
            onOpenPersonalWords={() => setIsPersonalWordsOpen(true)}
          />
        )}

        {state.phase === 'WORD_REVEAL' && (
          <WordRevealScreen
            player={state.players[state.revealIndex]}
            playerIndex={state.revealIndex}
            totalPlayers={state.players.length}
            isCardRevealed={state.isCardRevealed}
            partnerPlayer={
              state.players[state.revealIndex]?.loverPartnerId
                ? state.players.find(p => p.id === state.players[state.revealIndex].loverPartnerId)
                : null
            }
            onRevealCard={() => dispatch({ type: 'REVEAL_CURRENT_CARD' })}
            onHideAndNext={() => dispatch({ type: 'HIDE_AND_NEXT_CARD' })}
          />
        )}

        {state.phase === 'DESCRIPTION' && (
          <DescriptionScreen
            round={state.round}
            players={state.players}
            speechOrderIds={state.speechOrderIds}
            currentSpeakerIndex={state.currentSpeakerIndex}
            memeCursePlayerId={state.memeCursePlayerId}
            onNextSpeaker={() => dispatch({ type: 'NEXT_SPEAKER' })}
            onStartDiscussion={() => dispatch({ type: 'START_DISCUSSION' })}
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
        hasGoddess={tieGoddessCheck.hasGoddess}
        goddessPlayer={tieGoddessCheck.goddessPlayer}
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
