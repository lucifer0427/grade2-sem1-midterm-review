/**
 * 次世代 3D 實況滿貫王：主遊戲引擎 (Three.js + 動態追球運鏡 + 壘包推進 + 錯題牛棚特訓)
 */
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { getGameQuestions, shuffleArray } from './curriculum.js';
import { BaseballField } from './baseballField.js';
import { soundCtrl } from './audio.js';

const PITCH_TYPES = [
  { name: '🔥 152km 火焰直球', speed: 32, curve: 0 },
  { name: '⚡ 138km 閃電滑球', speed: 38, curve: 1.4 },
  { name: '🌈 118km 彩虹曲球', speed: 44, curve: -1.3 },
  { name: '👑 160km 魔球指叉', speed: 28, curve: 0.7 }
];

export class GameEngine {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentMode = 'all'; // 'all' | 'chinese' | 'math' | 'wrong'
    this.questions = [];
    this.wrongQuestions = []; // 錯題牛棚紀錄
    this.currentQuestionIdx = 0;

    // 棒球賽況狀態
    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    this.bases = [false, false, false]; // [一壘, 二壘, 三壘]

    // 動畫與動態相機狀態
    this.isAnimating = false;
    this.clock = new THREE.Clock();
    this.powerPos = 0.5; // 力量槽游標位置 (0.0 ~ 1.0)
    this.powerDir = 1;

    // 預設本壘越肩視角
    this.defaultCamPos = new THREE.Vector3(-1.3, 3.8, 33.8);
    this.defaultCamLook = new THREE.Vector3(0, 2.5, 5);
    this.currentCamLook = this.defaultCamLook.clone();
    this.cameraMode = 'batting'; // 'batting' | 'follow_ball'

    // 計時器引用 (防切換競態)
    this.pitchTimer = null;
    this.flyTimer = null;
    this.feedbackTimer = null;
    this.bannerTimer = null;

    this.initThree();
    this.field = new BaseballField(this.scene);
    this.setupEvents();
    this.startNewGame('all');
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8);
    this.scene.fog = new THREE.Fog(0x7dd3fc, 65, 165);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    this.camera.position.copy(this.defaultCamPos);
    this.camera.lookAt(this.defaultCamLook);

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

  clearTimers() {
    if (this.pitchTimer) { clearInterval(this.pitchTimer); this.pitchTimer = null; }
    if (this.flyTimer) { clearInterval(this.flyTimer); this.flyTimer = null; }
    if (this.feedbackTimer) { clearTimeout(this.feedbackTimer); this.feedbackTimer = null; }
    if (this.bannerTimer) { clearTimeout(this.bannerTimer); this.bannerTimer = null; }
  }

  startNewGame(mode = 'all') {
    this.clearTimers();
    this.isAnimating = false;
    this.field.isCrowdCheering = false;
    this.cameraMode = 'batting';
    this.currentMode = mode;

    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    this.bases = [false, false, false];
    this.currentQuestionIdx = 0;

    if (mode === 'wrong' && this.wrongQuestions.length > 0) {
      // 牛棚錯題特訓模式
      this.questions = shuffleArray(this.wrongQuestions).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    } else {
      this.questions = getGameQuestions(mode === 'wrong' ? 'all' : mode, 9);
    }

    this.updateScoreboardUI();
    document.getElementById('final-modal').classList.add('hidden');
    document.getElementById('feedback-modal').classList.add('hidden');
    document.getElementById('big-banner').classList.add('banner-hidden');

    this.loadQuestion(0);
  }

  // 更新計分板、壘包燈號、出局紅燈與稱號
  updateScoreboardUI() {
    document.getElementById('hud-score').textContent = this.score;
    document.getElementById('hud-combo').textContent = `COMBO x${this.combo}`;

    // 出局燈號
    document.getElementById('out-1').classList.toggle('active', this.outs >= 1);
    document.getElementById('out-2').classList.toggle('active', this.outs >= 2);

    // 鑽石壘包亮燈
    document.getElementById('ui-base-1').classList.toggle('active', this.bases[0]);
    document.getElementById('ui-base-2').classList.toggle('active', this.bases[1]);
    document.getElementById('ui-base-3').classList.toggle('active', this.bases[2]);

    // 同步 3D 球場壘上跑者
    this.field.updateBaseRunners(this.bases);

    // 晉升稱號
    const rankEl = document.getElementById('hud-rank');
    if (this.score >= 12) rankEl.textContent = '👑 大聯盟 MVP';
    else if (this.score >= 7) rankEl.textContent = '🔥 台灣巨砲';
    else if (this.score >= 3) rankEl.textContent = '⚡ 校隊四番';
    else rankEl.textContent = '🌱 少棒新秀';

    // 錯題特訓按鈕顯示
    const wrongBtn = document.getElementById('btn-wrong-mode');
    if (this.wrongQuestions.length > 0) {
      wrongBtn.classList.remove('hidden');
      wrongBtn.textContent = `🎯 錯題特訓 (${this.wrongQuestions.length})`;
    } else {
      wrongBtn.classList.add('hidden');
    }
  }

  formatQuestionHTML(rawText) {
    const escaped = rawText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(/\[([^\]]+)\]/g, '<span class="highlight-char">$1</span>');
  }

  // 顯示實況野球大字橫幅
  showBigBanner(text, color = '#fef08a') {
    const banner = document.getElementById('big-banner');
    banner.textContent = text;
    banner.style.color = color;
    banner.classList.remove('banner-hidden');

    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      banner.classList.add('banner-hidden');
    }, 1800);
  }

  loadQuestion(idx) {
    if (idx >= this.questions.length) {
      this.showFinalCard();
      return;
    }

    this.currentQuestionIdx = idx;
    const q = this.questions[idx];

    // 隨機決定本球球種
    this.currentPitch = PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
    document.getElementById('hud-pitch-type').textContent = this.currentPitch.name;

    // 更新題目 HUD
    document.getElementById('hud-subject').textContent = `【${q.subject}】${q.unit}`;
    document.getElementById('hud-question').innerHTML = this.formatQuestionHTML(q.question);
    document.getElementById('hud-phonetic').textContent = q.phonetic || '';
    document.getElementById('hud-inning').textContent = `${idx + 1}局上 / 共${this.questions.length}局`;

    // 渲染三個外野揮棒按鈕
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const directions = ['左外野方向', '中外野方向', '右外野方向'];
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

    this.resetPositions();
    soundCtrl.speakText(`${q.subject}，${q.question}`);
  }

  resetPositions() {
    this.cameraMode = 'batting';
    this.field.isCrowdCheering = false;
    this.field.ball.position.set(0, 2.2, 15);
    this.field.pitcherGroup.position.y = 0.45;
    this.field.pitcherGroup.rotation.x = 0;
    this.field.batGroup.rotation.set(Math.PI / 7, 0, -Math.PI / 5);
  }

  // 依據力量槽游標位置與連擊數，決定安打類型 (1: 一壘打, 2: 二壘打, 4: 全壘打)
  evaluateHitBases() {
    const distFromCenter = Math.abs(this.powerPos - 0.5);
    // 落在中央紅心甜蜜區 (0.37 ~ 0.63) 或連擊 >= 2 直接全壘打！
    if (distFromCenter <= 0.14 || this.combo >= 2) {
      return 4; // HOME RUN
    } else if (distFromCenter <= 0.28) {
      return 2; // DOUBLE 二壘安打
    }
    return 1; // SINGLE 一壘安打
  }

  // 推進壘包並計算打點 (RBI)
  advanceRunners(hitBases) {
    let runsScored = 0;
    const newBases = [false, false, false];

    // 原本在壘上的跑者推進
    for (let i = 2; i >= 0; i--) {
      if (this.bases[i]) {
        const destBase = i + hitBases;
        if (destBase >= 3) {
          runsScored++;
        } else {
          newBases[destBase] = true;
        }
      }
    }

    // 打者本身推進
    if (hitBases >= 4) {
      runsScored++; // 全壘打打者自己也得 1 分
    } else {
      newBases[hitBases - 1] = true;
    }

    this.bases = newBases;
    this.score += runsScored;
    return runsScored;
  }

  // 學童揮棒決策
  handleSwing(option, zoneIdx) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const buttons = document.querySelectorAll('.batting-btn');
    buttons.forEach(b => b.disabled = true);

    soundCtrl.playPitchSound();

    // 投手高壓抬腿投球動作與魔球弧線飛行
    const ball = this.field.ball;
    const startPos = new THREE.Vector3(0, 2.3, 15);
    const targetOffset = (zoneIdx - 1) * 0.85;
    const hitPos = new THREE.Vector3(-0.5 + targetOffset, 1.65, 27.5);

    let progress = 0;
    const pitchFrames = this.currentPitch.speed;
    const curveAmount = this.currentPitch.curve;

    this.pitchTimer = setInterval(() => {
      progress += 1 / pitchFrames;

      // 投手前傾投球動畫
      this.field.pitcherGroup.rotation.x = Math.sin(progress * Math.PI) * 0.45;

      // 計算變化球橫向偏移與火焰殘影
      ball.position.lerpVectors(startPos, hitPos, progress);
      ball.position.x += Math.sin(progress * Math.PI) * curveAmount;
      ball.position.y += Math.sin(progress * Math.PI) * 0.8;
      this.field.spawnTrailAt(ball.position);

      if (progress >= 1) {
        clearInterval(this.pitchTimer);
        this.pitchTimer = null;
        this.executeContact(option, zoneIdx);
      }
    }, 16);
  }

  // 擊球瞬間判定與運鏡切換
  executeContact(option, zoneIdx) {
    // 球棒強力揮擊動作
    this.field.batGroup.rotation.z = Math.PI / 2.2;
    this.field.batGroup.rotation.y = -Math.PI / 2.2;

    const currentQ = this.questions[this.currentQuestionIdx];

    if (option.isCorrect) {
      // 答對！判定是安打、二壘打還是全壘打
      this.hits++;
      this.combo++;
      const hitBases = this.evaluateHitBases();
      const isHR = hitBases === 4;
      const wasBasesLoaded = this.bases[0] && this.bases[1] && this.bases[2];
      const rbi = this.advanceRunners(hitBases);

      if (isHR) this.homeRuns++;

      // 若此題原本在錯題特訓名單中，答對後從錯題庫移除！
      this.wrongQuestions = this.wrongQuestions.filter(wq => wq.id !== currentQ.id);

      this.updateScoreboardUI();
      soundCtrl.playHitSound(isHR);
      this.field.spawnHitSparks(this.field.ball.position, isHR);
      this.field.isCrowdCheering = true;

      // 畫面震動特效
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 360);

      // 決定實況大字橫幅
      let bannerText = '⚾ 一壘安打 SINGLE!';
      if (isHR && wasBasesLoaded) bannerText = '👑 滿貫全壘打 GRAND SLAM! (+4分)';
      else if (isHR && rbi > 1) bannerText = `💥 ${rbi}分全壘打 HOME RUN!`;
      else if (isHR) bannerText = '💥 陽春全壘打 HOME RUN!';
      else if (hitBases === 2) bannerText = `🔥 深遠二壘安打 DOUBLE! (+${rbi}分)`;
      else if (rbi > 0) bannerText = `⚾ 適時安打! (+${rbi}分)`;

      this.showBigBanner(bannerText, isHR ? '#fef08a' : '#38bdf8');

      if (isHR) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.55 } });
      }

      // 啟動高空追球運鏡動畫
      this.animateHitBallFlight(zoneIdx, hitBases, () => {
        const extraMsg = rbi > 0 ? `<br>🏆 <b>本棒打點：+${rbi} 分！</b>（目前 ${this.combo} 連擊！）` : `<br>🏃 <b>成功推進上壘！</b>（下一棒瞄準紅心轟回來！）`;
        this.showFeedbackModal(
          true,
          `<b>${bannerText}</b><br>${option.hitResult}${extraMsg}`,
          isHR ? `全壘打！得到 ${rbi} 分！` : `漂亮安打！`
        );
      });

    } else {
      // 答錯：好球揮棒落空 OUT！
      soundCtrl.playMissSound();
      this.combo = 0;
      this.outs++;

      // 加入牛棚錯題特訓庫 (避免重複加入)
      if (!this.wrongQuestions.some(wq => wq.id === currentQ.id)) {
        this.wrongQuestions.push(currentQ);
      }

      let outNotice = '';
      if (this.outs >= 3) {
        outNotice = '<br><br>⚠️ <b>三出局攻守交換（壘上跑者殘壘清空）！</b>';
        this.outs = 0;
        this.bases = [false, false, false];
        this.showBigBanner('❌ 三出局 3 OUTS!', '#ef4444');
      } else {
        this.showBigBanner('⚡ 揮棒落空 STRIKE OUT!', '#ef4444');
      }

      this.updateScoreboardUI();

      this.feedbackTimer = setTimeout(() => {
        this.showFeedbackModal(
          false,
          `${option.hitResult}<br><br>💡 <b>總教練戰術指導</b>：<br>${currentQ.hint}${outNotice}`,
          `出局！教練提醒你，${currentQ.hint}`
        );
      }, 550);
    }
  }

  // 飛球軌跡 + 動態追球運鏡 (Follow-Ball Camera)
  animateHitBallFlight(zoneIdx, hitBases, onComplete) {
    this.cameraMode = 'follow_ball';
    const ball = this.field.ball;
    const start = ball.position.clone();

    const distZ = hitBases === 4 ? -55 : hitBases === 2 ? -18 : 0;
    const peakY = hitBases === 4 ? 24 : hitBases === 2 ? 10 : 4.5;
    const targetX = (zoneIdx - 1) * (hitBases === 4 ? 26 : 15);
    const dest = new THREE.Vector3(targetX, hitBases === 4 ? 14 : 0.3, distZ);

    let t = 0;
    const duration = hitBases === 4 ? 68 : 48;

    this.flyTimer = setInterval(() => {
      t += 1 / duration;
      ball.position.x = THREE.MathUtils.lerp(start.x, dest.x, t);
      ball.position.z = THREE.MathUtils.lerp(start.z, dest.z, t);
      ball.position.y = start.y * (1 - t) + dest.y * t + Math.sin(t * Math.PI) * peakY;
      this.field.spawnTrailAt(ball.position);

      if (t >= 1) {
        clearInterval(this.flyTimer);
        this.flyTimer = null;
        onComplete();
      }
    }, 16);
  }

  showFeedbackModal(isSuccess, messageHtml, speechText) {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');

    title.textContent = isSuccess ? '💥 精采好球 NICE HIT！' : '⚡ 出局 OUT！戰術暫停';
    title.style.color = isSuccess ? '#facc15' : '#ef4444';
    msg.innerHTML = messageHtml;
    modal.classList.remove('hidden');

    soundCtrl.speakText(speechText);
  }

  nextQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    this.isAnimating = false;
    this.loadQuestion(this.currentQuestionIdx + 1);
  }

  showFinalCard() {
    const modal = document.getElementById('final-modal');
    const avg = ((this.hits / this.questions.length)).toFixed(3).replace('0.', '.');
    document.getElementById('final-avg').textContent = avg;
    document.getElementById('final-hr').textContent = this.homeRuns;
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-rank-title').textContent = `獲得稱號：${document.getElementById('hud-rank').textContent}`;

    const wrongSummary = document.getElementById('final-wrong-summary');
    const finalWrongBtn = document.getElementById('btn-final-wrong');

    if (this.wrongQuestions.length > 0) {
      wrongSummary.innerHTML = `📋 本場共有 <b style="color:#f87171">${this.wrongQuestions.length} 題</b> 揮空失誤，快進「錯題特訓」把它們全部轟出全壘打！`;
      finalWrongBtn.classList.remove('hidden');
    } else {
      wrongSummary.innerHTML = `🎉 <b>完美零失誤完封對手！你已經徹底掌握期中考重點！</b>`;
      finalWrongBtn.classList.add('hidden');
    }

    confetti({ particleCount: 160, spread: 110, origin: { y: 0.5 } });
    modal.classList.remove('hidden');
    soundCtrl.speakText(`比賽結束！你總共攻下 ${this.score} 分，打出 ${this.homeRuns} 支全壘打！`);
  }

  setupEvents() {
    document.getElementById('btn-speak').onclick = () => {
      const q = this.questions[this.currentQuestionIdx];
      if (q) soundCtrl.speakText(`${q.subject}，${q.question}`);
    };

    const muteBtn = document.getElementById('btn-mute');
    muteBtn.onclick = () => {
      soundCtrl.isMuted = !soundCtrl.isMuted;
      if (soundCtrl.isMuted) soundCtrl.stopSpeech();
      muteBtn.textContent = soundCtrl.isMuted ? '🔇' : '🔊';
    };

    document.getElementById('btn-next').onclick = () => this.nextQuestion();
    document.getElementById('btn-restart').onclick = () => {
      this.startNewGame(this.currentMode === 'wrong' ? 'all' : this.currentMode);
    };

    // 啟動牛棚錯題特訓
    const startWrongTraining = () => {
      if (this.wrongQuestions.length > 0) {
        this.startNewGame('wrong');
      }
    };
    document.getElementById('btn-wrong-mode').onclick = startWrongTraining;
    document.getElementById('btn-final-wrong').onclick = startWrongTraining;

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) {
      modeSelect.onchange = (e) => {
        e.target.blur();
        this.startNewGame(e.target.value);
      };
    }

    window.addEventListener('keydown', (e) => {
      const feedbackModal = document.getElementById('feedback-modal');
      const finalModal = document.getElementById('final-modal');

      if (!feedbackModal.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.nextQuestion();
        }
        return;
      }

      if (!finalModal.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.startNewGame(this.currentMode === 'wrong' ? 'all' : this.currentMode);
        }
        return;
      }

      if (this.isAnimating) return;
      const key = e.key.toUpperCase();
      const q = this.questions[this.currentQuestionIdx];
      if (!q) return;

      if (key === 'A' && q.options[0]) this.handleSwing(q.options[0], 0);
      if (key === 'S' && q.options[1]) this.handleSwing(q.options[1], 1);
      if (key === 'D' && q.options[2]) this.handleSwing(q.options[2], 2);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    // 1. 更新底部甜蜜點力量游標擺動
    if (!this.isAnimating) {
      this.powerPos += 0.014 * this.powerDir;
      if (this.powerPos >= 0.98) { this.powerPos = 0.98; this.powerDir = -1; }
      if (this.powerPos <= 0.02) { this.powerPos = 0.02; this.powerDir = 1; }
      const cursor = document.getElementById('power-cursor');
      if (cursor) cursor.style.left = `${this.powerPos * 100}%`;

      // 打者準備打擊呼吸律動
      this.field.batGroup.rotation.z = -Math.PI / 5 + Math.sin(elapsed * 5) * 0.06;
    }

    // 2. 動態運鏡平滑插值 (Lerp Camera)
    if (this.cameraMode === 'follow_ball') {
      // 高空追球視角：拉高拉遠並注視飛行中的棒球
      const targetCamPos = new THREE.Vector3(
        this.field.ball.position.x * 0.35,
        12.5,
        36
      );
      this.camera.position.lerp(targetCamPos, 0.06);
      this.currentCamLook.lerp(this.field.ball.position, 0.12);
      this.camera.lookAt(this.currentCamLook);
    } else {
      // 本壘打擊越肩視角
      this.camera.position.lerp(this.defaultCamPos, 0.08);
      this.currentCamLook.lerp(this.defaultCamLook, 0.08);
      this.camera.lookAt(this.currentCamLook);
    }

    // 3. 更新球場粒子、觀眾歡呼與守備律動
    this.field.updateEffects(elapsed);

    this.renderer.render(this.scene, this.camera);
  }
}
