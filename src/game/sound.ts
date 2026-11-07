/** Tiny WebAudio sound kit: no audio files, works offline. */
let ctx: AudioContext | null = null;
let muted = localStorage.getItem('muted') === '1';

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18, slideTo?: number) {
  if (muted) return; // never spin up an AudioContext for a muted user
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function vib(pattern: number | number[]) {
  if (muted) return;
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // ignore on platforms without vibration API
  }
}

export const sound = {
  isMuted: () => muted,
  toggleMute(): boolean {
    muted = !muted;
    localStorage.setItem('muted', muted ? '1' : '0');
    return muted;
  },
  haptic: (pattern: number | number[] = 18) => vib(pattern),
  tap: () => {
    vib(10);
    tone(620, 0, 0.07, 'triangle', 0.12);
  },
  flip: () => {
    vib([18, 30, 18]);
    tone(300, 0, 0.1, 'square', 0.08, 700);
    tone(900, 0.08, 0.12, 'triangle', 0.1);
  },
  tick: () => {
    vib(12);
    tone(1000, 0, 0.05, 'square', 0.07);
  },
  chaos: () => {
    vib([35, 40, 50]);
    tone(220, 0, 0.18, 'sawtooth', 0.1, 440);
    tone(440, 0.16, 0.22, 'sawtooth', 0.1, 220);
  },
  drumroll: () => {
    vib([20, 50, 20, 50, 30]);
    for (let i = 0; i < 14; i++) tone(120 + i * 6, i * 0.07, 0.06, 'triangle', 0.1);
  },
  win: () => {
    vib([25, 40, 60]);
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.2, 'triangle', 0.16));
  },
  lose: () => {
    vib([60, 50, 90]);
    tone(392, 0, 0.2, 'sawtooth', 0.12);
    tone(330, 0.2, 0.2, 'sawtooth', 0.12);
    tone(262, 0.4, 0.4, 'sawtooth', 0.12);
  },
};

