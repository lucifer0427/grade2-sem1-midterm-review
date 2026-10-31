/**
 * 棒球遊戲音效與語音模組
 * - Web Audio API：即時合成真實棒球打擊聲 (CLANK/CRACK)、揮棒聲、歡呼號角
 * - Web Speech API：球場主播念題與注音朗讀
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

  // 金屬/木棒清脆擊球音效 (Home Run Hit)
  playHitSound(isHomeRun = true) {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 高頻清脆金屬敲擊聲 (White Noise Burst + High Sine)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = isHomeRun ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isHomeRun ? 880 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);

    if (isHomeRun) {
      this.playCheerSound();
    }
  }

  // 揮棒落空破風聲 (Whoosh)
  playMissSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 全壘打歡呼號角三連音
  playCheerSound() {
    if (this.isMuted) return;
    this.init();
    const ctx = this.ctx;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + 0.15 * idx;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.35);
    });
  }

  // 球場主播語音朗讀 (Web Speech API)
  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // 停止上一段話

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.95; // 稍微放慢語速，適配二年級學童聽力
    utterance.pitch = 1.05; // 略帶朝氣的音調
    window.speechSynthesis.speak(utterance);
  }
}

export const soundCtrl = new SoundController();
