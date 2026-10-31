/**
 * 3D 麥塊方塊冒險版 (Minecraft Edition)：主遊戲引擎
 * - 100% 獨立錢包與獨立存檔 (g2_mc_emeralds, g2_mc_weapons, g2_mc_equipped, g2_mc_wrong_ids, g2_mc_seen_ids)
 * - 100% 共用康軒國語 50 題、翰林數學 50 題與蘇格拉底三階段引導教學
 * - 包含：三大生態域與體素魔王、紅石活塞尺、動力鐵軌礦車連鎖、3x3 工作台與村民圖書管理員引導
 */
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { getGameQuestions, shuffleArray, QUESTION_MAP } from './curriculum.js';
import { MinecraftWorld } from './minecraftWorld.js';
import { mcSound } from './minecraftAudio.js';
import { buildGuidedCoachingData } from './guidedTeaching.js';
import {
  renderRedstoneRulerWidget,
  renderMinecartChainWidget,
  renderMcShadowLabWidget,
  renderCraftingTableGrid,
  generateAndDownloadMinecraftCard
} from './minecraftSpecialModes.js';

const MC_BOSS_STAGES = [
  { name: '🧟 綠茵平原：巨型苦力怕隊長', stageIdx: 0 },
  { name: '🔥 熾熱下界：烈焰使者王', stageIdx: 1 },
  { name: '🐉 終界之巔：終界黑龍王', stageIdx: 2 }
];

const ANVIL_SHOP_ITEMS = [
  {
    id: 'wood_pick',
    name: '🪵 新手木鎬',
    price: 0,
    desc: '基礎橡木十字鎬，陪伴新手勇者踏出第一步。'
  },
  {
    id: 'gold_sword',
    name: '⚔️ 附魔黃金劍',
    price: 60,
    desc: '閃耀金光的附魔神劍！紅石超載暴擊區擴大 50%！'
  },
  {
    id: 'diamond_pick',
    name: '⛏️ 鑽石神鎬',
    price: 120,
    desc: '堅不可摧的鑽石十字鎬！答對保底強化重擊以上，每題額外 +15 🟢！'
  },
  {
    id: 'netherite_trident',
    name: '🔱 獄髓雷電三叉戟',
    price: 200,
    desc: '傳說級終界神兵！答對 100% 必出三倍紅石大爆擊，且綠寶石獎勵雙倍！'
  }
];

export class MinecraftGameEngine {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.currentMode = 'all';
    this.questions = [];
    this.wrongQuestions = [];
    this.seenQuestionIds = new Set();
    this.currentQuestionIdx = 0;
    this.isCraftingGridActive = false;

    // 載入麥塊版獨立存檔 (初次遊玩贈送 40 顆綠寶石 🟢)
    this.loadPlayerSave();

    this.totalDamage = 0;
    this.hearts = 3;
    this.hits = 0;
    this.critCount = 0;
    this.combo = 0;
    this.isTntActive = false;
    this.usedPotionThisTurn = false;
    this.mistakesThisTurn = 0;
    this.eliminatedIndices = new Set();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;

    this.isAnimating = false;
    this.clock = new THREE.Clock();
    this.redstonePos = 0.5;
    this.redstoneDir = 1;

    this.defaultCamPos = new THREE.Vector3(0, 6.2, 28.5);
    this.defaultCamLook = new THREE.Vector3(0, 3.0, 4);
    this.currentCamLook = this.defaultCamLook.clone();

    this.animTimer = null;
    this.feedbackTimer = null;
    this.bannerTimer = null;

    this.initThree();
    this.world = new MinecraftWorld(this.scene);
    this.world.equipWeaponSkin(this.equippedWeapon);
    this.world.updateHeroCapeNumber(this.heroId);
    this.setupEvents();
    this.startNewGame('all');
    this.animate();
  }

  loadPlayerSave() {
    try {
      const savedEmeralds = localStorage.getItem('g2_mc_emeralds');
      this.emeralds = savedEmeralds !== null ? parseInt(savedEmeralds, 10) : 40;
      const savedWeapons = localStorage.getItem('g2_mc_weapons');
      this.unlockedWeapons = savedWeapons ? JSON.parse(savedWeapons) : ['wood_pick'];
      this.equippedWeapon = localStorage.getItem('g2_mc_equipped') || 'wood_pick';

      this.playerName = localStorage.getItem('g2_mc_player_name') || '鑽石小勇者';
      this.heroId = localStorage.getItem('g2_mc_hero_id') || '99';

      const savedWrongIds = localStorage.getItem('g2_mc_wrong_ids');
      if (savedWrongIds) {
        const ids = JSON.parse(savedWrongIds);
        this.wrongQuestions = ids.map(id => QUESTION_MAP.get(id)).filter(Boolean);
      }

      const savedSeenIds = localStorage.getItem('g2_mc_seen_ids');
      if (savedSeenIds) {
        this.seenQuestionIds = new Set(JSON.parse(savedSeenIds));
      }
    } catch {
      this.emeralds = 40;
      this.unlockedWeapons = ['wood_pick'];
      this.equippedWeapon = 'wood_pick';
      this.playerName = '鑽石小勇者';
      this.heroId = '99';
    }
  }

  savePlayerData() {
    try {
      localStorage.setItem('g2_mc_emeralds', String(this.emeralds));
      localStorage.setItem('g2_mc_weapons', JSON.stringify(this.unlockedWeapons));
      localStorage.setItem('g2_mc_equipped', this.equippedWeapon);
      localStorage.setItem('g2_mc_player_name', this.playerName);
      localStorage.setItem('g2_mc_hero_id', String(this.heroId));
      localStorage.setItem('g2_mc_wrong_ids', JSON.stringify(this.wrongQuestions.map(q => q.id)));
      localStorage.setItem('g2_mc_seen_ids', JSON.stringify(Array.from(this.seenQuestionIds)));
    } catch {
      // 忽略無痕模式寫入限制
    }
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8);
    this.scene.fog = new THREE.Fog(0x7dd3fc, 38, 95);

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);
    this.camera.position.copy(this.defaultCamPos);
    this.camera.lookAt(this.defaultCamLook);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  clearTimers() {
    if (this.animTimer) { clearInterval(this.animTimer); this.animTimer = null; }
    if (this.feedbackTimer) { clearTimeout(this.feedbackTimer); this.feedbackTimer = null; }
    if (this.bannerTimer) { clearTimeout(this.bannerTimer); this.bannerTimer = null; }
  }

  startNewGame(mode = 'all') {
    this.clearTimers();
    this.isAnimating = false;
    this.isTntActive = false;
    this.usedPotionThisTurn = false;
    this.currentMode = mode;

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) modeSelect.value = mode;

    this.totalDamage = 0;
    this.hearts = 3;
    this.hits = 0;
    this.critCount = 0;
    this.combo = 0;
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

    this.updateStatusBarUI();
    document.getElementById('final-modal').classList.add('hidden');
    document.getElementById('feedback-modal').classList.add('hidden');
    document.getElementById('big-banner').classList.add('banner-hidden');

    this.loadQuestion(0);
  }

  updateStatusBarUI() {
    document.getElementById('hud-dmg').textContent = this.totalDamage;
    document.getElementById('hud-emeralds').textContent = this.emeralds;
    document.getElementById('hud-combo').textContent = `COMBO x${this.combo}`;

    const heroBadge = document.getElementById('hud-hero-badge');
    if (heroBadge) heroBadge.textContent = `#${this.heroId}`;

    for (let i = 1; i <= 3; i++) {
      const heartEl = document.getElementById(`heart-${i}`);
      if (heartEl) heartEl.classList.toggle('lost', i > this.hearts);
    }

    const toolObj = ANVIL_SHOP_ITEMS.find(w => w.id === this.equippedWeapon) || ANVIL_SHOP_ITEMS[0];
    document.getElementById('hud-tool-name').textContent = `手持：${toolObj.name}`;

    const wrongBtn = document.getElementById('btn-wrong-mode');
    if (this.wrongQuestions.length > 0) {
      wrongBtn.classList.remove('hidden');
      wrongBtn.textContent = `🎯 錯題 (${this.wrongQuestions.length})`;
    } else {
      wrongBtn.classList.add('hidden');
    }

    const btnPotion = document.getElementById('btn-skill-potion');
    const btnTnt = document.getElementById('btn-skill-tnt');
    const btnCraft = document.getElementById('btn-toggle-craft');

    if (btnPotion) btnPotion.disabled = this.emeralds < 20 || this.usedPotionThisTurn || this.isAnimating;
    if (btnTnt) {
      btnTnt.disabled = this.emeralds < 40 || this.isTntActive || this.isAnimating;
      btnTnt.classList.toggle('active-tnt', this.isTntActive);
    }
    if (btnCraft) {
      btnCraft.classList.toggle('active-craft', this.isCraftingGridActive);
      btnCraft.textContent = this.isCraftingGridActive ? '🛠️ 3×3 合成台：開啟中' : '🛠️ 3×3 合成台：關閉';
    }
  }

  escapeHTML(rawText) {
    return String(rawText)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  formatQuestionHTML(rawText) {
    return this.escapeHTML(rawText).replace(/\[([^\]]+)\]/g, '<span class="highlight-char">$1</span>');
  }

  /**
   * 將共用題庫 hitResult 中的棒球轉播前綴轉換為麥塊採礦語境，保留完整迷思診斷說明
   */
  formatMcHitResult(rawHitResult, isCorrect = false) {
    const text = String(rawHitResult || '').trim();
    if (isCorrect) {
      return '💎 精準挖出傳奇寶石礦脈！紅石能量直擊魔王！';
    }
    const parts = text.split('！').map(s => s.trim()).filter(Boolean);
    const baseballKeywords = /全壘打|安打|揮棒|揮空|三振|滾地|接殺|封殺|刺殺|雙殺|界外|好球|球路|出棒|擦棒|看台|外野|內野|游擊|投手|捕手|保送/;
    const diagnosticParts = parts.filter(p => !baseballKeywords.test(p));
    if (diagnosticParts.length > 0) {
      return `💥 誤敲陷阱偽裝石！${diagnosticParts.join('！')}！`;
    }
    return '💥 誤敲陷阱偽裝石！請看清楚題目關鍵字再試一次！';
  }

  getSpokenQuestionText(q) {
    if (!q) return '';
    if ((q.unit && q.unit.includes('多音字')) || (q.question && q.question.includes('讀音'))) {
      return `${q.subject}，${q.unit}。請看螢幕上的句子，選出重點框裡國字的正確讀音！`;
    }
    const cleanQuestion = q.question.replace(/\[([^\]]+)\]/g, '$1');
    return `${q.subject}，${cleanQuestion}`;
  }

  showBigBanner(mainText, subText = '', color = '#4ade80') {
    const banner = document.getElementById('big-banner');
    const mainEl = document.getElementById('banner-main');
    const statEl = document.getElementById('banner-statcast');

    mainEl.textContent = mainText;
    mainEl.style.color = color;
    if (subText) {
      statEl.textContent = subText;
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
    this.usedPotionThisTurn = false;
    this.mistakesThisTurn = 0;
    this.eliminatedIndices = new Set();
    this.isGuidedRetryPending = false;
    this.lastGuideData = null;
    const q = this.questions[idx];

    const bossStage = Math.min(2, Math.floor(idx / 3));
    const bossInfo = MC_BOSS_STAGES[bossStage];
    document.getElementById('hud-boss').textContent = bossInfo.name;
    document.getElementById('hud-stage').textContent = `第 ${idx + 1} / ${this.questions.length} 關`;
    this.world.setBiomeAndBossStage(bossStage);

    document.getElementById('hud-subject').textContent = `【${q.subject}】${q.unit}`;
    document.getElementById('hud-question').innerHTML = this.formatQuestionHTML(q.question);
    const phoneticEl = document.getElementById('hud-phonetic');
    phoneticEl.textContent = q.phonetic || '';
    phoneticEl.className = '';

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const oreNames = ['💎 左側鑽石礦 [A]', '🪙 中央黃金礦 [S]', '🟢 右側綠寶石礦 [D]'];
    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'ore-btn';
      btn.dataset.idx = optIdx;
      btn.innerHTML = `
        <span class="ore-zone">${oreNames[optIdx]}</span>
        <span class="ore-text">${this.escapeHTML(opt.text)}</span>
      `;
      btn.onclick = () => this.handleMineBlock(opt, optIdx);
      optionsContainer.appendChild(btn);
    });

    // 數學第 3 單元：紅石活塞方塊尺
    renderRedstoneRulerWidget(
      document.getElementById('ruler-widget-container'),
      q,
      () => mcSound.playDigSound()
    );

    // 數學第 4 單元：動力鐵軌礦車兩步驟連鎖
    renderMinecartChainWidget(
      document.getElementById('minecart-chain-container'),
      q,
      (step1Val) => {
        this.emeralds += 10;
        this.savePlayerData();
        this.updateStatusBarUI();
        mcSound.playMineSuccessSound(false);
        this.showBigBanner(`🛤️ 礦車衝過第一站！(${step1Val})`, '🟢 +10 綠寶石獎勵！快揮鎬完成第二步！', '#facc15');
      }
    );

    // 生活第 2 單元：麥塊方塊日晷與紅石光影實驗台
    renderMcShadowLabWidget(
      document.getElementById('shadow-lab-container'),
      q,
      () => mcSound.playDigSound()
    );

    this.refreshCraftingGrid();
    this.resetHeroAndOres();
    this.updateStatusBarUI();
    mcSound.speakText(this.getSpokenQuestionText(q));
  }

  refreshCraftingGrid() {
    const overlay = document.getElementById('crafting-overlay');
    const gridEl = document.getElementById('crafting-grid');
    const q = this.questions[this.currentQuestionIdx];
    if (!overlay || !gridEl || !q) return;

    if (!this.isCraftingGridActive) {
      overlay.classList.add('hidden');
      return;
    }

    overlay.classList.remove('hidden');
    renderCraftingTableGrid(
      gridEl,
      q,
      this.eliminatedIndices,
      (opt, optIdx) => this.handleMineBlock(opt, optIdx),
      (decoyLabel) => {
        mcSound.playDigSound();
        this.showBigBanner('🧱 合成配方錯誤！', `「${decoyLabel}」是普通石頭，請選三個主礦脈中的答案！`, '#f97316');
      }
    );
  }

  resetHeroAndOres() {
    this.world.heroGroup.position.set(0, 0, 21.5);
    this.world.armPivot.rotation.x = 0;
    if (this.world.heroGroup.feverAura) {
      this.world.heroGroup.feverAura.visible = this.isTntActive;
    }
    this.world.projectile.visible = false;
    this.world.updateOreBlockStates(this.eliminatedIndices);
  }

  // 使用「🧪 真視藥水」石化一個錯誤礦脈
  useSightPotion() {
    if (this.emeralds < 20 || this.usedPotionThisTurn || this.isAnimating) return;
    const q = this.questions[this.currentQuestionIdx];
    const buttons = Array.from(document.querySelectorAll('.ore-btn'));
    const wrongBtns = buttons.filter((b, i) => !q.options[i].isCorrect && !b.disabled);
    if (wrongBtns.length === 0) return;

    this.emeralds -= 20;
    this.usedPotionThisTurn = true;
    this.savePlayerData();

    const targetBtn = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
    const targetIdx = Number(targetBtn.dataset.idx);
    this.eliminatedIndices.add(targetIdx);
    targetBtn.disabled = true;
    targetBtn.classList.add('eliminated-opt');

    this.world.updateOreBlockStates(this.eliminatedIndices);
    this.refreshCraftingGrid();
    mcSound.playDigSound();
    this.updateStatusBarUI();
  }

  // 使用「🧨 超級 TNT 充能」
  useSuperTnt() {
    if (this.emeralds < 40 || this.isTntActive || this.isAnimating) return;
    this.emeralds -= 40;
    this.isTntActive = true;
    this.savePlayerData();

    if (this.world.heroGroup.feverAura) {
      this.world.heroGroup.feverAura.visible = true;
    }
    mcSound.playAnvilLevelUp();
    this.showBigBanner('🧨 超級 TNT 充能完畢！', '本回合必出 3 倍紅石超載大爆擊！', '#ef4444');
    this.updateStatusBarUI();
  }

  evaluateMiningTier() {
    if (this.isTntActive || this.equippedWeapon === 'netherite_trident') {
      return 3; // 3倍紅石超載暴擊
    }
    const dist = Math.abs(this.redstonePos - 0.5);
    const critRadius = this.equippedWeapon === 'gold_sword' ? 0.22 : 0.14;
    if (dist <= critRadius || this.combo >= 2) return 3;
    if (dist <= 0.28 || this.equippedWeapon === 'diamond_pick') return 2;
    return 1;
  }

  handleMineBlock(option, zoneIdx) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const buttons = document.querySelectorAll('.ore-btn, .mc-craft-slot');
    buttons.forEach(b => (b.disabled = true));

    mcSound.playDigSound();

    const targetOre = this.world.oreBlocks[zoneIdx];
    const startHeroPos = new THREE.Vector3(0, 0, 21.5);
    const destHeroPos = new THREE.Vector3(targetOre.position.x * 0.75, 0, 16.2);

    let progress = 0;
    this.animTimer = setInterval(() => {
      progress += 1 / 20;
      this.world.heroGroup.position.lerpVectors(startHeroPos, destHeroPos, progress);
      this.world.armPivot.rotation.x = -Math.sin(progress * Math.PI * 3) * 1.3;

      if (progress >= 1) {
        clearInterval(this.animTimer);
        this.animTimer = null;
        this.resolveMiningStrike(option, zoneIdx);
      }
    }, 16);
  }

  resolveMiningStrike(option, zoneIdx) {
    const currentQ = this.questions[this.currentQuestionIdx];
    const targetOre = this.world.oreBlocks[zoneIdx];

    if (option.isCorrect) {
      this.hits++;
      this.combo++;
      const tier = this.evaluateMiningTier();
      const isCrit = tier === 3;
      if (isCrit) this.critCount++;

      const dmgDealt = tier === 3 ? 250 + this.combo * 20 : tier === 2 ? 150 : 100;
      this.totalDamage += dmgDealt;

      let earnedEmeralds = tier === 3 ? 40 : tier === 2 ? 25 : 15;
      if (this.equippedWeapon === 'diamond_pick') earnedEmeralds += 15;
      if (this.equippedWeapon === 'netherite_trident') earnedEmeralds *= 2;
      this.emeralds += earnedEmeralds;

      this.isTntActive = false;
      if (this.mistakesThisTurn === 0) {
        this.wrongQuestions = this.wrongQuestions.filter(wq => wq.id !== currentQ.id);
      }
      this.savePlayerData();
      this.updateStatusBarUI();

      // 礦石爆裂特效與經驗球叮咚聲
      targetOre.visible = false;
      this.world.spawnOreShatterParticles(targetOre.position, true);
      mcSound.playMineSuccessSound(isCrit);

      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 380);

      let bannerTitle = '⛏️ 精準挖掘成功！';
      if (tier === 3) bannerTitle = '🧨 紅石 TNT 超載大爆擊！';
      else if (tier === 2) bannerTitle = '⚔️ 附魔重擊破防！';

      const statStr = `⚔️ 造成傷害：${dmgDealt} 點 ｜ 🟢 +${earnedEmeralds} 綠寶石`;
      this.showBigBanner(bannerTitle, statStr, isCrit ? '#fef08a' : '#4ade80');

      if (isCrit) {
        confetti({ particleCount: 90, spread: 85, origin: { y: 0.55 } });
      }

      const wasGuidedSuccess = this.mistakesThisTurn > 0;
      this.animateBossBeamAttack(targetOre.position, () => {
        const guidedPraise = wasGuidedSuccess
          ? `<div class="guide-step-card guide-step-think" style="margin-top:8px;">🌟 <b>合成卷軸破解成功！</b>你順著村莊圖書管理員的提示，靠自己挖出真鑽石了！<br>🎓 <b>完整觀念總結</b>：${this.escapeHTML(currentQ.hint)}</div>`
          : `<div style="margin-top:6px;color:#86efac;">🎓 <b>觀念解析</b>：${this.escapeHTML(currentQ.hint)}</div>`;
        const extraMsg = `<br>⚔️ <b>對魔王造成：${dmgDealt} 點傷害！</b><br>🟢 <b>獲得戰利品：+${earnedEmeralds} 綠寶石！</b>（連擊 COMBO x${this.combo}）${guidedPraise}`;

        this.showFeedbackModal(
          true,
          `<b>${bannerTitle}</b><br>${this.escapeHTML(this.formatMcHitResult(option.hitResult, true))}${extraMsg}`,
          wasGuidedSuccess
            ? `太棒了！經過圖書管理員引導，你成功挖出正確答案了！${currentQ.hint}`
            : `挖掘成功！對魔王造成 ${dmgDealt} 點傷害！`
        );
      });
    } else {
      // 答錯處理
      this.mistakesThisTurn++;
      if (!this.wrongQuestions.some(wq => wq.id === currentQ.id)) {
        this.wrongQuestions.push(currentQ);
        this.savePlayerData();
      }

      // 第一次敲錯：啟動「🧙‍♂️ 村莊圖書管理員蘇格拉底引導」，不扣愛心！
      if (this.mistakesThisTurn === 1) {
        mcSound.playCreeperHiss();
        if (this.eliminatedIndices.size === 0) {
          this.eliminatedIndices.add(zoneIdx);
        }
        this.usedPotionThisTurn = true;
        this.isGuidedRetryPending = true;
        this.world.updateOreBlockStates(this.eliminatedIndices);

        const guideData = buildGuidedCoachingData(currentQ, option);
        guideData.trapReason = this.formatMcHitResult(option.hitResult, false);
        this.lastGuideData = guideData;

        this.showBigBanner('🛡️ 盾牌格擋成功！苦力怕嘶嘶警告', '別慌張！聽完村莊圖書管理員引導再挖一次！', '#38bdf8');
        this.updateStatusBarUI();

        this.feedbackTimer = setTimeout(() => {
          this.showVillagerGuidedModal(guideData);
        }, 520);
        return;
      }

      // 第二次仍敲錯：苦力怕爆炸扣除 1 顆愛心，顯示完整解析
      mcSound.playExplosionSound();
      this.world.spawnOreShatterParticles(targetOre.position, false);
      this.combo = 0;
      this.hearts--;
      this.isTntActive = false;
      this.isGuidedRetryPending = false;

      let totemNotice = '';
      if (this.hearts <= 0) {
        totemNotice = '<br><br>🔱 <b>觸發「不死圖騰 (Totem of Undying)」！愛心全滿復活繼續挑戰！</b>';
        this.hearts = 3;
        this.showBigBanner('💥 苦力怕引爆！不死圖騰發動！', '', '#ef4444');
      } else {
        this.showBigBanner('💥 誤觸陷阱方塊！扣除 1 顆愛心 ❤️', '', '#ef4444');
      }

      this.updateStatusBarUI();
      const correctOpt = currentQ.options.find(o => o.isCorrect);
      const correctText = correctOpt ? correctOpt.text : '';

      this.feedbackTimer = setTimeout(() => {
        this.showFeedbackModal(
          false,
          `<div class="guide-step-card guide-step-trap"><b>🔍 誤敲假礦原因</b>：${this.escapeHTML(this.formatMcHitResult(option.hitResult, false))}</div>` +
          `<div class="guide-step-card guide-step-think">📚 <b>村莊圖書管理員完整解析</b>：<br>${this.escapeHTML(currentQ.hint)}</div>` +
          `<div class="guide-step-card guide-step-scaffold">✅ <b>真正的鑽石答案是：【${this.escapeHTML(correctText)}】</b>${totemNotice}</div>`,
          `苦力怕爆炸了！圖書管理員告訴你，${currentQ.hint} 正確答案是 ${correctText}`,
          `✅ 我學會了！正確答案是【${correctText}】⛏️`
        );
      }, 550);
    }
  }

  animateBossBeamAttack(startPos, onComplete) {
    const proj = this.world.projectile;
    proj.position.copy(startPos);
    proj.visible = true;
    const destPos = new THREE.Vector3(0, 5.2, -4);

    let t = 0;
    this.animTimer = setInterval(() => {
      t += 1 / 22;
      proj.position.lerpVectors(startPos, destPos, t);
      proj.rotation.x += 0.25;
      proj.rotation.y += 0.25;

      if (t >= 1) {
        clearInterval(this.animTimer);
        this.animTimer = null;
        proj.visible = false;
        this.world.spawnOreShatterParticles(destPos, true);
        onComplete();
      }
    }, 16);
  }

  openAnvilShop() {
    document.getElementById('shop-emerald-count').textContent = this.emeralds;
    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    ANVIL_SHOP_ITEMS.forEach(item => {
      const isUnlocked = this.unlockedWeapons.includes(item.id);
      const isEquipped = this.equippedWeapon === item.id;

      const card = document.createElement('div');
      card.className = `shop-item ${isEquipped ? 'equipped' : ''}`;

      let btnLabel = '';
      let btnDisabled = false;
      if (isEquipped) {
        btnLabel = '✅ 手持裝備中';
        btnDisabled = true;
      } else if (isUnlocked) {
        btnLabel = '裝備此神兵';
      } else {
        btnLabel = `🟢 ${item.price} 綠寶石鍛造`;
        btnDisabled = this.emeralds < item.price;
      }

      card.innerHTML = `
        <div class="shop-item-title">${item.name}</div>
        <div class="shop-item-desc">${item.desc}</div>
        <button class="shop-buy-btn" ${btnDisabled ? 'disabled' : ''}>${btnLabel}</button>
      `;

      card.querySelector('.shop-buy-btn').onclick = () => {
        if (!isUnlocked) {
          if (this.emeralds < item.price) return;
          this.emeralds -= item.price;
          this.unlockedWeapons.push(item.id);
          mcSound.playAnvilLevelUp();
        } else {
          mcSound.playDigSound();
        }
        this.equippedWeapon = item.id;
        this.world.equipWeaponSkin(item.id);
        this.savePlayerData();
        this.updateStatusBarUI();
        this.openAnvilShop();
      };

      container.appendChild(card);
    });

    document.getElementById('shop-modal').classList.remove('hidden');
  }

  showVillagerGuidedModal(guideData) {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    const nextBtn = document.getElementById('btn-next');

    title.textContent = '🧙‍♂️ 村莊圖書管理員・附魔卷軸引導';
    title.style.color = '#4ade80';

    msg.innerHTML = `
      <div class="guide-step-card guide-step-trap">
        <b>🔍 步驟一：為什麼剛才挖到假礦石？（你選了：${this.escapeHTML(guideData.selectedWrongText)}）</b><br>
        ${this.escapeHTML(guideData.trapReason)}
      </div>
      <div class="guide-step-card guide-step-think">
        <b>🧭 步驟二：圖書管理員帶你一步一步推導</b><br>
        ${this.escapeHTML(guideData.step1Question)}
      </div>
      <button type="button" class="btn-reveal-clue" id="btn-reveal-scaffold">
        📜 還是不太確定？點我展開「解題合成配方小錦囊」
      </button>
      <div class="guide-step-card guide-step-scaffold hidden" id="scaffold-secret-box">
        <b>🔑 步驟三：合成配方小錦囊（想想看【 ❓ 】是多少？）</b><br>
        ${this.escapeHTML(guideData.step2MaskedHint)}
      </div>
    `;

    nextBtn.textContent = '⛏️ 我想通了！回礦區挖出真正的鑽石 (空白鍵)';
    modal.classList.remove('hidden');

    const revealBtn = document.getElementById('btn-reveal-scaffold');
    const secretBox = document.getElementById('scaffold-secret-box');
    if (revealBtn && secretBox) {
      revealBtn.onclick = () => {
        secretBox.classList.remove('hidden');
        revealBtn.classList.add('hidden');
        const spoken = guideData.step2MaskedHint.replace(/【\s*❓\s*】|❓/g, '多少');
        mcSound.speakText(`合成配方提示：${spoken} 請回礦區選出正確答案！`);
      };
    }

    mcSound.speakText(`盾牌擋住苦力怕了！別灰心，圖書管理員帶你一起想：${guideData.step1Question}`);
  }

  retryCurrentQuestion() {
    document.getElementById('feedback-modal').classList.add('hidden');
    this.isAnimating = false;
    this.isGuidedRetryPending = false;
    this.resetHeroAndOres();

    if (this.lastGuideData) {
      const phoneticEl = document.getElementById('hud-phonetic');
      phoneticEl.textContent = `📜 村民引導：${this.lastGuideData.step2MaskedHint}`;
      phoneticEl.className = 'villager-live-banner';
    }

    const buttons = document.querySelectorAll('.ore-btn');
    buttons.forEach((btn, idx) => {
      if (this.eliminatedIndices.has(idx)) {
        btn.disabled = true;
        btn.classList.add('eliminated-opt');
      } else {
        btn.disabled = false;
      }
    });

    this.refreshCraftingGrid();
    this.updateStatusBarUI();
  }

  showFeedbackModal(isSuccess, messageHtml, speechText, customBtnText = '') {
    const modal = document.getElementById('feedback-modal');
    const title = document.getElementById('feedback-title');
    const msg = document.getElementById('feedback-msg');
    const nextBtn = document.getElementById('btn-next');

    title.textContent = isSuccess ? '💎 精采採礦攻擊 NICE MINE！' : '💥 苦力怕爆炸！觀念訂正時間';
    title.style.color = isSuccess ? '#4ade80' : '#ef4444';
    msg.innerHTML = messageHtml;
    nextBtn.textContent = customBtnText || '下一座礦脈 ⛏️ (空白鍵)';
    modal.classList.remove('hidden');

    mcSound.speakText(speechText);
  }

  handleFeedbackModalAction() {
    if (this.isGuidedRetryPending) {
      this.retryCurrentQuestion();
    } else {
      document.getElementById('feedback-modal').classList.add('hidden');
      this.isAnimating = false;
      this.isGuidedRetryPending = false;
      this.loadQuestion(this.currentQuestionIdx + 1);
    }
  }

  showFinalCard() {
    const modal = document.getElementById('final-modal');
    const acc = `${Math.round((this.hits / Math.max(1, this.questions.length)) * 100)}%`;
    document.getElementById('final-acc').textContent = acc;
    document.getElementById('final-crits').textContent = this.critCount;
    document.getElementById('final-dmg').textContent = this.totalDamage;

    const badge = document.getElementById('final-player-badge');
    if (badge) badge.textContent = `🛡️ 勇者：${this.playerName} ｜ 披風編號：#${this.heroId}`;

    let rankTitle = '🪵 新手採礦學徒';
    if (this.totalDamage >= 1600) rankTitle = '👑 終界屠龍傳奇戰神';
    else if (this.totalDamage >= 1000) rankTitle = '💎 鑽石紅石大宗師';
    else if (this.totalDamage >= 500) rankTitle = '⚔️ 下界烈焰皇家騎士';
    this.lastRankTitle = rankTitle;
    this.lastAcc = acc;
    document.getElementById('final-rank-title').textContent = `獲得稱號：${rankTitle}（綠寶石：🟢${this.emeralds}）`;

    const wrongSummary = document.getElementById('final-wrong-summary');
    const finalWrongBtn = document.getElementById('btn-final-wrong');

    if (this.wrongQuestions.length > 0) {
      wrongSummary.innerHTML = `📋 目前麥塊錯題地牢共有 <b style="color:#f87171">${this.wrongQuestions.length} 座礦脈</b> 待征服，快進「錯題地牢」把它們全數挖開！`;
      finalWrongBtn.classList.remove('hidden');
    } else {
      wrongSummary.innerHTML = `🎉 <b>完美零失誤擊敗終界黑龍！你已經稱霸期中考麥塊大陸！</b>`;
      finalWrongBtn.classList.add('hidden');
    }

    confetti({ particleCount: 160, spread: 110, origin: { y: 0.5 } });
    modal.classList.remove('hidden');
    mcSound.speakText(`冒險完成！${this.playerName}總共對魔王造成 ${this.totalDamage} 點傷害！`);
  }

  setupEvents() {
    document.getElementById('btn-speak').onclick = () => {
      const q = this.questions[this.currentQuestionIdx];
      if (q) mcSound.speakText(this.getSpokenQuestionText(q));
    };

    const muteBtn = document.getElementById('btn-mute');
    muteBtn.onclick = () => {
      mcSound.isMuted = !mcSound.isMuted;
      if (mcSound.isMuted) mcSound.stopSpeech();
      muteBtn.textContent = mcSound.isMuted ? '🔇' : '🔊';
    };

    document.getElementById('btn-open-shop').onclick = () => this.openAnvilShop();
    document.getElementById('btn-close-shop').onclick = () => {
      document.getElementById('shop-modal').classList.add('hidden');
    };

    const profileModal = document.getElementById('profile-modal');
    document.getElementById('btn-open-profile').onclick = () => {
      document.getElementById('input-player-name').value = this.playerName;
      document.getElementById('input-hero-id').value = this.heroId;
      profileModal.classList.remove('hidden');
    };
    document.getElementById('btn-close-profile').onclick = () => {
      profileModal.classList.add('hidden');
    };
    document.getElementById('btn-save-profile').onclick = () => {
      const nameVal = document.getElementById('input-player-name').value.trim();
      const idVal = document.getElementById('input-hero-id').value.trim();
      this.playerName = nameVal || '鑽石小勇者';
      const parsed = parseInt(idVal, 10);
      this.heroId = !isNaN(parsed) && parsed >= 0 && parsed <= 99 ? String(parsed) : '99';
      this.world.updateHeroCapeNumber(this.heroId);
      this.savePlayerData();
      this.updateStatusBarUI();
      profileModal.classList.add('hidden');
      mcSound.playAnvilLevelUp();
      this.showBigBanner(`🛡️ ${this.playerName} #${this.heroId} 披風換裝完成！`, '', '#4ade80');
    };

    document.getElementById('btn-toggle-craft').onclick = () => {
      this.isCraftingGridActive = !this.isCraftingGridActive;
      this.refreshCraftingGrid();
      this.updateStatusBarUI();
      mcSound.playDigSound();
    };

    document.getElementById('btn-download-card').onclick = () => {
      const toolObj = ANVIL_SHOP_ITEMS.find(w => w.id === this.equippedWeapon) || ANVIL_SHOP_ITEMS[0];
      const modeSelect = document.getElementById('select-mode');
      const modeLabel = modeSelect?.selectedOptions?.[0]?.textContent || '綜合大冒險';
      generateAndDownloadMinecraftCard({
        playerName: this.playerName,
        heroId: this.heroId,
        rankTitle: this.lastRankTitle || '🪵 新手採礦學徒',
        accuracy: this.lastAcc || '100%',
        crits: this.critCount,
        damage: this.totalDamage,
        emeralds: this.emeralds,
        weaponName: toolObj.name,
        modeLabel
      });
    };

    document.getElementById('btn-skill-potion').onclick = () => this.useSightPotion();
    document.getElementById('btn-skill-tnt').onclick = () => this.useSuperTnt();
    document.getElementById('btn-next').onclick = () => this.handleFeedbackModalAction();
    document.getElementById('btn-restart').onclick = () => {
      this.startNewGame(this.currentMode === 'wrong' ? 'all' : this.currentMode);
    };

    const startWrongDungeon = () => {
      if (this.wrongQuestions.length > 0) this.startNewGame('wrong');
    };
    document.getElementById('btn-wrong-mode').onclick = startWrongDungeon;
    document.getElementById('btn-final-wrong').onclick = startWrongDungeon;

    const modeSelect = document.getElementById('select-mode');
    if (modeSelect) {
      modeSelect.onchange = (e) => {
        e.target.blur();
        this.startNewGame(e.target.value);
      };
    }

    window.addEventListener('keydown', (e) => {
      if (!profileModal.classList.contains('hidden')) {
        if (e.key === 'Escape') profileModal.classList.add('hidden');
        return;
      }
      const shopModal = document.getElementById('shop-modal');
      if (!shopModal.classList.contains('hidden')) {
        if (e.key === 'Escape' || e.key === 'Enter') shopModal.classList.add('hidden');
        return;
      }
      const feedbackModal = document.getElementById('feedback-modal');
      if (!feedbackModal.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleFeedbackModalAction();
        }
        return;
      }
      const finalModal = document.getElementById('final-modal');
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

      const btns = document.querySelectorAll('.ore-btn');
      if (key === 'A' && q.options[0] && !btns[0]?.disabled) this.handleMineBlock(q.options[0], 0);
      if (key === 'S' && q.options[1] && !btns[1]?.disabled) this.handleMineBlock(q.options[1], 1);
      if (key === 'D' && q.options[2] && !btns[2]?.disabled) this.handleMineBlock(q.options[2], 2);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    if (!this.isAnimating) {
      this.redstonePos += 0.014 * this.redstoneDir;
      if (this.redstonePos >= 0.98) { this.redstonePos = 0.98; this.redstoneDir = -1; }
      if (this.redstonePos <= 0.02) { this.redstonePos = 0.02; this.redstoneDir = 1; }
      const cursor = document.getElementById('redstone-cursor');
      if (cursor) cursor.style.left = `${this.redstonePos * 100}%`;

      this.world.armPivot.rotation.x = Math.sin(elapsed * 4) * 0.12;
    }

    this.world.updateEffects(elapsed);
    this.renderer.render(this.scene, this.camera);
  }
}
