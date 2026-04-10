/**
 * Audio Service for Crimson Relics
 * This service handles 8-bit retro sound effects using Web Audio API.
 */

export type SoundEffect = 
  | 'match' 
  | 'swap' 
  | 'invalid' 
  | 'bomb' 
  | 'arrow' 
  | 'chaos' 
  | 'hammer' 
  | 'levelWin' 
  | 'levelFail' 
  | 'click' 
  | 'buy'
  | 'lightning'
  | 'bubble'
  | 'ghost';

class AudioService {
  private isMuted: boolean = false;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private volume: number = 0.2;
  private audioContext: AudioContext | null = null;
  private musicInterval: NodeJS.Timeout | null = null;

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    } else {
      this.playMusic('main');
    }
  }

  setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = volume;
  }

  private createNoiseBuffer() {
    if (!this.audioContext) return null;
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  playSound(effect: SoundEffect) {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    switch (effect) {
      case 'click':
      case 'match': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(effect === 'click' ? 440 : 880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(effect === 'click' ? 110 : 440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        break;
      }

      case 'swap': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        break;
      }

      case 'invalid': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
      }

      case 'bomb': {
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start();
        noise.stop(ctx.currentTime + 0.5);
        break;
      }

      case 'lightning': {
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(5000, ctx.currentTime);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start();
        noise.stop(ctx.currentTime + 0.3);
        break;
      }

      case 'bubble': {
        for (let i = 0; i < 3; i++) {
          const t = ctx.currentTime + i * 0.05;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400 + Math.random() * 400, t);
          osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 400, t + 0.05);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.05);
        }
        break;
      }

      case 'ghost': {
        const noise = ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        filter.frequency.linearRampToValueAtTime(3000, ctx.currentTime + 0.5);
        filter.Q.setValueAtTime(10, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        noise.start();
        noise.stop(ctx.currentTime + 0.5);
        break;
      }

      case 'buy':
      case 'levelWin': {
        const notes = effect === 'buy' ? [523.25, 659.25, 783.99] : [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const t = ctx.currentTime + i * 0.1;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.15);
        });
        break;
      }

      case 'levelFail': {
        const notes = [440, 349.23, 293.66, 220];
        notes.forEach((freq, i) => {
          const t = ctx.currentTime + i * 0.15;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(t);
          osc.stop(t + 0.2);
        });
        break;
      }
    }
  }

  playMusic(_track: string) {
    if (this.isMuted || !this.musicEnabled) return;
    this.initAudioContext();
    if (!this.audioContext) return;
    if (this.musicInterval) return;

    const ctx = this.audioContext;
    const playNote = (freq: number, time: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.05, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    const melody = [
      130.81, 155.56, 196.00, 155.56, // C3, Eb3, G3, Eb3
      130.81, 155.56, 196.00, 155.56,
      123.47, 146.83, 185.00, 146.83, // B2, D3, Gb3, D3
      123.47, 146.83, 185.00, 146.83
    ];

    let step = 0;
    const scheduleNext = () => {
      const now = ctx.currentTime;
      for (let i = 0; i < 8; i++) {
        const note = melody[(step + i) % melody.length];
        playNote(note, now + i * 0.25, 0.2);
      }
      step += 8;
    };

    scheduleNext();
    this.musicInterval = setInterval(scheduleNext, 2000);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioService = new AudioService();
