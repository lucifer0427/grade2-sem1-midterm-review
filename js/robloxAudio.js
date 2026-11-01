/**
 * 國小二年級期中考：Roblox 跑酷專屬 Web Audio 合成音效引擎 (RobloxSoundController)
 * 特色：
 * 1. 經典「OOF!」跌倒滑音 (Dual Oscillator 280Hz -> 130Hz Triangle Wave)
 * 2. 重力彈簧金屬回音 (Coil Boing Vibrato)
 * 3. Checkpoint 登記與雷射解除雙琶音
 * 4. 國語二上語音朗讀支援 (SpeechSynthesis zh-TW)
 */
export class RobloxSoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    try {
      this.isMuted = localStorage.getItem('g2_roblox_muted') === 'true';
    } catch {
      // 忽略無痕模式存取限制
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('g2_roblox_muted', String(this.isMuted));
    } catch {
      // 忽略無痕模式
    }
    return this.isMuted;
  }

  // 1. 經典 Roblox「OOF!」跌倒音效
  playOofSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // 經典 OOF! 由略帶厚度的三角波與正弦波降頻滑音構成
    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(290, t);
    osc1.frequency.exponentialRampToValueAtTime(125, t + 0.16);

    osc2.frequency.setValueAtTime(260, t);
    osc2.frequency.exponentialRampToValueAtTime(110, t + 0.16);

    gain.gain.setValueAtTime(0.55, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.19);
    osc2.stop(t + 0.19);
  }

  // 2. 黃金重力彈簧大跳躍聲 (Gravity Coil Boing)
  playCoilBoingSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.28);

    // LFO 顫音營造金屬彈簧嗡嗡回彈手感
    mod.type = 'sine';
    mod.frequency.setValueAtTime(24, t);
    modGain.gain.setValueAtTime(60, t);
    modGain.gain.exponentialRampToValueAtTime(5, t + 0.28);

    mod.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.32);

    mod.start(t);
    osc.start(t);
    mod.stop(t + 0.33);
    osc.stop(t + 0.33);
  }

  // 3. 踩上 Checkpoint 亮燈與雷射解鎖聲 (明亮琶音)
  playCheckpointSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.005, t + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.2);
    });
  }

  // 4. 雷射警戒蜂鳴聲 (答錯或逼近障礙)
  playLaserBuzzSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.setValueAtTime(180, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.24);
  }

  // 5. 終點登頂 Bloxy 傳奇勝利號角 (Victory Fanfare)
  playVictoryFanfare() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.35 },
      { f: 587.33, d: 0.15 },
      { f: 783.99, d: 0.45 }
    ];

    let offset = 0;
    melody.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + offset);

      gain.gain.setValueAtTime(0.35, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.01, t + offset + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + n.d);
      offset += n.d * 0.95;
    });
  }

  // 6. UI 按鍵輕脆點擊聲
  playClickSound() {
    if (this.isMuted) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // 7. 語音朗讀合成 (Web Speech API 支援小二題目與觀念解析)
  speakText(text) {
    if (this.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = String(text)
      .replace(/\[|\]/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/❓|👉|💡|✅|❌/g, '');

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.95; // 稍慢符合小二聆聽
    utterance.pitch = 1.08;

    const voices = window.speechSynthesis.getVoices();
    const twVoice = voices.find(v => v.lang.includes('zh-TW') || v.lang.includes('TW'));
    if (twVoice) utterance.voice = twVoice;

    window.speechSynthesis.speak(utterance);
  }
}

export const robloxSound = new RobloxSoundController();
