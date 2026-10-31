/**
 * 實況棒球音效與播報系統 (Web Audio API 合成器 + Web Speech API)
 * 包含：球棒擊球爆音、九宮格擊碎聲、球場風琴應援曲、觀眾歡呼聲、裁判播報
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 投手投球破風聲
  playPitchSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  // 清脆擊球聲 + 全壘打歡呼
  playHitSound(isHomeRun = true) {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. 球棒清脆撞擊聲 (Crack/Clank)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isHomeRun ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(isHomeRun ? 1100 : 650, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

    // 2. 白噪音爆發模擬球皮擠壓聲
    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noise.buffer = buffer;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    if (isHomeRun) {
      this.playOrganCharge();
    }
  }

  // 揮棒落空或好球三振聲
  playMissSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const notes = [320, 220, 140];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + i * 0.09;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  // 棒球場經典風琴應援號角 (Charge Fanfare: G4-C5-E5-G5-E5-G5)
  playOrganCharge() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const melody = [
      { f: 392.00, d: 0.12, t: 0.10 }, // G4
      { f: 523.25, d: 0.12, t: 0.22 }, // C5
      { f: 659.25, d: 0.12, t: 0.34 }, // E5
      { f: 783.99, d: 0.22, t: 0.46 }, // G5
      { f: 659.25, d: 0.12, t: 0.70 }, // E5
      { f: 783.99, d: 0.45, t: 0.84 }  // G5!
    ];

    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + note.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.d + 0.02);
    });
  }

  // 球場主播語音朗讀 (Web Speech API)
  speakText(text) {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.98;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundCtrl = new SoundController();
