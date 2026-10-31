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
import { getGameQuestions, shuffleArray, QUESTION_MAP } from './curriculum.js';
import { BaseballField } from './baseballField.js';
import { soundCtrl } from './audio.js';
import { buildGuidedCoachingData } from './guidedTeaching.js';
import {
  renderRulerWidget,
  renderBaseRunningChainWidget,
  renderShadowLabWidget,
  renderStrikeZoneGrid,
  generateAndDownloadPlayerCard
} from './specialModes.js';
import {
  BASEBALL_PETS,
  BASEBALL_STADIUM_BUILDS,
  rollRandomEncounter,
  runBaseballSwingQTE,
  openRoguelikeDraftModal,
  renderFloatingTargetsOverlay,
  openPetAndBuildModal
} from './gameplayUpgrades.js';

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
    this.seenQuestionIds = new Set();
    this.currentQuestionIdx = 0;
    this.isStrikeZoneGridActive = false;
    this.balloonModeState = 'auto'; // 'auto': 每兩題穿插, 'on': 全開, 'off': 關閉

    // 載入玩家金幣、球棒、3D寵物、3D球場設施、錯題本、已讀題池與球衣背號存檔
    this.loadPlayerSave();

    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    this.bases = [false, false, false];
    this.isFeverActive = false;
    this.used5050ThisTurn = false;
    this.strikesThisTurn = 0;
    this.eliminatedIndices = new Set();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;

    // 5.0 Roguelike 肉鴿天賦與隨機突發事件狀態
    this.roguelikeBuffs = new Set();
    this.activeBuffLabels = [];
    this.eagleEyeCharges = 0;
    this.ironShieldCharges = 0;
    this.draftedStages = new Set();
    this.currentEncounter = null;
    this.blitzSecondsLeft = 0;
    this.blitzTimer = null;

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
    this.field.updateBatterJerseyNumber(this.jerseyNumber);
    this.field.setPetCompanion(this.equippedPet);
    this.field.updateStadiumBuilds(this.unlockedBuilds);
    this.setupEvents();
    this.startNewGame('all');
    this.animate();
  }

  loadPlayerSave() {
    try {
      const savedCoins = localStorage.getItem('g2_baseball_coins');
      this.coins = savedCoins !== null ? parseInt(savedCoins, 10) : 60;
      const savedBats = localStorage.getItem('g2_baseball_bats');
      this.unlockedBats = savedBats ? JSON.parse(savedBats) : ['wood'];
      this.equippedBat = localStorage.getItem('g2_baseball_equipped') || 'wood';

      // 載入 3D 隨身神獸寵物與外野球場設施
      const savedPets = localStorage.getItem('g2_baseball_pets');
      this.unlockedPets = savedPets ? JSON.parse(savedPets) : ['shiba'];
      this.equippedPet = localStorage.getItem('g2_baseball_pet_equipped') || 'shiba';
      const savedBuilds = localStorage.getItem('g2_baseball_builds');
      this.unlockedBuilds = savedBuilds ? JSON.parse(savedBuilds) : [];

      // 載入選手名字與背號
      this.playerName = localStorage.getItem('g2_baseball_player_name') || '台灣小巨砲';
      this.jerseyNumber = localStorage.getItem('g2_baseball_jersey_num') || '99';

      // 載入跨場次錯題本 ID 並還原為題目物件
      const savedWrongIds = localStorage.getItem('g2_baseball_wrong_ids');
      if (savedWrongIds) {
        const ids = JSON.parse(savedWrongIds);
        this.wrongQuestions = ids.map(id => QUESTION_MAP.get(id)).filter(Boolean);
      }

      // 載入已作答過的題目 ID 集合（優先抽未讀題）
      const savedSeenIds = localStorage.getItem('g2_baseball_seen_ids');
      if (savedSeenIds) {
        this.seenQuestionIds = new Set(JSON.parse(savedSeenIds));
      }
    } catch {
      this.coins = 60;
      this.unlockedBats = ['wood'];
      this.equippedBat = 'wood';
      this.unlockedPets = ['shiba'];
      this.equippedPet = 'shiba';
      this.unlockedBuilds = [];
      this.playerName = '台灣小巨砲';
      this.jerseyNumber = '99';
    }
  }

  savePlayerData() {
    try {
      localStorage.setItem('g2_baseball_coins', String(this.coins));
      localStorage.setItem('g2_baseball_bats', JSON.stringify(this.unlockedBats));
      localStorage.setItem('g2_baseball_equipped', this.equippedBat);
      localStorage.setItem('g2_baseball_pets', JSON.stringify(this.unlockedPets));
      localStorage.setItem('g2_baseball_pet_equipped', this.equippedPet);
      localStorage.setItem('g2_baseball_builds', JSON.stringify(this.unlockedBuilds));
      localStorage.setItem('g2_baseball_player_name', this.playerName);
      localStorage.setItem('g2_baseball_jersey_num', String(this.jerseyNumber));
      localStorage.setItem('g2_baseball_wrong_ids', JSON.stringify(this.wrongQuestions.map(q => q.id)));
      localStorage.setItem('g2_baseball_seen_ids', JSON.stringify(Array.from(this.seenQuestionIds)));
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
    if (this.blitzTimer) { clearInterval(this.blitzTimer); this.blitzTimer = null; }
  }

  startNewGame(mode = 'all') {
    this.clearTimers();
    this.isAnimating = false;
    this.isFeverActive = false;
    this.used5050ThisTurn = false;
    this.field.isCrowdCheering = false;
    this.cameraMode = 'batting';
    this.currentMode = mode;

    // 重置單場 Roguelike 天賦狀態
    this.roguelikeBuffs = new Set();
    this.activeBuffLabels = [];
    this.eagleEyeCharges = 0;
    this.ironShieldCharges = 0;
    this.draftedStages = new Set();
    this.currentEncounter = null;

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) modeSelect.value = mode;

    this.score = 0;
    this.outs = 0;
    this.hits = 0;
    this.homeRuns = 0;
    this.combo = 0;
    // 若已建造「傳奇名人堂黃金雕像」，開局直接保送一壘跑者！
    const hasStatue = this.unlockedBuilds.includes('gold_statue');
    this.bases = [hasStatue, false, false];
    this.currentQuestionIdx = 0;

    if (mode === 'wrong' && this.wrongQuestions.length > 0) {
      this.questions = shuffleArray(this.wrongQuestions).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    } else {
      this.questions = getGameQuestions(mode === 'wrong' ? 'all' : mode, 9, this.seenQuestionIds);
      this.savePlayerData();
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

    const jerseyBadge = document.getElementById('hud-jersey-badge');
    if (jerseyBadge) jerseyBadge.textContent = `#${this.jerseyNumber}`;

    document.getElementById('out-1').classList.toggle('active', this.outs >= 1);
    document.getElementById('out-2').classList.toggle('active', this.outs >= 2);

    document.getElementById('ui-base-1').classList.toggle('active', this.bases[0]);
    document.getElementById('ui-base-2').classList.toggle('active', this.bases[1]);
    document.getElementById('ui-base-3').classList.toggle('active', this.bases[2]);

    this.field.updateBaseRunners(this.bases);

    const batObj = BAT_SHOP_ITEMS.find(b => b.id === this.equippedBat) || BAT_SHOP_ITEMS[0];
    const petObj = BASEBALL_PETS.find(p => p.id === this.equippedPet) || BASEBALL_PETS[0];
    document.getElementById('hud-bat-name').textContent = `裝備：${batObj.name} ｜ 寵物：${petObj.icon}`;

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
    const btnGrid = document.getElementById('btn-toggle-pitchgrid');
    const btnBalloon = document.getElementById('btn-toggle-balloon');
    if (btn5050) btn5050.disabled = this.coins < 20 || this.used5050ThisTurn || this.isAnimating;
    if (btnFever) {
      btnFever.disabled = this.coins < 40 || this.isFeverActive || this.isAnimating;
      btnFever.classList.toggle('active-fever', this.isFeverActive);
    }
    if (btnGrid) {
      btnGrid.classList.toggle('active-grid', this.isStrikeZoneGridActive);
      btnGrid.textContent = this.isStrikeZoneGridActive ? '🎯 九宮格好球帶：開啟中' : '🎯 九宮格好球帶：關閉';
    }
    if (btnBalloon) {
      const labelMap = {
        auto: '🎈 飛天氣球：自動穿插',
        on: '🎈 飛天氣球：全開中',
        off: '🎈 飛天氣球：關閉'
      };
      btnBalloon.textContent = labelMap[this.balloonModeState] || labelMap.auto;
      btnBalloon.classList.toggle('active-grid', this.balloonModeState !== 'off');
    }

    this.renderActiveBuffsBar();
  }

  renderActiveBuffsBar() {
    const bar = document.getElementById('active-buffs-bar');
    if (!bar) return;
    const tags = [];
    const petObj = BASEBALL_PETS.find(p => p.id === this.equippedPet);
    if (petObj) {
      tags.push(`<span class="buff-pill buff-pet">${petObj.name} (+${petObj.bonusCoins}💰)</span>`);
    }
    if (this.unlockedBuilds.length > 0) {
      tags.push(`<span class="buff-pill buff-build">🎡 球場設施 x${this.unlockedBuilds.length}</span>`);
    }
    this.activeBuffLabels.forEach(lbl => {
      tags.push(`<span class="buff-pill buff-rogue">${this.escapeHTML(lbl)}</span>`);
    });
    if (this.ironShieldCharges > 0) {
      tags.push(`<span class="buff-pill buff-shield">🛡️ 免出局護盾 x${this.ironShieldCharges}</span>`);
    }
    if (this.eagleEyeCharges > 0) {
      tags.push(`<span class="buff-pill buff-rogue">🦅 鷹眼透視 x${this.eagleEyeCharges}</span>`);
    }
    if (this.currentEncounter) {
      const blitzStr = this.blitzSecondsLeft > 0 ? ` (${this.blitzSecondsLeft}s)` : '';
      tags.push(`<span class="buff-pill buff-event">${this.escapeHTML(this.currentEncounter.title)}${blitzStr}</span>`);
    }
    bar.innerHTML = tags.join('');
  }

  isBalloonActiveForCurrentTurn() {
    if (this.isStrikeZoneGridActive) return false;
    if (this.balloonModeState === 'on') return true;
    if (this.balloonModeState === 'off') return false;
    return this.currentQuestionIdx % 2 === 1;
  }

  refreshFloatingBalloons() {
    const q = this.questions[this.currentQuestionIdx];
    renderFloatingTargetsOverlay({
      active: this.isBalloonActiveForCurrentTurn(),
      edition: 'baseball',
      question: q,
      eliminatedIndices: this.eliminatedIndices,
      onSelectOption: (opt, optIdx) => this.handleSwing(opt, optIdx)
    });
  }

  applyRoguelikeCard(card) {
    this.roguelikeBuffs.add(card.id);
    this.activeBuffLabels.push(`${card.icon} ${card.name}`);

    if (card.id === 'ghost_runners') {
      this.bases[1] = true;
      this.bases[2] = true;
    } else if (card.id === 'eagle_eye') {
      this.eagleEyeCharges += 2;
    } else if (card.id === 'iron_shield') {
      this.ironShieldCharges += 1;
      this.coins += 35;
      this.savePlayerData();
    }

    soundCtrl.playOrganCharge();
    this.showBigBanner(`🃏 覺醒天賦：【${card.name}】`, card.desc, '#facc15');
    this.updateScoreboardUI();
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
    if ((q.unit && q.unit.includes('多音字')) || (q.question && q.question.includes('讀音'))) {
      return `${q.subject}，${q.unit}。請看螢幕上的句子，選出重點框裡國字的正確讀音！`;
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
    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }

    if (idx >= this.questions.length) {
      renderFloatingTargetsOverlay({ active: false });
      this.showFinalCard();
      return;
    }

    // 每過 3 局 (第 4 局 idx=3、第 7 局 idx=6) 觸發 Roguelike 三選一狂暴天賦卡！
    if ((idx === 3 || idx === 6) && !this.draftedStages.has(idx)) {
      this.draftedStages.add(idx);
      renderFloatingTargetsOverlay({ active: false });
      soundCtrl.playOrganCharge();
      openRoguelikeDraftModal({
        edition: 'baseball',
        onSelectCard: (card) => {
          this.applyRoguelikeCard(card);
          this.loadQuestion(idx);
        }
      });
      return;
    }

    this.currentQuestionIdx = idx;
    this.used5050ThisTurn = false;
    this.strikesThisTurn = 0;
    this.eliminatedIndices = new Set();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;
    const q = this.questions[idx];

    // 隨機亂入突發事件 (外星飛碟雙倍賞金 / 滿壘大轉機 / 15秒快問快答)
    this.currentEncounter = rollRandomEncounter('baseball', idx);
    this.blitzSecondsLeft = 0;
    if (this.currentEncounter) {
      if (this.currentEncounter.freeRunners) {
        this.bases[0] = true;
        this.bases[1] = true;
      }
      if (this.currentEncounter.blitzSeconds > 0) {
        this.blitzSecondsLeft = this.currentEncounter.blitzSeconds;
        this.blitzTimer = setInterval(() => {
          this.blitzSecondsLeft = Math.max(0, this.blitzSecondsLeft - 1);
          this.renderActiveBuffsBar();
          if (this.blitzSecondsLeft <= 0 && this.blitzTimer) {
            clearInterval(this.blitzTimer);
            this.blitzTimer = null;
          }
        }, 1000);
      }
      this.showBigBanner(this.currentEncounter.title, this.currentEncounter.desc, '#facc15');
    }

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
    const phoneticEl = document.getElementById('hud-phonetic');
    phoneticEl.textContent = q.phonetic || '';
    phoneticEl.className = '';
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

    // 若擁有「🦅 鷹眼自動球探」天賦層數，上場自動免費刪去 1 個錯誤選項！
    if (this.eagleEyeCharges > 0) {
      this.eagleEyeCharges--;
      const wrongIndices = q.options.map((o, i) => (!o.isCorrect ? i : -1)).filter(i => i !== -1);
      if (wrongIndices.length > 0) {
        const autoIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        this.eliminatedIndices.add(autoIdx);
        const btns = document.querySelectorAll('.batting-btn');
        if (btns[autoIdx]) {
          btns[autoIdx].disabled = true;
          btns[autoIdx].classList.add('eliminated-opt');
        }
      }
    }

    // Phase 2.2：斷尺視覺量測台 (數學第 3 單元)
    renderRulerWidget(
      document.getElementById('ruler-widget-container'),
      q,
      () => soundCtrl.playPitchSound()
    );

    // Phase 2.3：兩步驟跑壘連鎖解題 (數學第 4 單元)
    renderBaseRunningChainWidget(
      document.getElementById('baserun-chain-container'),
      q,
      (step1Val) => {
        this.coins += 10;
        if (!this.bases[1]) this.bases[1] = true; // 跑者成功盜上二壘！
        this.savePlayerData();
        this.updateScoreboardUI();
        soundCtrl.playHitSound(false);
        this.showBigBanner(`🏃‍♂️ 盜上二壘 SAFE! (${step1Val})`, '💰 +10 盜壘獎勵金幣！請揮棒完成第二步！', '#86efac');
      }
    );

    // Phase 2.4：球場光與影子互動實驗室 (生活第 2 單元)
    renderShadowLabWidget(
      document.getElementById('shadow-lab-container'),
      q,
      () => soundCtrl.playPitchSound()
    );

    // Phase 2.1：好球帶九宮格投球靶心面板 & 5.0 飛天熱氣球靶心
    this.refreshStrikeZoneGrid();
    this.refreshFloatingBalloons();

    this.resetPositions();
    this.updateScoreboardUI();
    soundCtrl.speakText(this.getSpokenQuestionText(q));
  }

  refreshStrikeZoneGrid() {
    const overlay = document.getElementById('strike-zone-overlay');
    const gridEl = document.getElementById('strike-zone-grid');
    const q = this.questions[this.currentQuestionIdx];
    if (!overlay || !gridEl || !q) return;

    if (!this.isStrikeZoneGridActive) {
      overlay.classList.add('hidden');
      return;
    }

    overlay.classList.remove('hidden');
    renderStrikeZoneGrid(
      gridEl,
      q,
      this.eliminatedIndices,
      (opt, optIdx) => this.handleSwing(opt, optIdx),
      (decoyLabel) => {
        soundCtrl.playMissSound();
        this.showBigBanner('⚾ 偏離好球帶 BALL!', `「${decoyLabel}」不在三個主選項中，再瞄準一次！`, '#f97316');
      }
    );
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
    const targetIdx = Number(targetBtn.dataset.idx);
    this.eliminatedIndices.add(targetIdx);
    targetBtn.disabled = true;
    targetBtn.classList.add('eliminated-opt');

    this.refreshStrikeZoneGrid();
    this.refreshFloatingBalloons();
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
    } else if (distFromCenter <= 0.28 || this.equippedBat === 'dragon' || this.equippedPet === 'minidragon') {
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
    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }
    renderFloatingTargetsOverlay({ active: false });

    const buttons = document.querySelectorAll('.batting-btn, .sz-plate');
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
    const currentQ = this.questions[this.currentQuestionIdx];

    if (option.isCorrect) {
      // 啟動 5.0「🎯 魔球鎖定・手動揮棒 QTE」微操作！
      const petObj = BASEBALL_PETS.find(p => p.id === this.equippedPet) || BASEBALL_PETS[0];
      const slowMoBonus = (this.roguelikeBuffs.has('slow_motion') ? 1.0 : 0) + (petObj.qteBonus || 0);

      runBaseballSwingQTE({
        pitchName: this.currentPitch?.name || '🔥 152km 火焰直球',
        sweetSpotBonus: slowMoBonus,
        onSound: (isPerfect) => soundCtrl.playHitSound(isPerfect),
        onComplete: (qteResult) => {
          this.field.batGroup.rotation.z = Math.PI / 2.2;
          this.field.batGroup.rotation.y = -Math.PI / 2.2;

          this.hits++;
          this.combo++;
          let hitBases = this.evaluateHitBases() + qteResult.bonusBases;
          if (this.roguelikeBuffs.has('power_bat')) hitBases += 1;
          hitBases = Math.min(4, hitBases);

          const isHR = hitBases === 4;
          const wasBasesLoaded = this.bases[0] && this.bases[1] && this.bases[2];
          const rbi = this.advanceRunners(hitBases);

          // 計算金幣獎勵 (基礎 + QTE手動加成 + 球棒 + 3D寵物 + 3D球場擴建設施 + 亂入事件 + 磁鐵天賦)
          let earnedCoins = (isHR ? (wasBasesLoaded ? 80 : 40) : hitBases === 2 ? 25 : 15) + qteResult.bonusCoins;
          if (this.equippedBat === 'dragon') earnedCoins += 15;
          if (petObj) earnedCoins += petObj.bonusCoins;

          let buildBonus = 0;
          BASEBALL_STADIUM_BUILDS.forEach(b => {
            if (this.unlockedBuilds.includes(b.id)) buildBonus += b.bonusCoins;
          });
          earnedCoins += buildBonus;

          if (this.blitzSecondsLeft > 0) earnedCoins += 35;
          if (this.currentEncounter?.coinMultiplier > 1) earnedCoins *= this.currentEncounter.coinMultiplier;
          if (this.equippedBat === 'rainbow') earnedCoins *= 2;
          if (this.roguelikeBuffs.has('coin_magnet')) earnedCoins *= 2;

          this.coins += earnedCoins;
          this.savePlayerData();

          if (isHR) {
            this.homeRuns++;
            this.field.startBatterVictoryRun(); // 打者真實繞壘奔跑動畫！
          }

          this.isFeverActive = false;
          // 唯有第一次揮棒就直接答對，才從錯題本移除，確保需要教練引導的題目仍可進錯題特訓複習
          if (this.strikesThisTurn === 0) {
            this.wrongQuestions = this.wrongQuestions.filter(wq => wq.id !== currentQ.id);
            this.savePlayerData();
          }

          this.updateScoreboardUI();
          this.field.spawnHitSparks(this.field.ball.position, isHR);
          this.field.isCrowdCheering = true;

          document.body.classList.add('screen-shake');
          setTimeout(() => document.body.classList.remove('screen-shake'), 380);

          // 計算 Statcast 飛行距離與初速
          const petDist = petObj?.bonusDist || 0;
          const distMeters = (isHR ? Math.floor(125 + Math.random() * 42) : hitBases === 2 ? Math.floor(85 + Math.random() * 25) : Math.floor(45 + Math.random() * 25)) + petDist;
          const exitVel = isHR ? Math.floor(162 + Math.random() * 22) : Math.floor(125 + Math.random() * 25);
          const statcastStr = `${qteResult.label} ｜ 📏 ${distMeters}m ｜ 💰 +${earnedCoins} 金幣`;

          let bannerText = '⚾ 穿越安打 SINGLE!';
          if (isHR && wasBasesLoaded) bannerText = '👑 滿貫全壘打 GRAND SLAM! (+4分)';
          else if (isHR && rbi > 1) bannerText = `💥 ${rbi}分全壘打 HOME RUN!`;
          else if (isHR) bannerText = '💥 超大號全壘打 HOME RUN!';
          else if (hitBases === 2) bannerText = `🔥 深遠二壘長打 DOUBLE!`;

          this.showBigBanner(bannerText, statcastStr, isHR ? '#fef08a' : '#38bdf8');

          if (isHR) {
            confetti({ particleCount: 95, spread: 85, origin: { y: 0.55 } });
          }

          const wasGuidedSuccess = this.strikesThisTurn > 0;
          this.animateHitBallFlight(zoneIdx, hitBases, () => {
            const guidedPraise = wasGuidedSuccess
              ? `<div class="guide-step-card guide-step-think" style="margin-top:8px;">🌟 <b>引導破解成功！</b>你順著教練的思考步驟，靠自己找出正確答案了！<br>🎓 <b>完整觀念總結</b>：${this.escapeHTML(currentQ.hint)}</div>`
              : `<div style="margin-top:6px;color:#93c5fd;">🎓 <b>觀念解析</b>：${this.escapeHTML(currentQ.hint)}</div>`;
            const extraMsg = `<br>🎯 <b>揮棒時機：${qteResult.label}</b><br>📏 <b>飛行距離：${distMeters}m（初速 ${exitVel}km/h）</b><br>💰 <b>獲得賞金：+${earnedCoins} 金幣！</b>（含寵物與球場設施加成・COMBO x${this.combo}）${guidedPraise}`;
            this.showFeedbackModal(
              true,
              `<b>${bannerText}</b><br>${option.hitResult}${extraMsg}`,
              wasGuidedSuccess
                ? `太棒了！經過教練引導，你自己找出正確答案了！${currentQ.hint}`
                : isHR ? `全壘打！飛行距離 ${distMeters} 公尺！` : `漂亮安打！`
            );
          });
        }
      });

    } else {
      this.field.batGroup.rotation.z = Math.PI / 2.2;
      this.field.batGroup.rotation.y = -Math.PI / 2.2;
      soundCtrl.playMissSound();
      this.strikesThisTurn++;

      if (!this.wrongQuestions.some(wq => wq.id === currentQ.id)) {
        this.wrongQuestions.push(currentQ);
        this.savePlayerData();
      }

      // 第一次答錯：啟動「🧙‍♂️ 總教練引導式教學（擦棒界外球）」，不直接判出局也不直接給答案！
      if (this.strikesThisTurn === 1) {
        // 若尚未因球探卡刪去選項，則將剛才誤選的錯誤選項劃掉，留下 2 個選項讓學童思考
        if (this.eliminatedIndices.size === 0) {
          this.eliminatedIndices.add(zoneIdx);
        }
        this.used5050ThisTurn = true; // 進入引導階段後鎖定球探卡，鼓勵學童親自推導
        this.isGuidedRetryPending = true;

        const guideData = buildGuidedCoachingData(currentQ, option);
        this.lastGuideData = guideData;

        this.showBigBanner('⚾ 擦棒界外球 FOUL! 教練戰術引導', '別氣餒！聽完教練引導再揮一棒！', '#38bdf8');
        this.updateScoreboardUI();

        this.feedbackTimer = setTimeout(() => {
          this.showGuidedCoachingModal(guideData);
        }, 520);
        return;
      }

      // 第二次仍答錯：檢查是否有「🛡️ 金剛免出局護盾」
      this.combo = 0;
      this.isFeverActive = false;
      this.isGuidedRetryPending = false;

      let outNotice = '';
      if (this.ironShieldCharges > 0) {
        this.ironShieldCharges--;
        outNotice = '<br><br>🛡️ <b>發動「金剛免出局護盾」！抵銷本次三振，不計出局數！</b>';
        this.showBigBanner('🛡️ 金剛護盾發動！免除三振！', '', '#38bdf8');
      } else {
        this.outs++;
        if (this.outs >= 3) {
          outNotice = '<br><br>⚠️ <b>三出局攻守交換（壘上跑者清空）！</b>';
          this.outs = 0;
          this.bases = [false, false, false];
          this.showBigBanner('❌ 三出局 3 OUTS!', '', '#ef4444');
        } else {
          this.showBigBanner('⚡ 揮棒落空 STRIKE OUT!', '', '#ef4444');
        }
      }

      this.updateScoreboardUI();
      const correctOpt = currentQ.options.find(o => o.isCorrect);
      const correctText = correctOpt ? correctOpt.text : '';

      this.feedbackTimer = setTimeout(() => {
        this.showFeedbackModal(
          false,
          `<div class="guide-step-card guide-step-trap"><b>🔍 錯失好球原因</b>：${this.escapeHTML(option.hitResult)}</div>` +
          `<div class="guide-step-card guide-step-think">💡 <b>總教練完整解析</b>：<br>${this.escapeHTML(currentQ.hint)}</div>` +
          `<div class="guide-step-card guide-step-scaffold">✅ <b>正確答案是：【${this.escapeHTML(correctText)}】</b>${outNotice}</div>`,
          `出局！教練告訴你，${currentQ.hint} 正確答案是 ${correctText}`,
          `✅ 我學會了！正確答案是【${correctText}】⚾`
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

  // 呈現「🧙‍♂️ 總教練引導式教學」三步鷹架視窗（不直接洩漏答案，引導學童重試找出答案）
  showGuidedCoachingModal(guideData) {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    const nextBtn = document.getElementById('btn-next');

    title.textContent = '🧙‍♂️ 總教練引導教學（界外球戰術暫停）';
    title.style.color = '#38bdf8';

    msg.innerHTML = `
      <div class="guide-step-card guide-step-trap">
        <b>🔍 步驟一：為什麼剛剛這球揮空了？（你選了：${this.escapeHTML(guideData.selectedWrongText)}）</b><br>
        ${this.escapeHTML(guideData.trapReason)}
      </div>
      <div class="guide-step-card guide-step-think">
        <b>🧭 步驟二：總教練帶你一步一步想</b><br>
        ${this.escapeHTML(guideData.step1Question)}
      </div>
      <button type="button" class="btn-reveal-clue" id="btn-reveal-scaffold">
        💡 還是不太確定？點我打開「解題算式／觀念小錦囊」
      </button>
      <div class="guide-step-card guide-step-scaffold hidden" id="scaffold-secret-box">
        <b>🔑 步驟三：解題拆解小錦囊（想想看【 ❓ 】是多少？）</b><br>
        ${this.escapeHTML(guideData.step2MaskedHint)}
      </div>
    `;

    nextBtn.textContent = '🎯 我想通了！回打擊區自己選出答案 ⚾ (空白鍵)';
    modal.classList.remove('hidden');

    const revealBtn = document.getElementById('btn-reveal-scaffold');
    const secretBox = document.getElementById('scaffold-secret-box');
    if (revealBtn && secretBox) {
      revealBtn.onclick = () => {
        secretBox.classList.remove('hidden');
        revealBtn.classList.add('hidden');
        const spokenScaffold = guideData.step2MaskedHint.replace(/【\s*❓\s*】|❓/g, '多少');
        soundCtrl.speakText(`解題小錦囊：${spokenScaffold} 請回打擊區選出正確答案！`);
      };
    }

    soundCtrl.speakText(guideData.spokenGuide);
  }

  // 引導教學後回到同一題打擊區，讓學童根據線索自己找出正確答案
  retryCurrentQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    this.isAnimating = false;
    this.isGuidedRetryPending = false;

    this.resetPositions();

    // 在題目下方持續顯示教練的遮罩引導線索，陪伴學童作答
    if (this.lastGuideData) {
      const phoneticEl = document.getElementById('hud-phonetic');
      phoneticEl.textContent = this.lastGuideData.liveHudGuide;
      phoneticEl.className = 'coach-live-banner';
    }

    // 重新啟用尚未被淘汰的揮棒選項按鈕
    const buttons = document.querySelectorAll('.batting-btn');
    buttons.forEach((btn, idx) => {
      if (this.eliminatedIndices.has(idx)) {
        btn.disabled = true;
        btn.classList.add('eliminated-opt');
      } else {
        btn.disabled = false;
      }
    });

    this.refreshStrikeZoneGrid();
    this.refreshFloatingBalloons();
    this.updateScoreboardUI();
  }

  // 開啟「🥚 3D 寵物盲盒 ＆ 🎡 球場擴建」中心
  openPetAndBuildCenter(lastWonPet = null) {
    openPetAndBuildModal({
      edition: 'baseball',
      currency: this.coins,
      unlockedPets: this.unlockedPets,
      equippedPet: this.equippedPet,
      unlockedBuilds: this.unlockedBuilds,
      lastWonPet,
      onPullGacha: (wonPet, cost) => {
        this.coins -= cost;
        if (!this.unlockedPets.includes(wonPet.id)) {
          this.unlockedPets.push(wonPet.id);
        }
        this.equippedPet = wonPet.id;
        this.field.setPetCompanion(wonPet.id);
        this.savePlayerData();
        this.updateScoreboardUI();
        soundCtrl.playOrganCharge();
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
        this.showBigBanner(`🎉 恭喜抽中神獸：【${wonPet.name}】！`, wonPet.desc, '#facc15');
        this.openPetAndBuildCenter(wonPet);
      },
      onEquipPet: (petId) => {
        this.equippedPet = petId;
        this.field.setPetCompanion(petId);
        this.savePlayerData();
        this.updateScoreboardUI();
        soundCtrl.playPitchSound();
        this.openPetAndBuildCenter();
      },
      onBuyBuild: (buildItem) => {
        if (this.coins < buildItem.price || this.unlockedBuilds.includes(buildItem.id)) return;
        this.coins -= buildItem.price;
        this.unlockedBuilds.push(buildItem.id);
        this.field.updateStadiumBuilds(this.unlockedBuilds);
        this.savePlayerData();
        this.updateScoreboardUI();
        soundCtrl.playOrganCharge();
        confetti({ particleCount: 80, spread: 90, origin: { y: 0.55 } });
        this.showBigBanner(`🎡 球場擴建完成：【${buildItem.name}】！`, buildItem.desc, '#4ade80');
        this.openPetAndBuildCenter();
      }
    });
  }

  showFeedbackModal(isSuccess, messageHtml, speechText, customBtnText = '') {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    const nextBtn = document.getElementById('btn-next');

    title.textContent = isSuccess ? '💥 精采好球 NICE HIT！' : '⚡ 出局 OUT！觀念訂正時間';
    title.style.color = isSuccess ? '#facc15' : '#ef4444';
    msg.innerHTML = messageHtml;
    nextBtn.textContent = customBtnText || '下一打席 ⚾ (空白鍵)';
    modal.classList.remove('hidden');

    soundCtrl.speakText(speechText);
  }

  handleFeedbackModalAction() {
    if (this.isGuidedRetryPending) {
      this.retryCurrentQuestion();
    } else {
      this.nextQuestion();
    }
  }

  nextQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    this.isAnimating = false;
    this.isGuidedRetryPending = false;
    this.loadQuestion(this.currentQuestionIdx + 1);
  }

  showFinalCard() {
    const modal = document.getElementById('final-modal');
    const avg = ((this.hits / this.questions.length)).toFixed(3).replace('0.', '.');
    document.getElementById('final-avg').textContent = avg;
    document.getElementById('final-hr').textContent = this.homeRuns;
    document.getElementById('final-score').textContent = this.score;

    const playerBadge = document.getElementById('final-player-badge');
    if (playerBadge) {
      playerBadge.textContent = `👕 選手：${this.playerName} ｜ 背號：#${this.jerseyNumber}`;
    }

    let rankTitle = '🌱 少棒新秀';
    if (this.score >= 12) rankTitle = '👑 期中大聯盟傳奇 MVP';
    else if (this.score >= 7) rankTitle = '🔥 台灣無雙巨砲';
    else if (this.score >= 3) rankTitle = '⚡ 校隊黃金四番';
    this.lastRankTitle = rankTitle;
    this.lastAvg = avg;
    document.getElementById('final-rank-title').textContent = `獲得稱號：${rankTitle}（累計金幣：💰${this.coins}）`;

    const wrongSummary = document.getElementById('final-wrong-summary');
    const finalWrongBtn = document.getElementById('btn-final-wrong');

    if (this.wrongQuestions.length > 0) {
      wrongSummary.innerHTML = `📋 目前錯題庫共有 <b style="color:#f87171">${this.wrongQuestions.length} 題</b> 待補強，快進「錯題特訓」把它們全部轟出全壘打！`;
      finalWrongBtn.classList.remove('hidden');
    } else {
      wrongSummary.innerHTML = `🎉 <b>完美零失誤擊潰三大魔王！你已經徹底稱霸期中考！</b>`;
      finalWrongBtn.classList.add('hidden');
    }

    confetti({ particleCount: 160, spread: 110, origin: { y: 0.5 } });
    modal.classList.remove('hidden');
    soundCtrl.speakText(`比賽結束！${this.playerName}選手總共攻下 ${this.score} 分，打出 ${this.homeRuns} 支全壘打！`);
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

    const petBuildBtn = document.getElementById('btn-open-pet-build');
    if (petBuildBtn) {
      petBuildBtn.onclick = () => this.openPetAndBuildCenter();
    }

    // 球員姓名與背號設定視窗 (Phase 3)
    const profileModal = document.getElementById('profile-modal');
    const openProfileBtn = document.getElementById('btn-open-profile');
    if (openProfileBtn && profileModal) {
      openProfileBtn.onclick = () => {
        document.getElementById('input-player-name').value = this.playerName;
        document.getElementById('input-jersey-num').value = this.jerseyNumber;
        profileModal.classList.remove('hidden');
      };
      document.getElementById('btn-close-profile').onclick = () => {
        profileModal.classList.add('hidden');
      };
      document.getElementById('btn-save-profile').onclick = () => {
        const nameVal = document.getElementById('input-player-name').value.trim();
        const numVal = document.getElementById('input-jersey-num').value.trim();
        this.playerName = nameVal || '台灣小巨砲';
        const parsedNum = parseInt(numVal, 10);
        this.jerseyNumber = !isNaN(parsedNum) && parsedNum >= 0 && parsedNum <= 99 ? String(parsedNum) : '99';
        this.field.updateBatterJerseyNumber(this.jerseyNumber);
        this.savePlayerData();
        this.updateScoreboardUI();
        profileModal.classList.add('hidden');
        soundCtrl.playOrganCharge();
        this.showBigBanner(`👕 ${this.playerName} #${this.jerseyNumber} 登場！`, '專屬 3D 球衣背號已更新！', '#38bdf8');
      };
    }

    // 九宮格好球帶切換按鈕 (Phase 2.1)
    const gridToggleBtn = document.getElementById('btn-toggle-pitchgrid');
    if (gridToggleBtn) {
      gridToggleBtn.onclick = () => {
        this.isStrikeZoneGridActive = !this.isStrikeZoneGridActive;
        this.refreshStrikeZoneGrid();
        this.refreshFloatingBalloons();
        this.updateScoreboardUI();
        soundCtrl.playPitchSound();
      };
    }

    // 飛天熱氣球動態靶心切換按鈕 (Phase 5.0)
    const balloonToggleBtn = document.getElementById('btn-toggle-balloon');
    if (balloonToggleBtn) {
      balloonToggleBtn.onclick = () => {
        const order = ['auto', 'on', 'off'];
        const nextIdx = (order.indexOf(this.balloonModeState) + 1) % order.length;
        this.balloonModeState = order[nextIdx];
        this.refreshFloatingBalloons();
        this.updateScoreboardUI();
        soundCtrl.playPitchSound();
      };
    }

    // 賽後下載專屬 MVP 球員卡 (Phase 3)
    const downloadCardBtn = document.getElementById('btn-download-card');
    if (downloadCardBtn) {
      downloadCardBtn.onclick = () => {
        const batObj = BAT_SHOP_ITEMS.find(b => b.id === this.equippedBat) || BAT_SHOP_ITEMS[0];
        const modeSelect = document.getElementById('select-mode');
        const modeLabel = modeSelect?.selectedOptions?.[0]?.textContent || '綜合大滿貫';
        generateAndDownloadPlayerCard({
          playerName: this.playerName,
          jerseyNumber: this.jerseyNumber,
          rankTitle: this.lastRankTitle || '🌱 少棒新秀',
          avg: this.lastAvg || '.000',
          homeRuns: this.homeRuns,
          score: this.score,
          coins: this.coins,
          batName: batObj.name,
          modeLabel
        });
      };
    }

    document.getElementById('btn-skill-5050').onclick = () => this.useScout5050Skill();
    document.getElementById('btn-skill-fever').onclick = () => this.useFeverSkill();

    document.getElementById('btn-next').onclick = () => this.handleFeedbackModalAction();
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
      const profileModal = document.getElementById('profile-modal');
      if (profileModal && !profileModal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
          profileModal.classList.add('hidden');
        }
        return;
      }

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
          this.handleFeedbackModalAction();
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
