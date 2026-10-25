// Web Audio API Procedural Sensory & Atmospheric Soundscape
class SensoryAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private rainGain: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private heartbeatInterval: number | null = null;
  private isRainPlaying: boolean = false;

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

  private playHeartbeatThump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Double lub-dub thump
    [0, 0.12].forEach((offset, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(idx === 0 ? 55 : 45, now + offset);
      osc.frequency.exponentialRampToValueAtTime(20, now + offset + 0.15);

      gain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.25, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.16);
    });
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

  // Authentic Police Radio Squelch & Intercepted Transmission Static
  public playRadioStatic(durationSeconds: number = 2.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // 1. Dual-tone Police Dispatch Alert Beeps (Two-tone paging chime)
      const tone1 = this.ctx.createOscillator();
      const tone2 = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      tone1.type = 'sine';
      tone2.type = 'sine';
      tone1.frequency.setValueAtTime(880, now);
      tone2.frequency.setValueAtTime(1320, now + 0.08);

      toneGain.gain.setValueAtTime(0.25, now);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      tone1.connect(toneGain);
      tone2.connect(toneGain);
      toneGain.connect(this.ctx.destination);

      tone1.start(now);
      tone1.stop(now + 0.08);
      tone2.start(now + 0.08);
      tone2.stop(now + 0.18);

      // 2. Radio Opener Squelch Chirp (Walkie-talkie mic key-in)
      const chirp = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      chirp.type = 'sawtooth';
      chirp.frequency.setValueAtTime(1400, now + 0.12);
      chirp.frequency.exponentialRampToValueAtTime(600, now + 0.22);
      chirpGain.gain.setValueAtTime(0.18, now + 0.12);
      chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      chirp.connect(chirpGain);
      chirpGain.connect(this.ctx.destination);
      chirp.start(now + 0.12);
      chirp.stop(now + 0.23);

      // 3. Radio frequency static & telemetry noise
      const bufferSize = Math.floor(this.ctx.sampleRate * durationSeconds);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Amplitude modulated white noise with 38Hz radio telemetry flutter
        const flutter = 0.65 + 0.35 * Math.sin((i / this.ctx.sampleRate) * 2 * Math.PI * 38);
        data[i] = (Math.random() * 2 - 1) * flutter;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1750, now + 0.18);
      bandpass.Q.setValueAtTime(2.0, now + 0.18);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now + 0.18);
      noiseGain.gain.linearRampToValueAtTime(0.32, now + 0.24);
      noiseGain.gain.setValueAtTime(0.28, now + durationSeconds - 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now + 0.18);
      noise.stop(now + durationSeconds + 0.02);

      // 4. Radio Roger beep at end
      const roger = this.ctx.createOscillator();
      const rogerGain = this.ctx.createGain();
      roger.type = 'sine';
      roger.frequency.setValueAtTime(780, now + durationSeconds - 0.1);
      rogerGain.gain.setValueAtTime(0.2, now + durationSeconds - 0.1);
      rogerGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
      roger.connect(rogerGain);
      rogerGain.connect(this.ctx.destination);
      roger.start(now + durationSeconds - 0.1);
      roger.stop(now + durationSeconds);

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

  // Emergency TV Broadcast Alert Sting (Iconic Breaking News Chime & Urgency Tones)
  public playEmergencyBroadcastSting() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High-urgency alert dual beeps
      [0, 0.22, 0.44].forEach((offset) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now + offset);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });

      // Dramatic deep news crash hit
      const hitOsc = this.ctx.createOscillator();
      const hitGain = this.ctx.createGain();
      hitOsc.type = 'triangle';
      hitOsc.frequency.setValueAtTime(120, now + 0.7);
      hitOsc.frequency.exponentialRampToValueAtTime(35, now + 2.0);
      hitGain.gain.setValueAtTime(0.35, now + 0.7);
      hitGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
      hitOsc.connect(hitGain);
      hitGain.connect(this.ctx.destination);
      hitOsc.start(now + 0.7);
      hitOsc.stop(now + 2.1);

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
    this.playRadioStatic(1.6);

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
