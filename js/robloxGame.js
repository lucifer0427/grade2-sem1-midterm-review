/**
 * 3D Roblox 極限跑酷障礙闖關版 (Roblox Obby Edition)：主遊戲引擎
 * - 100% 獨立錢包與獨立存檔 (g2_roblox_coins, g2_roblox_gears, g2_roblox_equipped_gear, g2_roblox_wrong_ids, g2_roblox_seen_ids)
 * - 100% 共用康軒國語 50 題、翰林數學 50 題、生活 50 題與蘇格拉底三階段引導教學
 * - 包含：9 階高空螺旋跑酷塔、Checkpoint 光圈登錄、經典 OOF! 跌倒音效、重力彈簧跳床、雷射斷尺測量與 Bloxy 英雄卡
 */
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { getGameQuestions, shuffleArray, QUESTION_MAP } from './curriculum.js';
import { RobloxWorld } from './robloxWorld.js';
import { robloxAudio } from './robloxAudio.js';
import { buildGuidedCoachingData } from './guidedTeaching.js';
import {
  renderLaserRulerWidget,
  renderRobloxTrampolineWidget,
  renderRobloxShadowWidget,
  generateAndDownloadRobloxCard
} from './robloxSpecialModes.js';
import {
  ROBLOX_PETS,
  ROBLOX_TOWER_BUILDS,
  rollRandomEncounter,
  runRobloxSpringQTE,
  openRoguelikeDraftModal,
  renderFloatingTargetsOverlay,
  openPetAndBuildModal
} from './gameplayUpgrades.js';

const ROBLOX_STAGE_NAMES = [
  '🟢 第 1 關：新手起跑霓虹台',
  '🟡 第 2 關：懸浮方塊跳台',
  '🔴 第 3 關：致命紅光雷射網',
  '🟣 第 4 關：彩虹透光琉璃橋',
  '🔷 第 5 關：高空極限平衡木',
  '⚡ 第 6 關：超重力彈簧跳床',
  '🌪️ 第 7 關：颶風旋轉風車塔',
  '🌟 第 8 關：螺旋通天重力柱',
  '🏆 第 9 關：Bloxy 跑酷王榮耀神殿'
];

const ROBLOX_SHOP_ITEMS = [
  {
    id: 'coil_speed',
    name: '⚡ 疾跑加速線圈 (Speed Coil)',
    price: 0,
    desc: '閃耀藍光的經典加速線圈，跑酷新手必備的基本裝備！'
  },
  {
    id: 'coil_gravity',
    name: '🌀 彈簧跳躍線圈 (Gravity Coil)',
    price: 80,
    desc: '手持重力彈簧！彈簧跳躍 QTE 完美區擴大 50%，起跳高度暴增！'
  },
  {
    id: 'bloxy_cola',
    name: '🥤 傳奇 Bloxy 能量可樂',
    price: 150,
    desc: '暢飲清爽可樂！每場可抵擋 1 次雷射跌倒失誤，答對 R$ 獎勵 1.5 倍！'
  },
  {
    id: 'rainbow_halo',
    name: '👑 霓虹彩虹天使光環',
    price: 250,
    desc: '神級跑酷王象徵！周身圍繞七彩霓虹拖尾，答對 100% 觸發超重力螺旋沖天！'
  }
];

export class RobloxGameEngine {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentMode = 'all';
    this.questions = [];
    this.wrongQuestions = [];
    this.seenQuestionIds = new Set();
    this.currentQuestionIdx = 0;
    this.stageIdx = 0; // 0 ~ 8
    this.floatingNeonModeState = 'auto'; // 'auto': 每兩題穿插, 'on': 全開, 'off': 關閉

    // 載入 Roblox 獨立存檔
    this.loadPlayerSave();

    this.score = 0;
    this.hearts = 3;
    this.combo = 0;
    this.maxCombo = 0;
    this.mistakesThisTurn = 0;
    this.eliminatedIndices = new Set();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;

    // 5.0 Roguelike 與特技狀態
    this.roguelikeBuffs = new Set();
    this.activeBuffLabels = [];
    this.shieldCharges = 0;
    this.draftedStages = new Set();
    this.currentEncounter = null;
    this.blitzSecondsLeft = 0;
    this.blitzTimer = null;

    this.isAnimating = false;
    this.clock = new THREE.Clock();

    this.initThree();
    this.world = new RobloxWorld(this.scene, this.camera);
    this.world.equipGear(this.equippedGear);
    this.world.setPetCompanion(this.equippedPet);
    this.world.updateTowerDecorations(this.unlockedBuilds);

    this.setupEvents();
    this.startNewGame('all');
    this.animate();
  }

  // ----------------------------------------------------
  // 1. 獨立 LocalStorage 存檔管理
  // ----------------------------------------------------
  loadPlayerSave() {
    try {
      this.robuxCoins = parseInt(localStorage.getItem('g2_roblox_coins') || '100', 10);
      this.unlockedGears = JSON.parse(localStorage.getItem('g2_roblox_gears') || '["coil_speed"]');
      this.equippedGear = localStorage.getItem('g2_roblox_equipped_gear') || 'coil_speed';
      this.unlockedPets = JSON.parse(localStorage.getItem('g2_roblox_pets') || '["pet_doge"]');
      this.equippedPet = localStorage.getItem('g2_roblox_equipped_pet') || 'pet_doge';
      this.unlockedBuilds = JSON.parse(localStorage.getItem('g2_roblox_builds') || '[]');
      this.playerName = localStorage.getItem('g2_roblox_player_name') || 'Noob跑酷王';
      this.playerSkin = localStorage.getItem('g2_roblox_skin') || 'noob';

      const seenRaw = localStorage.getItem('g2_roblox_seen_ids');
      this.seenQuestionIds = seenRaw ? new Set(JSON.parse(seenRaw)) : new Set();

      const wrongRaw = localStorage.getItem('g2_roblox_wrong_ids');
      this.wrongQuestionIds = wrongRaw ? new Set(JSON.parse(wrongRaw)) : new Set();
    } catch (e) {
      console.warn('載入 Roblox 存檔失敗，使用初始設定:', e);
      this.robuxCoins = 100;
      this.unlockedGears = ['coil_speed'];
      this.equippedGear = 'coil_speed';
      this.unlockedPets = ['pet_doge'];
      this.equippedPet = 'pet_doge';
      this.unlockedBuilds = [];
      this.playerName = 'Noob跑酷王';
      this.playerSkin = 'noob';
      this.seenQuestionIds = new Set();
      this.wrongQuestionIds = new Set();
    }
  }

  savePlayerSave() {
    try {
      localStorage.setItem('g2_roblox_coins', String(this.robuxCoins));
      localStorage.setItem('g2_roblox_gears', JSON.stringify(this.unlockedGears));
      localStorage.setItem('g2_roblox_equipped_gear', this.equippedGear);
      localStorage.setItem('g2_roblox_pets', JSON.stringify(this.unlockedPets));
      localStorage.setItem('g2_roblox_equipped_pet', this.equippedPet);
      localStorage.setItem('g2_roblox_builds', JSON.stringify(this.unlockedBuilds));
      localStorage.setItem('g2_roblox_player_name', this.playerName);
      localStorage.setItem('g2_roblox_skin', this.playerSkin);
      localStorage.setItem('g2_roblox_seen_ids', JSON.stringify([...this.seenQuestionIds]));
      localStorage.setItem('g2_roblox_wrong_ids', JSON.stringify([...this.wrongQuestionIds]));
    } catch (e) {
      console.warn('儲存 Roblox 存檔失敗:', e);
    }
  }

  // ----------------------------------------------------
  // 2. Three.js 場景初始化
  // ----------------------------------------------------
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060914);
    this.scene.fog = new THREE.FogExp2(0x060914, 0.012);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    this.camera.position.set(0, 7.5, 14);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  // ----------------------------------------------------
  // 3. 開始全新跑酷闖關
  // ----------------------------------------------------
  startNewGame(mode = 'all') {
    this.currentMode = mode;
    this.stageIdx = 0;
    this.score = 0;
    this.hearts = 3;
    this.combo = 0;
    this.maxCombo = 0;
    this.mistakesThisTurn = 0;
    this.eliminatedIndices.clear();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;

    // 清空 Roguelike
    this.roguelikeBuffs.clear();
    this.activeBuffLabels = [];
    this.shieldCharges = this.equippedGear === 'bloxy_cola' ? 1 : 0;
    this.draftedStages.clear();

    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }

    // 抽題邏輯
    let rawQuestions = [];
    if (mode === 'mistakes') {
      const mistakeList = [...this.wrongQuestionIds].map(id => QUESTION_MAP.get(id)).filter(Boolean);
      rawQuestions = mistakeList.length > 0 ? mistakeList : getGameQuestions('all', 9, this.seenQuestionIds);
    } else {
      rawQuestions = getGameQuestions(mode, 9, this.seenQuestionIds);
    }

    this.questions = rawQuestions;
    this.currentQuestionIdx = 0;

    // 重設 3D 世界
    if (this.world) {
      this.world.resetToStart();
    }

    this.updateHUD();
    this.loadQuestion();
  }

  // ----------------------------------------------------
  // 4. 載入並渲染當前題目
  // ----------------------------------------------------
  loadQuestion() {
    if (this.currentQuestionIdx >= this.questions.length) {
      this.handleGameWin();
      return;
    }

    const q = this.questions[this.currentQuestionIdx];
    this.seenQuestionIds.add(q.id);
    this.savePlayerSave();

    this.mistakesThisTurn = 0;
    this.eliminatedIndices.clear();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;

    // 突發隨機事件判定 (Stage 3, 6)
    if ((this.currentQuestionIdx === 2 || this.currentQuestionIdx === 5) && !this.currentEncounter) {
      this.currentEncounter = rollRandomEncounter('roblox');
      if (this.currentEncounter) {
        this.applyEncounter(this.currentEncounter);
      }
    }

    this.renderQuestionUI(q);
    this.updateHUD();
  }

  renderQuestionUI(q) {
    const qBadgeEl = document.getElementById('q-category-badge');
    const qTextEl = document.getElementById('q-text');
    const optContainer = document.getElementById('options-container');
    const specialContainer = document.getElementById('special-mode-container');

    if (qBadgeEl) {
      qBadgeEl.textContent = `[${q.subject}] ${q.unit || q.category || ''} (第 ${this.currentQuestionIdx + 1} / ${this.questions.length} 關)`;
      qBadgeEl.className = `category-badge category-${q.categoryKey || 'default'}`;
    }

    if (qTextEl) {
      qTextEl.textContent = q.question;
    }

    // 處理學科特化機關
    if (specialContainer) {
      specialContainer.innerHTML = '';
      if (q.specialMode === 'broken_ruler') {
        specialContainer.className = 'special-widget-active';
        renderLaserRulerWidget(specialContainer, q);
      } else if (q.specialMode === 'two_step_subtraction' || q.specialMode === 'two_step_mixed') {
        specialContainer.className = 'special-widget-active';
        renderRobloxTrampolineWidget(specialContainer, q);
      } else if (q.specialMode === 'light_shadow_matching' || q.specialMode === 'shadow_direction') {
        specialContainer.className = 'special-widget-active';
        renderRobloxShadowWidget(specialContainer, q);
      } else {
        specialContainer.className = 'hidden';
      }
    }

    // 判斷是否觸發飛天懸浮光標靶心模式
    const shouldShowFloating =
      this.floatingNeonModeState === 'on' ||
      (this.floatingNeonModeState === 'auto' && this.currentQuestionIdx % 2 === 1);

    if (shouldShowFloating && !q.specialMode) {
      renderFloatingTargetsOverlay({
        active: true,
        edition: 'roblox',
        question: q,
        eliminatedIndices: this.eliminatedIndices,
        onSelectOption: (opt, idx) => this.handleAnswer(opt, idx)
      });
    } else {
      renderFloatingTargetsOverlay({ active: false });
    }

    // 渲染一般三選一按鈕
    if (optContainer) {
      optContainer.innerHTML = '';
      const keys = ['A', 'S', 'D'];
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.id = `opt-btn-${idx}`;
        if (this.eliminatedIndices.has(idx)) {
          btn.classList.add('eliminated');
          btn.disabled = true;
        }

        btn.innerHTML = `
          <span class="option-key-badge">${keys[idx]}</span>
          <span class="option-text">${String(opt.text).replace(/</g, '&lt;')}</span>
        `;
        btn.onclick = () => this.handleAnswer(opt, idx);
        optContainer.appendChild(btn);
      });
    }

    // 朗讀題目語音
    if (document.getElementById('toggle-tts')?.checked) {
      robloxAudio.speak(q.question);
    }
  }

  // ----------------------------------------------------
  // 5. 玩家答題判定與邏輯
  // ----------------------------------------------------
  handleAnswer(selectedOption, optIdx) {
    const q = this.questions[this.currentQuestionIdx];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      this.handleCorrectAnswer(q);
    } else {
      this.handleWrongAnswer(q, optIdx);
    }
  }

  handleCorrectAnswer(q) {
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;

    // 計算獎勵
    let baseRobux = 20;
    if (this.equippedGear === 'rainbow_halo') baseRobux += 20;
    if (this.equippedGear === 'bloxy_cola') baseRobux = Math.floor(baseRobux * 1.5);
    if (this.roguelikeBuffs.has('robux_magnet')) baseRobux += 15;

    this.robuxCoins += baseRobux;
    this.score += 100 + this.combo * 20;

    // 從錯題本移除
    if (this.wrongQuestionIds.has(q.id)) {
      this.wrongQuestionIds.delete(q.id);
    }
    this.savePlayerSave();

    // 隱藏靶心模式
    renderFloatingTargetsOverlay({ active: false });

    // 關閉倒數
    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }

    // 音效與 3D 動作
    robloxAudio.playSuccess();
    robloxAudio.playCheckpointBeep();

    // 觸發極限彈簧跳躍 QTE
    runRobloxSpringQTE({
      hasGravityCoil: this.equippedGear === 'coil_gravity',
      petJumpBonus: this.equippedPet === 'pet_doge' || this.equippedPet === 'pet_rainbow_dragon',
      onBounceSound: isSweet => {
        robloxAudio.playBoingSound();
        if (isSweet) robloxAudio.playLevelUp();
      },
      onComplete: result => {
        this.robuxCoins += result.bonusRobux;
        this.savePlayerSave();
        this.showToastBanner(`${result.label}！連擊 x${this.combo}！`);

        // 3D 角色跳躍至下一個 Checkpoint
        this.stageIdx++;
        this.world.jumpToNextPlatform(this.stageIdx, () => {
          this.world.playConfetti();
        });

        // 檢查 Roguelike 天賦三選一 (第 3 關與第 6 關結束後)
        if (
          (this.stageIdx === 3 || this.stageIdx === 6) &&
          !this.draftedStages.has(this.stageIdx)
        ) {
          this.draftedStages.add(this.stageIdx);
          setTimeout(() => {
            openRoguelikeDraftModal({
              edition: 'roblox',
              onSelectCard: card => {
                this.roguelikeBuffs.add(card.id);
                this.activeBuffLabels.push(card.name);
                this.showToastBanner(`✨ 成功裝備超能齒輪：【${card.name}】！`);
                this.currentQuestionIdx++;
                this.loadQuestion();
              }
            });
          }, 800);
        } else {
          setTimeout(() => {
            this.currentQuestionIdx++;
            this.loadQuestion();
          }, 650);
        }
      }
    });
  }

  handleWrongAnswer(q, optIdx) {
    this.combo = 0;
    this.mistakesThisTurn++;
    this.wrongQuestionIds.add(q.id);
    this.savePlayerSave();

    // 檢查是否有護盾抵擋雷射
    if (this.shieldCharges > 0) {
      this.shieldCharges--;
      robloxAudio.playCheckpointBeep();
      this.showToastBanner('🛡️ 護盾/可樂發動！抵擋了本次雷射跌倒失誤！');
    } else {
      this.hearts--;
      robloxAudio.playOofSound();
      this.world.playOofAndRespawn();
    }

    this.eliminatedIndices.add(optIdx);

    // 愛心歸零檢查
    if (this.hearts <= 0) {
      this.handleGameOver();
      return;
    }

    // 啟動蘇格拉底三階段引導教學
    this.isGuidedRetryPending = true;
    this.lastGuideData = buildGuidedCoachingData(q, optIdx);
    this.showSocraticCoachingModal(this.lastGuideData, q);

    this.updateHUD();
  }

  // ----------------------------------------------------
  // 6. 蘇格拉底引導教學對話框 (Socratic Coaching Modal)
  // ----------------------------------------------------
  showSocraticCoachingModal(guideData, q) {
    let modal = document.getElementById('socratic-coach-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'socratic-coach-modal';
      document.body.appendChild(modal);
    }

    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card socratic-roblox-card">
        <div class="coach-header">
          <div class="coach-avatar">🤖</div>
          <div class="coach-title-group">
            <h3 style="color: #38bdf8; margin: 0; font-size: 19px;">【Obby 總教官】蘇格拉底引導思考</h3>
            <span style="color: #94a3b8; font-size: 13px;">小心避開雷射！仔細想一想這題的關鍵線索：</span>
          </div>
        </div>

        <!-- 階段一：迷思診斷 -->
        <div class="coach-box diagnosis-box">
          <div class="box-title">🔍 剛剛踩到的迷思陷阱：</div>
          <div class="box-content">${guideData.diagnosis}</div>
        </div>

        <!-- 階段二：引導思考提問 -->
        <div class="coach-box question-box">
          <div class="box-title">💡 教官問問你：</div>
          <div class="box-content">${guideData.questionPrompt}</div>
        </div>

        <!-- 階段三：遮罩小錦囊 -->
        <div class="coach-box tip-box">
          <div class="box-title">🎁 解題小錦囊（點擊展開）：</div>
          <div class="box-content tip-spoiler" id="tip-spoiler-text" style="filter: blur(5px); cursor: pointer; user-select: none;">
            ${guideData.spoilerHint}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">（點一下文字即可看見錦囊妙計！）</div>
        </div>

        <button type="button" class="action-btn" id="btn-coach-resume" style="margin-top: 14px; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff;">
          🚀 我懂了，在 Checkpoint 重新起跑！
        </button>
      </div>
    `;

    const spoilerEl = document.getElementById('tip-spoiler-text');
    if (spoilerEl) {
      spoilerEl.onclick = () => {
        spoilerEl.style.filter = 'none';
        spoilerEl.style.color = '#fef08a';
      };
    }

    document.getElementById('btn-coach-resume').onclick = () => {
      modal.className = 'modal-overlay hidden';
      // 重新渲染題目按鈕，已被淘汰的選項置灰
      this.renderQuestionUI(q);
    };
  }

  // ----------------------------------------------------
  // 7. 隨機突發事件處理
  // ----------------------------------------------------
  applyEncounter(encounter) {
    this.showToastBanner(`🎲 突發事件觸發：【${encounter.title}】！${encounter.desc}`);
    if (encounter.id === 'blitz_bonus') {
      this.blitzSecondsLeft = 12;
      this.blitzTimer = setInterval(() => {
        this.blitzSecondsLeft--;
        if (this.blitzSecondsLeft <= 0) {
          clearInterval(this.blitzTimer);
          this.blitzTimer = null;
        }
      }, 1000);
    } else if (encounter.id === 'free_shield') {
      this.shieldCharges += 1;
    }
  }

  // ----------------------------------------------------
  // 8. 介面與 HUD 更新
  // ----------------------------------------------------
  updateHUD() {
    const stageEl = document.getElementById('hud-stage-text');
    const robuxEl = document.getElementById('hud-robux-count');
    const heartsEl = document.getElementById('hud-hearts-container');
    const comboEl = document.getElementById('hud-combo-badge');
    const progressFill = document.getElementById('checkpoint-progress-fill');

    if (stageEl) {
      stageEl.textContent = ROBLOX_STAGE_NAMES[Math.min(this.stageIdx, 8)];
    }

    if (robuxEl) {
      robuxEl.textContent = `${this.robuxCoins} R$`;
    }

    if (heartsEl) {
      let heartsHtml = '';
      for (let i = 0; i < 3; i++) {
        heartsHtml += i < this.hearts ? '❤️' : '🖤';
      }
      heartsEl.innerHTML = heartsHtml;
    }

    if (comboEl) {
      if (this.combo >= 2) {
        comboEl.className = 'combo-badge-active';
        comboEl.textContent = `🔥 COMBO x${this.combo}`;
      } else {
        comboEl.className = 'hidden';
      }
    }

    if (progressFill) {
      const pct = ((this.stageIdx + 1) / 9) * 100;
      progressFill.style.width = `${Math.min(pct, 100)}%`;
    }
  }

  showToastBanner(msg) {
    let banner = document.getElementById('toast-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'toast-banner';
      document.body.appendChild(banner);
    }
    banner.className = 'toast-banner-active';
    banner.textContent = msg;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      banner.className = 'hidden';
    }, 2800);
  }

  // ----------------------------------------------------
  // 9. 闖關通關與結算
  // ----------------------------------------------------
  handleGameWin() {
    robloxAudio.playFanfare();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    let modal = document.getElementById('game-result-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-result-modal';
      document.body.appendChild(modal);
    }

    const accuracy = Math.round(((9 - this.wrongQuestions.length) / 9) * 100) || 100;

    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card win-modal-card">
        <h2 style="color: #facc15; font-size: 26px; margin: 0 0 10px;">🏆 恭喜征服 Roblox 螺旋跑酷神塔！</h2>
        <p style="color: #e2e8f0; font-size: 15px;">
          你以精準的數學、國語與生活科實力，一路飛躍致命雷射，榮登 Bloxy 跑酷王寶座！
        </p>

        <div class="result-stats-grid">
          <div class="stat-box">
            <div class="stat-num">${this.score}</div>
            <div class="stat-label">總積分 🌟</div>
          </div>
          <div class="stat-box">
            <div class="stat-num">${this.maxCombo}</div>
            <div class="stat-label">最大連擊 🔥</div>
          </div>
          <div class="stat-box">
            <div class="stat-num">${this.robuxCoins} R$</div>
            <div class="stat-label">目前 R$ 蘿蔔幣 🪙</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
          <button type="button" class="action-btn" id="btn-download-hero-card" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff;">
            🎴 匯出 Bloxy 跑酷王英雄卡 (PNG)
          </button>
          <button type="button" class="action-btn" id="btn-replay-game" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff;">
            🔄 再戰一場跑酷
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-download-hero-card').onclick = () => {
      generateAndDownloadRobloxCard({
        playerName: this.playerName,
        score: this.score,
        maxCombo: this.maxCombo,
        robuxCoins: this.robuxCoins,
        equippedGearName: ROBLOX_SHOP_ITEMS.find(g => g.id === this.equippedGear)?.name || '疾跑線圈',
        petName: ROBLOX_PETS.find(p => p.id === this.equippedPet)?.name || 'Doge 柴犬'
      });
    };

    document.getElementById('btn-replay-game').onclick = () => {
      modal.className = 'modal-overlay hidden';
      this.startNewGame(this.currentMode);
    };
  }

  handleGameOver() {
    let modal = document.getElementById('game-result-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'game-result-modal';
      document.body.appendChild(modal);
    }

    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card gameover-card">
        <h2 style="color: #ef4444; font-size: 24px; margin: 0 0 10px;">💀 OOF! 跌落雲端！</h2>
        <p style="color: #cbd5e1; font-size: 14px;">
          愛心已耗盡！不過別灰心，所有答錯的題目都已自動收錄在「錯題本」中，隨時可針對弱點重練！
        </p>

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 18px;">
          <button type="button" class="action-btn" id="btn-review-mistakes" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff;">
            📖 複習錯題本 (${this.wrongQuestionIds.size} 題)
          </button>
          <button type="button" class="action-btn" id="btn-retry-obby" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff;">
            🔄 重新開始跑酷
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-review-mistakes').onclick = () => {
      modal.className = 'modal-overlay hidden';
      this.startNewGame('mistakes');
    };

    document.getElementById('btn-retry-obby').onclick = () => {
      modal.className = 'modal-overlay hidden';
      this.startNewGame(this.currentMode);
    };
  }

  // ----------------------------------------------------
  // 10. 齒輪道具商店與神獸盲盒視窗
  // ----------------------------------------------------
  openGearShopModal() {
    let modal = document.getElementById('gear-shop-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gear-shop-modal';
      document.body.appendChild(modal);
    }

    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card shop-card" style="max-width: 680px;">
        <h2 class="modal-title" style="color: #38bdf8;">🛍️ ROBLOX 裝備特技商店</h2>
        <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 12px;">
          目前擁有：<b style="color: #facc15; font-size: 20px;">${this.robuxCoins} R$ 蘿蔔幣</b>
        </p>

        <div class="shop-grid" id="gear-shop-items"></div>

        <button type="button" class="action-btn" id="btn-close-gear-shop" style="margin-top: 16px;">
          關閉商店 ❌
        </button>
      </div>
    `;

    const container = document.getElementById('gear-shop-items');
    ROBLOX_SHOP_ITEMS.forEach(item => {
      const owned = this.unlockedGears.includes(item.id);
      const equipped = this.equippedGear === item.id;
      const canAfford = this.robuxCoins >= item.price;

      const card = document.createElement('div');
      card.className = `shop-item ${equipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="shop-item-title">${item.name}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button type="button" class="shop-buy-btn" ${equipped || (!owned && !canAfford) ? 'disabled' : ''}>
          ${equipped ? '✅ 裝備中' : owned ? '切換裝備' : `🪙 ${item.price} R$ 購買`}
        </button>
      `;

      const btn = card.querySelector('.shop-buy-btn');
      btn.onclick = () => {
        if (!owned && canAfford) {
          this.robuxCoins -= item.price;
          this.unlockedGears.push(item.id);
          this.equippedGear = item.id;
          this.savePlayerSave();
          this.world.equipGear(item.id);
          this.openGearShopModal(); // 刷新
          this.updateHUD();
        } else if (owned && !equipped) {
          this.equippedGear = item.id;
          this.savePlayerSave();
          this.world.equipGear(item.id);
          this.openGearShopModal();
          this.updateHUD();
        }
      };

      container.appendChild(card);
    });

    document.getElementById('btn-close-gear-shop').onclick = () => {
      modal.className = 'modal-overlay hidden';
    };
  }

  // ----------------------------------------------------
  // 11. 全局事件監聽
  // ----------------------------------------------------
  setupEvents() {
    // 鍵盤 A / S / D 答題
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toUpperCase();
      let optIdx = -1;
      if (key === 'A') optIdx = 0;
      else if (key === 'S') optIdx = 1;
      else if (key === 'D') optIdx = 2;

      if (optIdx !== -1 && !this.eliminatedIndices.has(optIdx)) {
        const q = this.questions[this.currentQuestionIdx];
        if (q && q.options[optIdx]) {
          this.handleAnswer(q.options[optIdx], optIdx);
        }
      }
    });

    // 商店按鈕
    document.getElementById('btn-open-gear-shop')?.addEventListener('click', () => {
      this.openGearShopModal();
    });

  openPetBuildModal(lastWonPet = null) {
    openPetAndBuildModal({
      edition: 'roblox',
      currency: this.robuxCoins,
      unlockedPets: this.unlockedPets,
      equippedPet: this.equippedPet,
      unlockedBuilds: this.unlockedBuilds,
      lastWonPet,
      onPullGacha: (wonPet, cost) => {
        this.robuxCoins -= cost;
        this.unlockedPets.push(wonPet.id);
        this.equippedPet = wonPet.id;
        this.savePlayerSave();
        this.world.setPetCompanion(wonPet.id);
        this.updateHUD();
        this.openPetBuildModal(wonPet);
      },
      onEquipPet: petId => {
        this.equippedPet = petId;
        this.savePlayerSave();
        this.world.setPetCompanion(petId);
        this.updateHUD();
        this.openPetBuildModal();
      },
      onBuyBuild: buildItem => {
        this.robuxCoins -= buildItem.price;
        this.unlockedBuilds.push(buildItem.id);
        this.savePlayerSave();
        this.world.updateTowerDecorations(this.unlockedBuilds);
        this.updateHUD();
        this.openPetBuildModal();
      }
    });
  }

  // ----------------------------------------------------
  // 11. 全局事件監聽
  // ----------------------------------------------------
  setupEvents() {
    // 鍵盤 A / S / D 答題
    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toUpperCase();
      let optIdx = -1;
      if (key === 'A') optIdx = 0;
      else if (key === 'S') optIdx = 1;
      else if (key === 'D') optIdx = 2;

      if (optIdx !== -1 && !this.eliminatedIndices.has(optIdx)) {
        const q = this.questions[this.currentQuestionIdx];
        if (q && q.options[optIdx]) {
          this.handleAnswer(q.options[optIdx], optIdx);
        }
      }
    });

    // 商店按鈕
    document.getElementById('btn-open-gear-shop')?.addEventListener('click', () => {
      this.openGearShopModal();
    });

    // 盲盒與神塔建造按鈕
    document.getElementById('btn-open-pet-build')?.addEventListener('click', () => {
      this.openPetBuildModal();
    });

    // 科目單元選單切換
    document.getElementById('unit-filter-select')?.addEventListener('change', e => {
      this.startNewGame(e.target.value);
    });

    // 重新開始
    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
      this.startNewGame(this.currentMode);
    });
  }

  // ----------------------------------------------------
  // 12. 渲染迴圈
  // ----------------------------------------------------
  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (this.world) {
      this.world.update(delta);
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
