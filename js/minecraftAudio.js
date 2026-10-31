/**
 * 麥塊方塊冒險版：音效合成器與語音朗讀系統 (Web Audio API + Web Speech API)
 * 合成：方塊敲擊挖掘聲、礦石碎裂聲、經驗球叮咚聲 (XP Orb)、苦力怕嘶嘶聲、TNT 爆炸聲、鐵砧鍛造聲
 */

class MinecraftSoundController {
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

  // 揮鎬挖掘方塊敲擊聲 (Stone / Ore Hit)
  playDigSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    for (let i = 0; i < 2; i++) {
      const t = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(240 + i * 90, t);
      osc.frequency.exponentialRampToValueAtTime(95, t + 0.06);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);
    }
  }

  // 成功挖破礦石 + 經驗球叮咚聲 (XP Orb Chime + Crit Blast)
  playMineSuccessSound(isCrit = true) {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. 方塊脆裂爆音
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.035));
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, now);
    noise.buffer = buffer;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. 經典經驗球高音清脆叮咚聲 (XP Orbs)
    const xpNotes = isCrit
      ? [587.33, 659.25, 783.99, 987.77, 1174.66, 1318.51]
      : [587.33, 783.99, 1046.5];

    xpNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + 0.06 + idx * 0.065;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.32, start);
      gain.gain.exponentialRampToValueAtTime(0.008, start + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.17);
    });
  }

  // 苦力怕嘶嘶警告聲 (第一次答錯啟動村民引導)
  playCreeperHiss() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.38);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.22));
    }

    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    noise.buffer = buffer;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  // 苦力怕 / TNT 爆炸低音轟鳴 (第二次答錯扣血)
  playExplosionSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.42);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.44);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 鐵砧鍛造／升級號角聲
  playAnvilLevelUp() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const melody = [
      { f: 523.25, d: 0.12, t: 0.0 },
      { f: 659.25, d: 0.12, t: 0.11 },
      { f: 783.99, d: 0.14, t: 0.22 },
      { f: 1046.50, d: 0.35, t: 0.35 }
    ];
    melody.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + n.t;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);
      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + n.d + 0.02);
    });
  }

  speakText(text) {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.98;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const mcSound = new MinecraftSoundController();
