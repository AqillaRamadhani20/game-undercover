import React from 'react';
import { Volume2, VolumeX, Moon, Sun, BookOpen, Trophy, LogOut } from 'lucide-react';
import { soundEffects } from '../../utils/audio';
import type { GamePhase } from '../../types/game';

interface HeaderProps {
  phase: GamePhase;
  round: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenRulebook: () => void;
  onOpenScoreboard: () => void;
  onResetToLobby?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  phase,
  round,
  isDark,
  onToggleTheme,
  onOpenRulebook,
  onOpenScoreboard,
  onResetToLobby,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundEffects.getMuted());

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEffects.playClick();
  };

  const isInGame = phase !== 'LOBBY';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-theme-border bg-theme-bg/90 backdrop-blur-md transition-colors">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Status */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-chameleon-emerald/15 border border-chameleon-emerald/30 flex items-center justify-center text-lg select-none">
            🦎
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-theme-text-main flex items-center gap-1.5">
              <span>Undercover</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-chameleon-emerald/20 text-chameleon-emerald font-bold tracking-normal uppercase">
                Offline 1 HP
              </span>
            </h1>
            {isInGame && (
              <p className="text-[11px] font-semibold text-chameleon-sky">
                Ronde {round} • {getPhaseLabel(phase)}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-card-subtle transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-chameleon-rose" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Dark/Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Ubah Tema"
            className="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-card-subtle transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Scoreboard */}
          <button
            onClick={onOpenScoreboard}
            aria-label="Papan Skor"
            className="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-card-subtle transition"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
          </button>

          {/* Rulebook */}
          <button
            onClick={onOpenRulebook}
            aria-label="Panduan Bermain"
            className="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-main hover:bg-theme-bg-card-subtle transition"
          >
            <BookOpen className="w-4 h-4 text-chameleon-sky" />
          </button>

          {/* End Game / Lobby Exit if in game */}
          {isInGame && onResetToLobby && (
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin kembali ke Lobby dan mengakhiri permainan ini?')) {
                  soundEffects.playClick();
                  onResetToLobby();
                }
              }}
              title="Kembali ke Lobby"
              aria-label="Kembali ke Lobby"
              className="p-2 ml-1 rounded-xl text-chameleon-rose hover:bg-chameleon-rose/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

function getPhaseLabel(phase: GamePhase): string {
  switch (phase) {
    case 'WORD_REVEAL': return 'Bagi Kata';
    case 'DESCRIPTION': return 'Giliran Bicara';
    case 'DISCUSSION': return 'Diskusi';
    case 'VOTING': return 'Voting';
    case 'TIE_BREAKER': return 'Seri';
    case 'MR_WHITE_GUESS': return 'Tebakan Mr. White';
    case 'REVENGER_REVENGE': return 'Balas Dendam';
    case 'ROUND_RESULT': return 'Hasil';
    case 'GAME_OVER': return 'Selesai';
    default: return '';
  }
}
