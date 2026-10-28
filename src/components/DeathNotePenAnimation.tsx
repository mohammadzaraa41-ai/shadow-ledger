import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import { RealisticPen } from './RealisticPen';

interface Props {
  name: string;
  onComplete: () => void;
}

function playDramaticPenSFX() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Initial dark impact boom
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.7);
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);

    // 2. Realistic violent pen-scratch friction bursts (nib scratching on paper)
    const strokes = [0.22, 0.55, 0.9, 1.25, 1.6];
    strokes.forEach((st, idx) => {
      const bufferSize = Math.floor(ctx.sampleRate * 0.18);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000 + idx * 400, now + st);
      filter.Q.setValueAtTime(3.5, now + st);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now + st);
      gain.gain.linearRampToValueAtTime(0.8, now + st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + st + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now + st);
      noise.stop(now + st + 0.18);
    });

    // 3. Final fateful heavy stroke
    const endOsc = ctx.createOscillator();
    const endGain = ctx.createGain();
    endOsc.type = 'sawtooth';
    endOsc.frequency.setValueAtTime(90, now + 1.8);
    endOsc.frequency.exponentialRampToValueAtTime(30, now + 2.5);
    endGain.gain.setValueAtTime(0.5, now + 1.8);
    endGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    endOsc.connect(endGain);
    endGain.connect(ctx.destination);
    endOsc.start(now + 1.8);
    endOsc.stop(now + 2.5);
  } catch {
    // AudioContext blocked or unsupported; animation continues silently
  }
}

export function DeathNotePenAnimation({ name, onComplete }: Props) {
  const { lang } = useLang();
  const [phase, setPhase] = useState<'slash1' | 'slash2' | 'slash3' | 'finish'>('slash1');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    playDramaticPenSFX();

    const t1 = setTimeout(() => setPhase('slash2'), 600);
    const t2 = setTimeout(() => setPhase('slash3'), 1500);
    const t3 = setTimeout(() => setPhase('finish'), 2600);
    const t4 = setTimeout(() => onCompleteRef.current(), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []); // Stable lifetime

  return (
    <div className={`dn-cutscene ${phase}`} role="dialog" aria-label="Writing in Shadow Ledger">
      {/* Dynamic speedlines background */}
      <div className="dn-speedlines" />
      <div className="dn-vignette" />

      {/* The notebook paper viewport */}
      <div className="dn-paper">
        <div className="dn-ruled-line" />
        <div className="dn-name-container">
          <span className="dn-carved-name" data-lang={lang}>
            {name}
          </span>
          <span className="dn-ink-splatter sp-1" />
          <span className="dn-ink-splatter sp-2" />
          <span className="dn-ink-splatter sp-3" />
        </div>

        {/* Real Articulated Fountain Pen tracing on the paper */}
        <RealisticPen phase={phase} />
      </div>

      {/* Kanji / gothic lightning flash */}
      <div className="dn-flash" />

      {/* Skip button for player convenience */}
      <button
        className="dn-skip-hint"
        onClick={(e) => {
          e.stopPropagation();
          onCompleteRef.current();
        }}
      >
        ✕ {lang === 'ar' ? 'تخطي' : 'SKIP'}
      </button>
    </div>
  );
}
