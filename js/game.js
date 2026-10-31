/**
 * 3D 實況滿貫王 3.0 傳奇魔王篇：主遊戲引擎
 * 包含：
 * - 3 大魔王投手與日/昏/夜動態球場
 * - 金幣與 4 把 3D 神兵球棒商店 (LocalStorage 自動存檔)
 * - 球探透視刪去卡 & 巨砲必殺覺醒氣場
 * - Statcast 擊球飛行距離測速 + 打者真實繞壘奔跑動畫
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
  { name: '👑 162km 龍焰魔球', speed: 29, curve: 0.85 }
];

const BOSS_STAGES = [
  { name: '🐻 森林暴熊隊長', stageIdx: 0 },
  { name: '🐸 閃電忍蛙・疾風丸', stageIdx: 1 },
  { name: '🐉 黃金巨龍・凱撒王', stageIdx: 2 }
];

const BAT_SHOP_ITEMS = [
  {
    id: 'wood',
    name: '🪵 新手木棒',
    price: 0,
    desc: '標準少棒木棒，手感紮實穩定。'
  },
  {
    id: 'thunder',
    name: '⚡ 雷神黃金棒',
    price: 60,
    desc: '純金打造的閃電球棒！全壘打紅心甜蜜點擴大 50%！'
  },
  {
    id: 'dragon',
    name: '🔥 烈焰龍魂棒',
    price: 120,
    desc: '燃燒藍色龍焰！答對保底二壘長打以上，每棒額外 +15 金幣！'
  },
  {
    id: 'rainbow',
    name: '🌈 星際彩虹神棒',
    price: 200,
    desc: '傳說中的宇宙神兵！答對 100% 必轟全壘打，且金幣獎勵雙倍！'
  }
];

export class GameEngine {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentMode = 'all';
    this.questions = [];
    this.wrongQuestions = [];
    this.currentQuestionIdx = 0;

    // 載入玩家金幣與已解鎖球棒存檔 (初次遊玩贈送 40 開局金幣！)
    this.loadPlayerSave();

    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    this.bases = [false, false, false];
    this.isFeverActive = false;
    this.used5050ThisTurn = false;

    this.isAnimating = false;
    this.clock = new THREE.Clock();
    this.powerPos = 0.5;
    this.powerDir = 1;

    this.defaultCamPos = new THREE.Vector3(-1.3, 3.8, 33.8);
    this.defaultCamLook = new THREE.Vector3(0, 2.5, 5);
    this.currentCamLook = this.defaultCamLook.clone();
    this.cameraMode = 'batting';

    this.pitchTimer = null;
    this.flyTimer = null;
    this.feedbackTimer = null;
    this.bannerTimer = null;

    this.initThree();
    this.field = new BaseballField(this.scene);
    this.field.equipBatSkin(this.equippedBat);
    this.setupEvents();
    this.startNewGame('all');
    this.animate();
  }

  loadPlayerSave() {
    try {
      const savedCoins = localStorage.getItem('g2_baseball_coins');
      this.coins = savedCoins !== null ? parseInt(savedCoins, 10) : 40;
      const savedBats = localStorage.getItem('g2_baseball_bats');
      this.unlockedBats = savedBats ? JSON.parse(savedBats) : ['wood'];
      this.equippedBat = localStorage.getItem('g2_baseball_equipped') || 'wood';
    } catch {
      this.coins = 40;
      this.unlockedBats = ['wood'];
      this.equippedBat = 'wood';
    }
  }

  savePlayerData() {
    try {
      localStorage.setItem('g2_baseball_coins', String(this.coins));
      localStorage.setItem('g2_baseball_bats', JSON.stringify(this.unlockedBats));
      localStorage.setItem('g2_baseball_equipped', this.equippedBat);
    } catch {
      // 忽略無痕模式寫入限制
    }
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
    this.isFeverActive = false;
    this.used5050ThisTurn = false;
    this.field.isCrowdCheering = false;
    this.cameraMode = 'batting';
    this.currentMode = mode;

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) modeSelect.value = mode;

    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    this.bases = [false, false, false];
    this.currentQuestionIdx = 0;

    if (mode === 'wrong' && this.wrongQuestions.length > 0) {
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

  updateScoreboardUI() {
    document.getElementById('hud-score').textContent = this.score;
    document.getElementById('hud-coins').textContent = this.coins;
    document.getElementById('hud-combo').textContent = `COMBO x${this.combo}`;

    document.getElementById('out-1').classList.toggle('active', this.outs >= 1);
    document.getElementById('out-2').classList.toggle('active', this.outs >= 2);

    document.getElementById('ui-base-1').classList.toggle('active', this.bases[0]);
    document.getElementById('ui-base-2').classList.toggle('active', this.bases[1]);
    document.getElementById('ui-base-3').classList.toggle('active', this.bases[2]);

    this.field.updateBaseRunners(this.bases);

    const batObj = BAT_SHOP_ITEMS.find(b => b.id === this.equippedBat) || BAT_SHOP_ITEMS[0];
    document.getElementById('hud-bat-name').textContent = `裝備：${batObj.name}`;

    const wrongBtn = document.getElementById('btn-wrong-mode');
    if (this.wrongQuestions.length > 0) {
      wrongBtn.classList.remove('hidden');
      wrongBtn.textContent = `🎯 錯題 (${this.wrongQuestions.length})`;
    } else {
      wrongBtn.classList.add('hidden');
    }

    // 更新技能按鈕可用狀態（球探透視卡每局僅限使用一次）
    const btn5050 = document.getElementById('btn-skill-5050');
    const btnFever = document.getElementById('btn-skill-fever');
    if (btn5050) btn5050.disabled = this.coins < 20 || this.used5050ThisTurn || this.isAnimating;
    if (btnFever) {
      btnFever.disabled = this.coins < 40 || this.isFeverActive || this.isAnimating;
      btnFever.classList.toggle('active-fever', this.isFeverActive);
    }
  }

  escapeHTML(rawText) {
    return String(rawText)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  formatQuestionHTML(rawText) {
    const escaped = this.escapeHTML(rawText);
    return escaped.replace(/\[([^\]]+)\]/g, '<span class="highlight-char">$1</span>');
  }

  getSpokenQuestionText(q) {
    if (!q) return '';
    // 多音字題型避免語音引擎直接把答案讀音念出來洩題
    if (q.unit && q.unit.includes('多音字')) {
      return `${q.subject}，${q.unit}。請看螢幕上的句子，選出重點框裡國字的正確注音！`;
    }
    const cleanQuestion = q.question.replace(/\[([^\]]+)\]/g, '$1');
    return `${q.subject}，${cleanQuestion}`;
  }

  showBigBanner(mainText, statcastText = '', color = '#fef08a') {
    const banner = document.getElementById('big-banner');
    const mainEl = document.getElementById('banner-main');
    const statEl = document.getElementById('banner-statcast');

    mainEl.textContent = mainText;
    mainEl.style.color = color;
    if (statcastText) {
      statEl.textContent = statcastText;
      statEl.classList.remove('hidden');
    } else {
      statEl.classList.add('hidden');
    }

    banner.classList.remove('banner-hidden');

    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => {
      banner.classList.add('banner-hidden');
    }, 2100);
  }

  loadQuestion(idx) {
    if (idx >= this.questions.length) {
      this.showFinalCard();
      return;
    }

    this.currentQuestionIdx = idx;
    this.used5050ThisTurn = false;
    const q = this.questions[idx];

    // 依局數切換魔王投手與日/昏/夜球場天色 (0~2局:暴熊, 3~5局:忍蛙, 6~8局:巨龍)
    const bossStage = Math.min(2, Math.floor(idx / 3));
    const bossInfo = BOSS_STAGES[bossStage];
    document.getElementById('hud-boss').textContent = bossInfo.name;
    this.field.setBossPitcherStyle(bossStage);
    this.field.setStadiumAtmosphere(bossStage);

    this.currentPitch = PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
    document.getElementById('hud-pitch-type').textContent = this.currentPitch.name;

    document.getElementById('hud-subject').textContent = `【${q.subject}】${q.unit}`;
    document.getElementById('hud-question').innerHTML = this.formatQuestionHTML(q.question);
    document.getElementById('hud-phonetic').textContent = q.phonetic || '';
    document.getElementById('hud-inning').textContent = `${idx + 1}局上`;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const directions = ['左外野方向', '中外野方向', '右外野方向'];
    const keys = ['A', 'S', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'batting-btn';
      btn.dataset.idx = optIdx;
      btn.innerHTML = `
        <span class="btn-zone">${directions[optIdx]} [${keys[optIdx]}]</span>
        <span class="btn-text">${this.escapeHTML(opt.text)}</span>
      `;
      btn.onclick = () => this.handleSwing(opt, optIdx);
      optionsContainer.appendChild(btn);
    });

    this.resetPositions();
    this.updateScoreboardUI();
    soundCtrl.speakText(this.getSpokenQuestionText(q));
  }

  resetPositions() {
    this.cameraMode = 'batting';
    this.field.isCrowdCheering = false;
    this.field.resetBatterToBox();
    if (this.field.batterGroup.feverAura) {
      this.field.batterGroup.feverAura.visible = this.isFeverActive;
    }
    this.field.ball.position.set(0, 2.2, 15);
    this.field.pitcherGroup.position.y = 0.45;
    this.field.pitcherGroup.rotation.x = 0;
    this.field.batGroup.rotation.set(Math.PI / 7, 0, -Math.PI / 5);
  }

  // 使用「🕵️ 球探透視卡」刪去一個錯誤選項（每題限用一次）
  useScout5050Skill() {
    if (this.coins < 20 || this.used5050ThisTurn || this.isAnimating) return;
    const q = this.questions[this.currentQuestionIdx];
    const buttons = Array.from(document.querySelectorAll('.batting-btn'));

    // 找出尚未被刪去的錯誤選項按鈕
    const wrongBtns = buttons.filter((b, i) => !q.options[i].isCorrect && !b.disabled);
    if (wrongBtns.length === 0) return;

    this.coins -= 20;
    this.used5050ThisTurn = true;
    this.savePlayerData();

    const targetBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
    targetBtn.disabled = true;
    targetBtn.classList.add('eliminated-opt');

    soundCtrl.playPitchSound();
    this.updateScoreboardUI();
  }

  // 使用「🔥 巨砲必殺覺醒」下一棒保底全壘打
  useFeverSkill() {
    if (this.coins < 40 || this.isFeverActive || this.isAnimating) return;
    this.coins -= 40;
    this.isFeverActive = true;
    this.savePlayerData();

    if (this.field.batterGroup.feverAura) {
      this.field.batterGroup.feverAura.visible = true;
    }
    soundCtrl.playOrganCharge();
    this.showBigBanner('🔥 黃金巨砲覺醒！本棒必出全壘打！', '', '#facc15');
    this.updateScoreboardUI();
  }

  // 依據力量槽、球棒加成與必殺覺醒，判定安打壘包數
  evaluateHitBases() {
    if (this.isFeverActive || this.equippedBat === 'rainbow') {
      return 4; // 必出全壘打！
    }

    const distFromCenter = Math.abs(this.powerPos - 0.5);
    const sweetSpotRadius = this.equippedBat === 'thunder' ? 0.22 : 0.14;

    if (distFromCenter <= sweetSpotRadius || this.combo >= 2) {
      return 4; // HOME RUN
    } else if (distFromCenter <= 0.28 || this.equippedBat === 'dragon') {
      return 2; // DOUBLE 二壘打
    }
    return 1; // SINGLE 一壘打
  }

  advanceRunners(hitBases) {
    let runsScored = 0;
    const newBases = [false, false, false];

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

    if (hitBases >= 4) {
      runsScored++;
    } else {
      newBases[hitBases - 1] = true;
    }

    this.bases = newBases;
    this.score += runsScored;
    return runsScored;
  }

  handleSwing(option, zoneIdx) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const buttons = document.querySelectorAll('.batting-btn');
    buttons.forEach(b => b.disabled = true);

    soundCtrl.playPitchSound();

    const ball = this.field.ball;
    const startPos = new THREE.Vector3(0, 2.3, 15);
    const targetOffset = (zoneIdx - 1) * 0.85;
    const hitPos = new THREE.Vector3(-0.5 + targetOffset, 1.65, 27.5);

    let progress = 0;
    const pitchFrames = this.currentPitch.speed;
    const curveAmount = this.currentPitch.curve;

    this.pitchTimer = setInterval(() => {
      progress += 1 / pitchFrames;
      this.field.pitcherGroup.rotation.x = Math.sin(progress * Math.PI) * 0.45;

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

  executeContact(option, zoneIdx) {
    this.field.batGroup.rotation.z = Math.PI / 2.2;
    this.field.batGroup.rotation.y = -Math.PI / 2.2;

    const currentQ = this.questions[this.currentQuestionIdx];

    if (option.isCorrect) {
      this.hits++;
      this.combo++;
      const hitBases = this.evaluateHitBases();
      const isHR = hitBases === 4;
      const wasBasesLoaded = this.bases[0] && this.bases[1] && this.bases[2];
      const rbi = this.advanceRunners(hitBases);

      // 計算金幣獎勵
      let earnedCoins = isHR ? (wasBasesLoaded ? 80 : 40) : hitBases === 2 ? 25 : 15;
      if (this.equippedBat === 'dragon') earnedCoins += 15;
      if (this.equippedBat === 'rainbow') earnedCoins *= 2;
      this.coins += earnedCoins;
      this.savePlayerData();

      if (isHR) {
        this.homeRuns++;
        this.field.startBatterVictoryRun(); // 打者真實繞壘奔跑動畫！
      }

      this.isFeverActive = false;
      this.wrongQuestions = this.wrongQuestions.filter(wq => wq.id !== currentQ.id);

      this.updateScoreboardUI();
      soundCtrl.playHitSound(isHR);
      this.field.spawnHitSparks(this.field.ball.position, isHR);
      this.field.isCrowdCheering = true;

      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 380);

      // 計算 Statcast 飛行距離與初速
      const distMeters = isHR ? Math.floor(125 + Math.random() * 42) : hitBases === 2 ? Math.floor(85 + Math.random() * 25) : Math.floor(45 + Math.random() * 25);
      const exitVel = isHR ? Math.floor(162 + Math.random() * 22) : Math.floor(125 + Math.random() * 25);
      const statcastStr = `📏 飛行距離：${distMeters} 公尺 ｜ ⚡ 擊球初速：${exitVel} km/h ｜ 💰 +${earnedCoins} 金幣`;

      let bannerText = '⚾ 穿越安打 SINGLE!';
      if (isHR && wasBasesLoaded) bannerText = '👑 滿貫全壘打 GRAND SLAM! (+4分)';
      else if (isHR && rbi > 1) bannerText = `💥 ${rbi}分全壘打 HOME RUN!`;
      else if (isHR) bannerText = '💥 超大號全壘打 HOME RUN!';
      else if (hitBases === 2) bannerText = `🔥 深遠二壘長打 DOUBLE!`;

      this.showBigBanner(bannerText, statcastStr, isHR ? '#fef08a' : '#38bdf8');

      if (isHR) {
        confetti({ particleCount: 95, spread: 85, origin: { y: 0.55 } });
      }

      this.animateHitBallFlight(zoneIdx, hitBases, () => {
        const extraMsg = `<br>📏 <b>飛行距離：${distMeters}m（初速 ${exitVel}km/h）</b><br>💰 <b>獲得賞金：+${earnedCoins} 金幣！</b>（連擊 COMBO x${this.combo}）`;
        this.showFeedbackModal(
          true,
          `<b>${bannerText}</b><br>${option.hitResult}${extraMsg}`,
          isHR ? `全壘打！飛行距離 ${distMeters} 公尺！` : `漂亮安打！`
        );
      });

    } else {
      soundCtrl.playMissSound();
      this.combo = 0;
      this.outs++;
      this.isFeverActive = false;

      if (!this.wrongQuestions.some(wq => wq.id === currentQ.id)) {
        this.wrongQuestions.push(currentQ);
      }

      let outNotice = '';
      if (this.outs >= 3) {
        outNotice = '<br><br>⚠️ <b>三出局攻守交換（壘上跑者清空）！</b>';
        this.outs = 0;
        this.bases = [false, false, false];
        this.showBigBanner('❌ 三出局 3 OUTS!', '', '#ef4444');
      } else {
        this.showBigBanner('⚡ 揮棒落空 STRIKE OUT!', '', '#ef4444');
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

  animateHitBallFlight(zoneIdx, hitBases, onComplete) {
    this.cameraMode = 'follow_ball';
    const ball = this.field.ball;
    const start = ball.position.clone();

    const distZ = hitBases === 4 ? -55 : hitBases === 2 ? -18 : 0;
    const peakY = hitBases === 4 ? 25 : hitBases === 2 ? 10 : 4.5;
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

  // 渲染神兵球棒商店
  openBatShop() {
    document.getElementById('shop-coin-count').textContent = this.coins;
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    BAT_SHOP_ITEMS.forEach(item => {
      const isUnlocked = this.unlockedBats.includes(item.id);
      const isEquipped = this.equippedBat === item.id;

      const card = document.createElement('div');
      card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;

      let btnLabel = '';
      let btnDisabled = false;
      if (isEquipped) {
        btnLabel = '✅ 裝備中';
        btnDisabled = true;
      } else if (isUnlocked) {
        btnLabel = '裝備此球棒';
      } else {
        btnLabel = `💰 ${item.price} 金幣解鎖`;
        btnDisabled = this.coins < item.price;
      }

      card.innerHTML = `
        <div class="shop-item-title">${item.name}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="shop-buy-btn" ${btnDisabled ? 'disabled' : ''}>${btnLabel}</button>
      `;

      const btn = card.querySelector('.shop-buy-btn');
      btn.onclick = () => {
        if (!isUnlocked) {
          if (this.coins < item.price) return;
          this.coins -= item.price;
          this.unlockedBats.push(item.id);
          soundCtrl.playOrganCharge();
        } else {
          soundCtrl.playPitchSound();
        }
        this.equippedBat = item.id;
        this.field.equipBatSkin(item.id);
        this.savePlayerData();
        this.updateScoreboardUI();
        this.openBatShop(); // 重新刷新商店狀態
      };

      container.appendChild(card);
    });

    document.getElementById('shop-modal').classList.remove('hidden');
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

    let rankTitle = '🌱 少棒新秀';
    if (this.score >= 12) rankTitle = '👑 期中大聯盟傳奇 MVP';
    else if (this.score >= 7) rankTitle = '🔥 台灣無雙巨砲';
    else if (this.score >= 3) rankTitle = '⚡ 校隊黃金四番';
    document.getElementById('final-rank-title').textContent = `獲得稱號：${rankTitle}（累計金幣：💰${this.coins}）`;

    const wrongSummary = document.getElementById('final-wrong-summary');
    const finalWrongBtn = document.getElementById('btn-final-wrong');

    if (this.wrongQuestions.length > 0) {
      wrongSummary.innerHTML = `📋 本場共有 <b style="color:#f87171">${this.wrongQuestions.length} 題</b> 揮空失誤，快進「錯題特訓」把它們全部轟出全壘打！`;
      finalWrongBtn.classList.remove('hidden');
    } else {
      wrongSummary.innerHTML = `🎉 <b>完美零失誤擊潰三大魔王！你已經徹底稱霸期中考！</b>`;
      finalWrongBtn.classList.add('hidden');
    }

    confetti({ particleCount: 160, spread: 110, origin: { y: 0.5 } });
    modal.classList.remove('hidden');
    soundCtrl.speakText(`比賽結束！你總共攻下 ${this.score} 分，打出 ${this.homeRuns} 支全壘打！`);
  }

  setupEvents() {
    document.getElementById('btn-speak').onclick = () => {
      const q = this.questions[this.currentQuestionIdx];
      if (q) soundCtrl.speakText(this.getSpokenQuestionText(q));
    };

    const muteBtn = document.getElementById('btn-mute');
    muteBtn.onclick = () => {
      soundCtrl.isMuted = !soundCtrl.isMuted;
      if (soundCtrl.isMuted) soundCtrl.stopSpeech();
      muteBtn.textContent = soundCtrl.isMuted ? '🔇' : '🔊';
    };

    document.getElementById('btn-open-shop').onclick = () => this.openBatShop();
    document.getElementById('btn-close-shop').onclick = () => {
      document.getElementById('shop-modal').classList.add('hidden');
    };

    document.getElementById('btn-skill-5050').onclick = () => this.useScout5050Skill();
    document.getElementById('btn-skill-fever').onclick = () => this.useFeverSkill();

    document.getElementById('btn-next').onclick = () => this.nextQuestion();
    document.getElementById('btn-restart').onclick = () => {
      this.startNewGame(this.currentMode === 'wrong' ? 'all' : this.currentMode);
    };

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
      const shopModal = document.getElementById('shop-modal');
      if (!shopModal.classList.contains('hidden')) {
        if (e.key === 'Escape' || e.key === 'Enter') {
          shopModal.classList.add('hidden');
        }
        return;
      }

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

      const btns = document.querySelectorAll('.batting-btn');
      if (key === 'A' && q.options[0] && !btns[0]?.disabled) this.handleSwing(q.options[0], 0);
      if (key === 'S' && q.options[1] && !btns[1]?.disabled) this.handleSwing(q.options[1], 1);
      if (key === 'D' && q.options[2] && !btns[2]?.disabled) this.handleSwing(q.options[2], 2);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    if (!this.isAnimating) {
      this.powerPos += 0.014 * this.powerDir;
      if (this.powerPos >= 0.98) { this.powerPos = 0.98; this.powerDir = -1; }
      if (this.powerPos <= 0.02) { this.powerPos = 0.02; this.powerDir = 1; }
      const cursor = document.getElementById('power-cursor');
      if (cursor) cursor.style.left = `${this.powerPos * 100}%`;

      this.field.batGroup.rotation.z = -Math.PI / 5 + Math.sin(elapsed * 5) * 0.06;
    }

    if (this.cameraMode === 'follow_ball') {
      const targetCamPos = new THREE.Vector3(
        this.field.ball.position.x * 0.35,
        12.5,
        36
      );
      this.camera.position.lerp(targetCamPos, 0.06);
      this.currentCamLook.lerp(this.field.ball.position, 0.12);
      this.camera.lookAt(this.currentCamLook);
    } else {
      this.camera.position.lerp(this.defaultCamPos, 0.08);
      this.currentCamLook.lerp(this.defaultCamLook, 0.08);
      this.camera.lookAt(this.currentCamLook);
    }

    this.field.updateEffects(elapsed);
    this.renderer.render(this.scene, this.camera);
  }
}
