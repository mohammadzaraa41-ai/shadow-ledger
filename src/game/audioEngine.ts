// Web Audio API Procedural Sensory & Atmospheric Soundscape
class SensoryAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private heartbeatInterval: number | null = null;
  private isRainPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.initCtx();
        ['touchstart', 'touchend', 'pointerdown', 'keydown'].forEach((e) =>
          window.removeEventListener(e, unlockAudio)
        );
      };
      ['touchstart', 'touchend', 'pointerdown', 'keydown'].forEach((e) =>
        window.addEventListener(e, unlockAudio, { passive: true, once: true })
      );
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopRain();
      this.stopHeartbeat();
    } else {
      this.startRain();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Atmospheric rain falling on window glass
  public startRain() {
    if (this.isMuted || this.isRainPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(800, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(150, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      noise.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(this.rainGain);
      this.rainGain.connect(this.ctx.destination);

      noise.start();
      this.rainSource = noise;
      this.isRainPlaying = true;
    } catch {
      // AudioContext may be blocked before interaction
    }
  }

  public stopRain() {
    if (this.rainGain) {
      try {
        const now = this.ctx?.currentTime ?? 0;
        this.rainGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
      } catch {}
    }
    if (this.rainSource) {
      try {
        const stopTime = (this.ctx?.currentTime ?? 0) + 0.35;
        this.rainSource.stop(stopTime);
        setTimeout(() => {
          try {
            this.rainSource?.disconnect();
          } catch {}
          this.rainSource = null;
        }, 400);
      } catch {
        this.rainSource = null;
      }
    }
    this.rainGain = null;
    this.isRainPlaying = false;
  }

  // Thunder rumble lighting up the room
  public playThunder() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 1.8);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  // Heartbeat tension effect
  public startHeartbeat(bpm: number = 72) {
    if (this.isMuted || this.heartbeatInterval) return;
    this.initCtx();

    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeatThump();
    this.heartbeatInterval = window.setInterval(() => {
      this.playHeartbeatThump();
    }, intervalMs);
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Acoustic mobile heartbeat with psychoacoustic harmonics for phone speakers
  private playHeartbeatThump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // Realistic physiological Lub-Dub timing
      // Beat 1: S1 "Lub" (lower pitch, warm body, softer)
      // Beat 2: S2 "Dub" (sharper, punchier aortic snap)
      const beats = [
        { offset: 0.0, baseFreq: 110, harmonicFreq: 165, gainVal: 0.35, duration: 0.14 },
        { offset: 0.14, baseFreq: 135, harmonicFreq: 210, gainVal: 0.44, duration: 0.16 },
      ];

      beats.forEach(({ offset, baseFreq, harmonicFreq, gainVal, duration }, bIdx) => {
        if (!this.ctx) return;
        const tStart = now + offset;

        // 1. Resonant Chest Cavity Carrier (Warm Sine)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, tStart);
        osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, tStart + duration);

        // Smooth 12ms attack prevents speaker pops/clicks on mobile
        gain1.gain.setValueAtTime(0.001, tStart);
        gain1.gain.linearRampToValueAtTime(gainVal, tStart + 0.012);
        gain1.gain.exponentialRampToValueAtTime(0.001, tStart + duration);

        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(tStart);
        osc1.stop(tStart + duration + 0.01);

        // 2. Audible Phone Speaker Harmonic (Overtone so tiny mobile speakers resonate cleanly)
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(harmonicFreq, tStart);
        osc2.frequency.exponentialRampToValueAtTime(harmonicFreq * 0.7, tStart + duration * 0.8);

        gain2.gain.setValueAtTime(0.001, tStart);
        gain2.gain.linearRampToValueAtTime(gainVal * 0.28, tStart + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.001, tStart + duration * 0.85);

        // Lowpass filter to keep it organic and deep
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, tStart);

        osc2.connect(filter);
        filter.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(tStart);
        osc2.stop(tStart + duration + 0.01);

        // Mobile haptic vibration synchronous with cardiac thumps
        if (bIdx === 0) {
          hapticEngine.trigger('tap');
        } else {
          setTimeout(() => hapticEngine.trigger('tension'), 130);
        }
      });
    } catch {}
  }

  // Distant police sirens when suspicion > 70%
  public playPoliceSiren() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.linearRampToValueAtTime(900, now + 0.8);
    osc.frequency.linearRampToValueAtTime(650, now + 1.6);
    osc.frequency.linearRampToValueAtTime(900, now + 2.4);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 3.0);
  }

  // Authentic Steam Achievement Chime
  public playSteamChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chime
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  // Terminal keystroke
  public playKeystroke() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Authentic paper-scratching friction burst for individual letters (Death Note Type style)
  public playLetterScratch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200 + Math.random() * 600, now);
      filter.Q.setValueAtTime(3.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.09);

      // Mobile tactile feedback on every written character
      hapticEngine.trigger('scratch');
    } catch {}
  }

  // Tactical Encrypted Transmission Squelch (Subtle & clean, non-piercing)
  public playRadioStatic(durationSeconds: number = 0.35) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // 1. Gentle Walkie-talkie Key-in Chirp (Subtle, professional)
      const chirp = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      chirp.type = 'sine';
      chirp.frequency.setValueAtTime(1100, now);
      chirp.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      chirpGain.gain.setValueAtTime(0.001, now);
      chirpGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      chirp.connect(chirpGain);
      chirpGain.connect(this.ctx.destination);
      chirp.start(now);
      chirp.stop(now + 0.1);

      // 2. Soft, filtered tactical radio burst (very low volume, no harsh clipping)
      const actualDur = Math.min(0.45, durationSeconds);
      const bufferSize = Math.floor(this.ctx.sampleRate * actualDur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, now + 0.04);
      bandpass.Q.setValueAtTime(2.5, now + 0.04);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now + 0.04);
      noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.08);
      noiseGain.gain.setValueAtTime(0.04, now + actualDur - 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + actualDur);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now + 0.04);
      noise.stop(now + actualDur + 0.01);

      // 3. Subtle micro-roger blip at the end
      const roger = this.ctx.createOscillator();
      const rogerGain = this.ctx.createGain();
      roger.type = 'sine';
      roger.frequency.setValueAtTime(920, now + actualDur);
      rogerGain.gain.setValueAtTime(0.001, now + actualDur);
      rogerGain.gain.linearRampToValueAtTime(0.05, now + actualDur + 0.01);
      rogerGain.gain.exponentialRampToValueAtTime(0.001, now + actualDur + 0.05);

      roger.connect(rogerGain);
      rogerGain.connect(this.ctx.destination);
      roger.start(now + actualDur);
      roger.stop(now + actualDur + 0.06);

      hapticEngine.trigger('tap');
    } catch {}
  }

  // CCTV camera feed switch click and CRT hum
  public playCctvSwitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Camera shutter flash sound for breaking news tabloid
  public playCameraFlash() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Mechanical shutter click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);

      // Flash capacitor recharge whine
      const whine = this.ctx.createOscillator();
      const whineGain = this.ctx.createGain();
      whine.type = 'sine';
      whine.frequency.setValueAtTime(2200, now + 0.06);
      whine.frequency.linearRampToValueAtTime(4500, now + 0.4);
      whineGain.gain.setValueAtTime(0.001, now + 0.06);
      whineGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      whineGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      whine.connect(whineGain);
      whineGain.connect(this.ctx.destination);
      whine.start(now + 0.06);
      whine.stop(now + 0.46);
    } catch {}
  }

  // Shinigami Eye Deal: supernatural dark presence, eerie tritone drone & heavy heartbeat
  public playShinigamiDeal() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Devil's interval (tritone) ominous supernatural hum
      [55, 77.78, 110, 155.56].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 3.0);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 3.1);
      });
      this.playHeartbeatThump();
      hapticEngine.trigger('fatal');
    } catch {}
  }

  // Cinematic TV Emergency Broadcast Sting (Authentic Japanese Breaking News Chime & Orchestral Gong)
  public playEmergencyBroadcastSting() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // 1. Iconic 3-Note Japanese Television Emergency Chime (D5 -> G5 -> B5)
      const chimeNotes = [
        { freq: 587.33, offset: 0.00 }, // D5
        { freq: 783.99, offset: 0.18 }, // G5
        { freq: 987.77, offset: 0.36 }, // B5
      ];

      chimeNotes.forEach(({ freq, offset }) => {
        if (!this.ctx) return;
        const tStart = now + offset;

        // Primary bell tone
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, tStart);

        gain.gain.setValueAtTime(0.001, tStart);
        gain.gain.linearRampToValueAtTime(0.25, tStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, tStart + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(tStart);
        osc.stop(tStart + 0.48);

        // Harmonic shimmer overtone
        const oscH = this.ctx.createOscillator();
        const gainH = this.ctx.createGain();
        oscH.type = 'triangle';
        oscH.frequency.setValueAtTime(freq * 2.0, tStart);

        gainH.gain.setValueAtTime(0.001, tStart);
        gainH.gain.linearRampToValueAtTime(0.08, tStart + 0.01);
        gainH.gain.exponentialRampToValueAtTime(0.001, tStart + 0.35);

        oscH.connect(gainH);
        gainH.connect(this.ctx.destination);
        oscH.start(tStart);
        oscH.stop(tStart + 0.38);
      });

      // 2. Ominous Orchestral Brass Impact & Low Gong Strike (Audible on mobile phones)
      const hitStart = now + 0.55;
      const gongBody = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();
      gongBody.type = 'sawtooth';
      gongBody.frequency.setValueAtTime(160, hitStart);
      gongBody.frequency.exponentialRampToValueAtTime(75, hitStart + 1.8);

      const gongFilter = this.ctx.createBiquadFilter();
      gongFilter.type = 'lowpass';
      gongFilter.frequency.setValueAtTime(450, hitStart);
      gongFilter.frequency.exponentialRampToValueAtTime(110, hitStart + 1.8);

      gongGain.gain.setValueAtTime(0.001, hitStart);
      gongGain.gain.linearRampToValueAtTime(0.38, hitStart + 0.02);
      gongGain.gain.exponentialRampToValueAtTime(0.001, hitStart + 2.0);

      gongBody.connect(gongFilter);
      gongFilter.connect(gongGain);
      gongGain.connect(this.ctx.destination);

      gongBody.start(hitStart);
      gongBody.stop(hitStart + 2.1);

      // 3. Subtle Urgent Broadcast Tone Pair (1046Hz & 1318Hz, gentle volume)
      [1046.5, 1318.5].forEach((freq) => {
        if (!this.ctx) return;
        const alertOsc = this.ctx.createOscillator();
        const alertGain = this.ctx.createGain();
        alertOsc.type = 'sine';
        alertOsc.frequency.setValueAtTime(freq, hitStart + 0.2);

        alertGain.gain.setValueAtTime(0.001, hitStart + 0.2);
        alertGain.gain.linearRampToValueAtTime(0.06, hitStart + 0.25);
        alertGain.gain.exponentialRampToValueAtTime(0.001, hitStart + 1.2);

        alertOsc.connect(alertGain);
        alertGain.connect(this.ctx.destination);
        alertOsc.start(hitStart + 0.2);
        alertOsc.stop(hitStart + 1.25);
      });

      hapticEngine.trigger('tension');
    } catch {}
  }

  // Pocketwatch mechanical tick for delayed executions & countdowns
  public playClockTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
      hapticEngine.trigger('tap');
    } catch {}
  }

  // Iconic L Voice Scrambler (Voice Disguiser & Walkie-Talkie Speech)
  public playScrambledVoice(phraseText?: string) {
    if (this.isMuted) return;
    this.initCtx();

    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && phraseText) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(phraseText);
        utter.pitch = 0.55; // Deep robotic voice scrambler
        utter.rate = 0.9;
        utter.volume = 0.85;
        // Try Arabic or English voice
        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
        if (arabicVoice && /[\u0600-\u06FF]/.test(phraseText)) {
          utter.voice = arabicVoice;
        }
        window.speechSynthesis.speak(utter);
      }
    } catch {}
  }
}

// Mobile Tactile Haptic Engine (Juice & Game Feel)
export const hapticEngine = {
  trigger(type: 'tap' | 'scratch' | 'tension' | 'fatal') {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'scratch':
            navigator.vibrate(10);
            break;
          case 'tap':
            navigator.vibrate(18);
            break;
          case 'tension':
            navigator.vibrate([30, 40, 30]);
            break;
          case 'fatal':
            navigator.vibrate([70, 45, 120, 60, 200]);
            break;
        }
      } catch {}
    }
  },
};

export const sensoryAudio = new SensoryAudioEngine();
