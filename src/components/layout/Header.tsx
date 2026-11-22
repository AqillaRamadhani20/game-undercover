import React from 'react';
import { Volume2, VolumeX, BookOpen, Trophy, LogOut, RefreshCw, Music } from 'lucide-react';
import { soundEffects } from '../../utils/audio';
import type { GamePhase } from '../../types/game';

interface HeaderProps {
  phase: GamePhase;
  round: number;
  onOpenRulebook: () => void;
  onOpenScoreboard: () => void;
  onResetToLobby?: () => void;
  onRerollWords?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  phase,
  round,
  onOpenRulebook,
  onOpenScoreboard,
  onResetToLobby,
  onRerollWords,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundEffects.getMuted());
  const [isBgm, setIsBgm] = React.useState(soundEffects.getBgm());

  const handleToggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEffects.playPop();
  };

  const handleToggleBgm = () => {
    const active = soundEffects.toggleBgm();
    setIsBgm(active);
    soundEffects.playPop();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900 shadow-sm">
      <div className="max-w-md mx-auto px-4 h-13 flex items-center justify-between">
        {/* Brand & Round Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-sky-400 select-none font-heading">
            UC
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-white flex items-center gap-1.5 font-heading">
              <span>Undercover</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-600/30 text-sky-300 font-extrabold uppercase">
                Ronde {round}
              </span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400">
              {getPhaseLabel(phase)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Lo-fi BGM toggle */}
          <button
            type="button"
            onClick={handleToggleBgm}
            title={isBgm ? 'Matikan BGM' : 'Putar Musik Latar Lofi'}
            aria-label="Toggle BGM"
            className={`p-2 rounded-xl transition btn-tactile ${
              isBgm ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-2 rounded-xl text-slate-400 hover:text-white btn-tactile"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
          </button>

          {/* Scoreboard */}
          <button
            type="button"
            onClick={onOpenScoreboard}
            aria-label="Papan Skor"
            className="p-2 rounded-xl text-slate-400 hover:text-white btn-tactile"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
          </button>

          {/* Rulebook */}
          <button
            type="button"
            onClick={onOpenRulebook}
            aria-label="Panduan Bermain"
            className="p-2 rounded-xl text-slate-400 hover:text-white btn-tactile"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
          </button>

          {/* Reroll Words */}
          {onRerollWords && (phase === 'VOTING' || phase === 'DESCRIPTION') && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Acak ulang kata rahasia baru? Pembagian kartu akan diulang dari pemain 1.')) {
                  soundEffects.playCardFlip();
                  onRerollWords();
                }
              }}
              title="Pilih Ulang Kata"
              aria-label="Pilih Ulang Kata"
              className="p-2 rounded-xl text-amber-400 hover:text-amber-300 btn-tactile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* End Game / Lobby Exit */}
          {onResetToLobby && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin kembali ke Lobby dan mengakhiri permainan ini?')) {
                  soundEffects.playPop();
                  onResetToLobby();
                }
              }}
              title="Kembali ke Lobby"
              aria-label="Kembali ke Lobby"
              className="p-2 ml-0.5 rounded-xl text-rose-400 hover:bg-rose-500/20 btn-tactile"
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
    case 'VOTING': return 'Voting Eliminasi';
    case 'TIE_BREAKER': return 'Voting Seri';
    case 'MR_WHITE_GUESS': return 'Tebakan Mr. White';
    case 'REVENGER_REVENGE': return 'Balas Dendam';
    case 'ROUND_RESULT': return 'Hasil Ronde';
    case 'GAME_OVER': return 'Permainan Selesai';
    default: return '';
  }
}
