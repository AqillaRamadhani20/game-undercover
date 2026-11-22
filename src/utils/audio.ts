// Web Audio API synthesizer for offline, zero-dependency tactile sound effects & ambient backsound

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    try {
      const storedMute = localStorage.getItem('undercover_sound_muted');
      if (storedMute !== null) {
        this.isMuted = JSON.parse(storedMute);
      }
      const storedBgm = localStorage.getItem('undercover_bgm_enabled');
      if (storedBgm !== null) {
        this.isBgmPlaying = JSON.parse(storedBgm);
      }
    } catch {
      this.isMuted = false;
      this.isBgmPlaying = false;
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('undercover_sound_muted', JSON.stringify(this.isMuted));
    } catch (e) {
      console.error(e);
    }
    if (this.isMuted && this.isBgmPlaying) {
      this.stopBgm();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getSfx(): boolean {
    return !this.isMuted;
  }

  public toggleSfx(): boolean {
    return !this.toggleMute();
  }

  public getBgm(): boolean {
    return this.isBgmPlaying;
  }

  public toggleBgm(): boolean {
    this.initContext();
    this.isBgmPlaying = !this.isBgmPlaying;
    try {
      localStorage.setItem('undercover_bgm_enabled', JSON.stringify(this.isBgmPlaying));
    } catch (e) {
      console.error(e);
    }

    if (this.isBgmPlaying) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.isBgmPlaying;
  }

  /**
   * Ultra-satisfying tactile bubble pop (Switch / iOS keyboard feel)
   */
  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Satisfying mechanical click / tap
   */
  public playClick() {
    this.playPop();
  }

  /**
   * Satisfying card flip / whoosh sound
   */
  public playCardFlip() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Resonant pop + ascending whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Clear musical selection chime
   */
  public playSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playTimerTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Dramatic elimination impact
   */
  public playElimination() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [160, 200, 240].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.55);

      gain.gain.setValueAtTime(0.18, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + 0.55);
    });
  }

  /**
   * Rewarding major triad fanfare
   */
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.16, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
  }

  /**
   * Procedural Lo-Fi Ambient Backsound (Chords loop)
   */
  public startBgm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopBgm();

    const chords = [
      [261.63, 329.63, 392.00], // C maj
      [220.00, 261.63, 329.63], // A min
      [174.61, 220.00, 261.63], // F maj
      [196.00, 246.94, 293.66], // G maj
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;
      const now = this.ctx.currentTime;
      const currentNotes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      const duration = 2.8;

      currentNotes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        // Soft, gentle envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.022, now + 0.6);
        gain.gain.linearRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    };

    playNextChord();
    this.bgmTimer = setInterval(playNextChord, 2800);
  }

  public stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundEffects = new SoundManager();

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'double' = 'light') {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate(35);
      else if (type === 'heavy') navigator.vibrate(70);
      else if (type === 'double') navigator.vibrate([25, 25, 25]);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }
}
