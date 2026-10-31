/**
 * 棒球對決主遊戲循環 (Three.js + HTML5 HUD)
 */
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { CURRICULUM_DATA } from './curriculum.js';
import { BaseballField } from './baseballField.js';
import { soundCtrl } from './audio.js';

export class GameEngine {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.strikes = 0;
    this.hits = 0;
    this.totalQuestions = CURRICULUM_DATA.length;
    this.isAnimating = false;

    this.initThree();
    this.field = new BaseballField(this.scene);
    this.setupEvents();
    this.loadQuestion(0);
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // 蔚藍天空
    this.scene.fog = new THREE.Fog(0x87ceeb, 60, 160);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 打者身後越肩視角
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    this.camera.position.set(-1.2, 3.8, 33.5);
    this.camera.lookAt(0, 3.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  loadQuestion(idx) {
    if (idx >= this.totalQuestions) {
      this.showFinalCard();
      return;
    }

    this.currentQuestionIdx = idx;
    const q = CURRICULUM_DATA[idx];

    // 更新 HUD
    document.getElementById('hud-subject').textContent = `【${q.subject}】${q.unit}`;
    document.getElementById('hud-question').textContent = q.question;
    document.getElementById('hud-phonetic').textContent = q.phonetic || '';
    document.getElementById('hud-inning').textContent = `第 ${idx + 1} 局上`;

    // 渲染三個打擊選項按鈕
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const directions = ['左外野', '中外野', '右外野'];
    const keys = ['A', 'S', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'batting-btn';
      btn.innerHTML = `
        <span class="btn-zone">${directions[optIdx]} [${keys[optIdx]}]</span>
        <span class="btn-text">${opt.text}</span>
      `;
      btn.onclick = () => this.handleSwing(opt, optIdx);
      optionsContainer.appendChild(btn);
    });

    // 重設棒球到投手位置
    this.resetBallPosition();

    // 球場主播念題
    soundCtrl.speakText(`${q.subject}，${q.question}`);
  }

  resetBallPosition() {
    this.field.ball.position.set(0, 2.2, 15);
    this.field.batGroup.rotation.z = -Math.PI / 4;
    this.field.batGroup.rotation.y = 0;
  }

  // 學童選擇球路揮棒
  handleSwing(option, zoneIdx) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // 禁用按鈕防連點
    const buttons = document.querySelectorAll('.batting-btn');
    buttons.forEach(b => b.disabled = true);

    // 1. 投手投球飛向本壘
    const ball = this.field.ball;
    const startPos = new THREE.Vector3(0, 2.2, 15);
    const targetOffset = (zoneIdx - 1) * 0.9; // -0.9, 0, 0.9
    const hitPos = new THREE.Vector3(-0.6 + targetOffset, 1.8, 27.5);

    let progress = 0;
    const pitchDuration = 40; // 投球幀數

    const pitchInterval = setInterval(() => {
      progress += 1 / pitchDuration;
      ball.position.lerpVectors(startPos, hitPos, progress);
      ball.rotation.x += 0.3;

      if (progress >= 1) {
        clearInterval(pitchInterval);
        this.executeContact(option, zoneIdx, hitPos);
      }
    }, 16);
  }

  // 擊球瞬間判定
  executeContact(option, zoneIdx, hitPos) {
    // 揮棒動作
    this.field.batGroup.rotation.z = Math.PI / 3;
    this.field.batGroup.rotation.y = -Math.PI / 3;

    if (option.isCorrect) {
      // 答對：擊出全壘打！
      soundCtrl.playHitSound(true);
      this.score += 1;
      this.hits += 1;
      document.getElementById('hud-score').textContent = this.score;

      // 棒球全壘打高飛軌跡 (直飛外野看台)
      this.animateHomeRun(zoneIdx, () => {
        this.showFeedbackModal(true, option.hitResult);
      });

      // 煙火彩帶
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

    } else {
      // 答錯：好球/揮棒落空
      soundCtrl.playMissSound();
      this.strikes += 1;
      document.getElementById('hud-strikes').textContent = 'X '.repeat(this.strikes % 3 || 3);

      setTimeout(() => {
        const currentQ = CURRICULUM_DATA[this.currentQuestionIdx];
        this.showFeedbackModal(false, `${option.hitResult}<br><br>💡 <b>教練提醒</b>：${currentQ.hint}`);
      }, 500);
    }
  }

  // 全壘打飛行拋物線動畫
  animateHomeRun(zoneIdx, onComplete) {
    const ball = this.field.ball;
    const start = ball.position.clone();
    const targetX = (zoneIdx - 1) * 22;
    const dest = new THREE.Vector3(targetX, 18, -45); // 飛過全壘打大牆

    let t = 0;
    const duration = 65;

    const flyInterval = setInterval(() => {
      t += 1 / duration;
      // 貝茲曲線拋物線
      ball.position.x = THREE.MathUtils.lerp(start.x, dest.x, t);
      ball.position.z = THREE.MathUtils.lerp(start.z, dest.z, t);
      ball.position.y = start.y + Math.sin(t * Math.PI) * 22 + (dest.y - start.y) * t;

      if (t >= 1) {
        clearInterval(flyInterval);
        onComplete();
      }
    }, 16);
  }

  // 結果反饋彈窗
  showFeedbackModal(isSuccess, messageHtml) {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    title.textContent = isSuccess ? '💥 全壘打 HOME RUN！' : '⚡ STRIKE！好球揮空';
    title.style.color = isSuccess ? '#eab308' : '#ef4444';
    msg.innerHTML = messageHtml;
    modal.classList.remove('hidden');

    // 念出結果
    soundCtrl.speakText(isSuccess ? '全壘打！' : '揮空！');
  }

  // 下一題
  nextQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    this.isAnimating = false;
    this.loadQuestion(this.currentQuestionIdx + 1);
  }

  // 結算 MVP 卡片
  showFinalCard() {
    const modal = document.getElementById('final-modal');
    const avg = ((this.hits / this.totalQuestions)).toFixed(3).replace('0.', '.');
    document.getElementById('final-avg').textContent = avg;
    document.getElementById('final-hr').textContent = this.hits;
    document.getElementById('final-score').textContent = this.score;

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });

    modal.classList.remove('hidden');
    soundCtrl.speakText(`比賽結束！恭喜你打出 ${this.hits} 支全壘打，成為期中考 MVP！`);
  }

  setupEvents() {
    // 朗讀按鈕
    document.getElementById('btn-speak').onclick = () => {
      const q = CURRICULUM_DATA[this.currentQuestionIdx];
      soundCtrl.speakText(`${q.subject}，${q.question}`);
    };

    // 靜音按鈕
    const muteBtn = document.getElementById('btn-mute');
    muteBtn.onclick = () => {
      soundCtrl.isMuted = !soundCtrl.isMuted;
      muteBtn.textContent = soundCtrl.isMuted ? '🔇 靜音中' : '🔊 音效開';
    };

    // 下一題按鈕
    document.getElementById('btn-next').onclick = () => this.nextQuestion();

    // 重新開始
    document.getElementById('btn-restart').onclick = () => {
      location.reload();
    };

    // 鍵盤快捷鍵 A/S/D
    window.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      const key = e.key.toUpperCase();
      const q = CURRICULUM_DATA[this.currentQuestionIdx];
      if (!q) return;

      if (key === 'A' && q.options[0]) this.handleSwing(q.options[0], 0);
      if (key === 'S' && q.options[1]) this.handleSwing(q.options[1], 1);
      if (key === 'D' && q.options[2]) this.handleSwing(q.options[2], 2);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
