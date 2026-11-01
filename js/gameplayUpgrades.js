/**
 * 5.0 雙版本核心玩法升級模組 (Action QTE + Roguelike 肉鴿天賦卡 + 3D 寵物盲盒與世界建造 + 飛天動態靶心)
 * 同時支援：
 * - 棒球版 (index.html / game.js)
 * - 麥塊版 (minecraft.html / minecraftGame.js)
 */

// ==========================================
// 1. ⚾ 棒球版：3D 寵物盲盒與球場擴建目錄
// ==========================================
export const BASEBALL_PETS = [
  {
    id: 'shiba',
    name: '🐕 黃金柴犬球僮',
    icon: '🐕',
    rarity: 'SR',
    desc: '站在打擊區旁幫你撿球加油！每次安打額外叼回 +15 金幣！',
    bonusCoins: 15,
    bonusDist: 0,
    qteBonus: 0
  },
  {
    id: 'dino',
    name: '🦖 暴龍強打教練',
    icon: '🦖',
    rarity: 'SSR',
    desc: '超霸氣 3D 綠暴龍！全壘打飛行距離 +25 公尺，每棒額外 +20 金幣！',
    bonusCoins: 20,
    bonusDist: 25,
    qteBonus: 0.1
  },
  {
    id: 'robo',
    name: '🤖 機甲雷達捕手',
    icon: '🤖',
    rarity: 'SSR',
    desc: '高科機甲夥伴！魔球手動揮棒 QTE 完美紅心區擴大 40%，每棒 +20 金幣！',
    bonusCoins: 20,
    bonusDist: 10,
    qteBonus: 0.4
  },
  {
    id: 'minidragon',
    name: '🐉 迷你烈焰神龍',
    icon: '🐉',
    rarity: 'UR',
    desc: '傳說級 3D 飛龍夥伴！每棒額外 +35 金幣、飛行距離 +35m，保底二壘打以上！',
    bonusCoins: 35,
    bonusDist: 35,
    qteBonus: 0.35
  }
];

export const BASEBALL_STADIUM_BUILDS = [
  {
    id: 'ferris_wheel',
    name: '🎡 外野摩天輪樂園',
    price: 70,
    desc: '在左外野蓋一座會轉動的 3D 彩色摩天輪！每棒門票收入 +10 金幣！',
    bonusCoins: 10
  },
  {
    id: 'fire_towers',
    name: '🎆 黃金噴火煙火塔',
    price: 110,
    desc: '外野雙側矗立 3D 黃金聖火塔！每次得分額外獎勵 +15 金幣！',
    bonusCoins: 15
  },
  {
    id: 'ufo_blimp',
    name: '🛸 外星飛碟轉播艇',
    price: 150,
    desc: '召喚 3D 發光外星飛碟在球場上空盤旋！每棒外星贊助 +25 金幣！',
    bonusCoins: 25
  },
  {
    id: 'gold_statue',
    name: '👑 傳奇名人堂黃金雕像',
    price: 200,
    desc: '在右外野立起巨型純金打者雕像！每棒額外 +35 金幣且出場自帶一壘跑者！',
    bonusCoins: 35
  }
];

// ==========================================
// 2. ⛏️ 麥塊版：3D 體素寵物與家園基地建築目錄
// ==========================================
export const MC_PETS = [
  {
    id: 'fox',
    name: '🦊 像素紅石小狐狸',
    icon: '🦊',
    rarity: 'SR',
    desc: '超萌 3D 麥塊小狐狸！每題答對自動幫你叼回 +15 綠寶石 🟢！',
    bonusEmeralds: 15,
    bonusDmg: 30,
    clickDmg: 5
  },
  {
    id: 'iron_golem',
    name: '🤖 村莊鐵魔像保鑣',
    icon: '🤖',
    rarity: 'SSR',
    desc: '高大威猛的 3D 鐵魔像！每次答對幫你揮出鐵拳重擊魔王 +90 傷害！',
    bonusEmeralds: 15,
    bonusDmg: 90,
    clickDmg: 10
  },
  {
    id: 'wolf',
    name: '🐺 馴服鑽石戰狼',
    icon: '🐺',
    rarity: 'SSR',
    desc: '身穿鑽石鎧甲的戰狼！狂暴連擊時每點一下額外追加 +20 撕咬傷害！',
    bonusEmeralds: 20,
    bonusDmg: 50,
    clickDmg: 20
  },
  {
    id: 'ender_pet',
    name: '👾 迷你終界小黑龍',
    icon: '👾',
    rarity: 'UR',
    desc: '傳說級 3D 終界龍寶寶！每題對魔王噴吐龍息 +140 傷害並掉落 +35 🟢！',
    bonusEmeralds: 35,
    bonusDmg: 140,
    clickDmg: 25
  }
];

export const MC_BASE_BUILDS = [
  {
    id: 'arrow_tower',
    name: '🏰 紅石警戒箭塔',
    price: 70,
    desc: '在礦區左側蓋一座 3D 紅石箭塔！每題自動發射紅石箭轟炸魔王 +60 傷害！',
    bonusEmeralds: 10,
    bonusDmg: 60
  },
  {
    id: 'oak_house',
    name: '🏠 溫馨橡木小木屋',
    price: 100,
    desc: '蓋一座點著溫暖火把的 3D 麥塊木屋！每題村民房租進帳 +18 綠寶石 🟢！',
    bonusEmeralds: 18,
    bonusDmg: 40
  },
  {
    id: 'diamond_beacon',
    name: '💎 鑽石信標金字塔',
    price: 150,
    desc: '在右側建造發射衝天光束的 3D 鑽石信標！每題傷害 +100、綠寶石 +25 🟢！',
    bonusEmeralds: 25,
    bonusDmg: 100
  },
  {
    id: 'gold_totem',
    name: '🗿 黃金苦力怕圖騰柱',
    price: 200,
    desc: '巨型 3D 純金苦力怕神像！每題天降 +40 綠寶石 🟢 並震懾魔王 +150 傷害！',
    bonusEmeralds: 40,
    bonusDmg: 150
  }
];

// ==========================================
// 3. 🟥 Roblox 版：3D 寵物盲盒與跑酷天梯設施目錄
// ==========================================
export const ROBLOX_PETS = [
  {
    id: 'doge',
    name: '🐶 經典柴犬 Doge',
    icon: '🐶',
    rarity: 'SR',
    desc: '浮空跟隨在積木人身旁的經典柴犬！每次跳躍成功銜回 +15 R$ 蘿蔔幣！',
    bonusRobux: 15,
    qteBonus: 0
  },
  {
    id: 'cat',
    name: '🐱 霓虹貓 Bloxy Cat',
    icon: '🐱',
    rarity: 'SSR',
    desc: '自帶霓虹光環的粉紅積木貓！彈簧 QTE 完美區擴大 30%，每次過關 +20 R$！',
    bonusRobux: 20,
    qteBonus: 0.3
  },
  {
    id: 'gold_blox',
    name: '👑 黃金方塊之王',
    icon: '👑',
    rarity: 'UR',
    desc: '傳奇純金打造的浮空方塊皇冠！每次過關獎金 +35 R$，彈簧跳躍完美區翻倍！',
    bonusRobux: 35,
    qteBonus: 0.5
  }
];

export const ROBLOX_TOWER_BUILDS = [
  {
    id: 'neon_beacon',
    name: '🗼 霓虹避雷針天線塔',
    price: 60,
    desc: '在天梯旁樹立賽博霓虹發報塔！每次過關自動發送 +10 R$ 贊助獎勵！',
    bonusRobux: 10
  },
  {
    id: 'bloxy_statue',
    name: '🗽 巨型 Noob 黃金雕像',
    price: 110,
    desc: '在天梯起點矗立高聳的 Noob 積木人金像！每過 1 關賞金追加 +20 R$！',
    bonusRobux: 20
  },
  {
    id: 'sky_roller',
    name: '🎢 雲霄高空飛車軌道',
    price: 180,
    desc: '環繞整座跑酷塔的空中過山車！全場每題過關額外分紅 +30 R$ 蘿蔔幣！',
    bonusRobux: 30
  }
];

// ==========================================
// 3. 🃏 Roguelike 肉鴿三選一神裝天賦卡池
// ==========================================
export const BASEBALL_ROGUELIKE_CARDS = [
  {
    id: 'power_bat',
    icon: '🔥',
    name: '火焰推進球棒',
    desc: '本場比賽所有安打自動「多推進 1 個壘包」（一壘打變二壘打、二壘打直接變全壘打）！'
  },
  {
    id: 'ghost_runners',
    icon: '👻',
    name: '影分身代跑部隊',
    desc: '立即在「二壘與三壘」免費派駐神速跑者，下一棒安打立刻大量得分！'
  },
  {
    id: 'coin_magnet',
    icon: '🧲',
    name: '黃金吸金磁鐵',
    desc: '本場比賽接下來每題答對獲得的金幣獎勵 +100% 雙倍狂飆！'
  },
  {
    id: 'eagle_eye',
    icon: '🦅',
    name: '鷹眼自動球探',
    desc: '接下來 2 局上場時，自動免費幫你識破並刪掉 1 個錯誤答案！'
  },
  {
    id: 'iron_shield',
    icon: '🛡️',
    name: '金剛免出局護盾',
    desc: '獲得 1 層黃金護盾（即使第二次揮空也不計 OUT，並立即贈送 +35 金幣）！'
  },
  {
    id: 'slow_motion',
    icon: '⚡',
    name: '雷電時間減速',
    desc: '手動揮棒 QTE 的「完美全壘打紅心區」擴大為 2 倍，隨便揮都炸裂！'
  }
];

export const MC_ROGUELIKE_CARDS = [
  {
    id: 'sharpness_v',
    icon: '⚔️',
    name: '鋒利 V 附魔神書',
    desc: '本場冒險所有挖礦與狂暴連擊對魔王造成的傷害永久 +80%！'
  },
  {
    id: 'fortune_iii',
    icon: '💎',
    name: '幸運 III 財富卷軸',
    desc: '本場冒險接下來每題挖出的綠寶石獎勵 +100% 雙倍掉落！'
  },
  {
    id: 'tnt_chain',
    icon: '🧨',
    name: '連鎖紅石 TNT 陣',
    desc: '每次答對自動在魔王腳下引爆額外紅石炸藥，追加 +180 點爆炸傷害！'
  },
  {
    id: 'ender_eye',
    icon: '👁️',
    name: '終界真視之眼',
    desc: '接下來 2 關進場時，自動免費將 1 座假礦石石化成基岩！'
  },
  {
    id: 'golden_apple',
    icon: '🍎',
    name: '附魔金蘋果祝福',
    desc: '立刻回滿 3 顆紅心 ❤️，獲得 1 層防爆護盾並立刻領取 +35 綠寶石 🟢！'
  },
  {
    id: 'haste_ii',
    icon: '⚡',
    name: '急迫 II 狂暴手速',
    desc: '狂暴挖礦時間每點擊 1 下算 2 連擊，超輕鬆觸發「終極紅石大核爆」！'
  }
];

export const ROBLOX_ROGUELIKE_CARDS = [
  {
    id: 'speed_coil',
    icon: '⚡',
    name: '疾速紅彈簧 Speed Coil',
    desc: '跑酷跳躍加速 +50%，手動彈簧 QTE「黃金綠區」擴大為 2 倍！'
  },
  {
    id: 'bloxy_cola',
    icon: '🥤',
    name: 'Bloxy 能量可樂',
    desc: '本場冒險接下來每過一關，額外咕嚕咕嚕喝下 +25 R$ 蘿蔔幣！'
  },
  {
    id: 'rainbow_carpet',
    icon: '🌈',
    name: '彩虹飛行魔毯',
    desc: '獲得 1 層免死幽靈護盾（即使第一次答錯也不跌落觸發 OOF，直接原地復活）！'
  },
  {
    id: 'gravity_spring',
    icon: '🌀',
    name: '究極重力彈簧 Gravity Coil',
    desc: '本場跳躍高度翻倍，答對直接啟動「高空二連跳」！'
  },
  {
    id: 'radar_glasses',
    icon: '👓',
    name: '透視偵察眼鏡',
    desc: '接下來 2 關進場時，自動用雷射免費識破並刪除 1 個錯誤答案！'
  }
];

// ==========================================
// 4. 👾 隨機亂入突發事件產生器
// ==========================================
export function rollRandomEncounter(edition = 'baseball', questionIdx = 0) {
  // 第 1 題先讓學童熟悉，從第 2 題起約 45% 機率觸發驚喜亂入事件
  if (questionIdx === 0 || Math.random() > 0.45) return null;

  const baseballEvents = [
    {
      id: 'golden_ufo',
      title: '🛸 突發事件：黃金外星飛碟路過外野！',
      desc: '本打席答對並擊球，外星人直接打賞 2 倍金幣大紅包！',
      coinMultiplier: 2,
      freeRunners: false,
      blitzSeconds: 0
    },
    {
      id: 'bases_loaded',
      title: '🔥 突發事件：保送滿壘大轉機！',
      desc: '魔王控球失準免費送上一、二壘跑者！這棒打出去就是大局！',
      coinMultiplier: 1,
      freeRunners: true,
      blitzSeconds: 0
    },
    {
      id: 'speed_blitz',
      title: '⚡ 限時懸賞：15 秒閃電快問快答！',
      desc: '15 秒內選對答案，額外加發 +35 閃電賞金（超時不扣分）！',
      coinMultiplier: 1,
      freeRunners: false,
      blitzSeconds: 15
    }
  ];

  const mcEvents = [
    {
      id: 'golden_creeper',
      title: '🦙 突發事件：流浪商人與黃金苦力怕亂入！',
      desc: '本關挖對寶石，直接掉落 2 倍綠寶石大禮包 🟢！',
      emeraldMultiplier: 2,
      bonusDmg: 0,
      blitzSeconds: 0
    },
    {
      id: 'rich_vein',
      title: '💎 突發事件：發現遠古富集鑽石礦脈！',
      desc: '這座礦脈蘊含超強紅石能量，答對直接追加 +200 屠龍傷害！',
      emeraldMultiplier: 1,
      bonusDmg: 200,
      blitzSeconds: 0
    },
    {
      id: 'speed_blitz',
      title: '⚡ 限時懸賞：15 秒閃電破陣挑戰！',
      desc: '15 秒內挖出正確礦石，額外加發 +35 綠寶石 🟢（超時不扣血）！',
      emeraldMultiplier: 1,
      bonusDmg: 0,
      blitzSeconds: 15
    }
  ];

  const robloxEvents = [
    {
      id: 'golden_bloxy',
      title: '🏆 突發事件：黃金 Bloxy 獎座降臨！',
      desc: '這座跳台有官方認證贊助，通關直接空投 2 倍 R$ 蘿蔔幣大紅包！',
      robuxMultiplier: 2,
      blitzSeconds: 0
    },
    {
      id: 'speed_blitz',
      title: '⚡ 限時懸賞：15 秒閃電極限跑酷！',
      desc: '15 秒內踏破機關，額外加發 +35 R$ 蘿蔔幣（超時不扣分）！',
      robuxMultiplier: 1,
      blitzSeconds: 15
    },
    {
      id: 'super_coil',
      title: '🌀 突發事件：重力彈簧狂暴充能！',
      desc: '跳台充滿高壓霓虹能量，跳躍高度狂飆 +100% 直衝天際！',
      robuxMultiplier: 1,
      blitzSeconds: 0
    }
  ];

  const pool = edition === 'baseball' ? baseballEvents : edition === 'roblox' ? robloxEvents : mcEvents;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ==========================================
// 5. 🎯 棒球版：答對後「魔球鎖定・手動揮棒 QTE」
// ==========================================
export function runBaseballSwingQTE({ pitchName = '🔥 152km 火焰直球', sweetSpotBonus = 0, onSound, onComplete }) {
  let overlay = document.getElementById('action-qte-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'action-qte-overlay';
    document.body.appendChild(overlay);
  }

  overlay.className = 'qte-overlay-active';
  overlay.innerHTML = `
    <div class="qte-card">
      <div class="qte-badge">✅ 答案正確！進入實戰打擊視角</div>
      <div class="qte-title">⚾ 盯緊魔球【${pitchName}】進紅心瞬間揮棒！</div>
      <div class="qte-arena" id="qte-click-zone">
        <div class="qte-sweet-zone" style="transform: translate(-50%, -50%) scale(${1 + sweetSpotBonus * 0.6});"></div>
        <div class="qte-approach-ring" id="qte-ring"></div>
        <div class="qte-ball-core">⚾</div>
      </div>
      <div class="qte-hint">👇 當外圈光環縮進「黃金紅心圈」時，按下按鈕或【空白鍵】！</div>
      <button type="button" class="qte-swing-btn" id="btn-qte-swing">💥 揮棒 SWING！(空白鍵 / 點擊)</button>
    </div>
  `;

  const ringEl = document.getElementById('qte-ring');
  const swingBtn = document.getElementById('btn-qte-swing');
  const clickZone = document.getElementById('qte-click-zone');

  let scale = 2.4;
  let resolved = false;
  let animId = null;
  let loops = 0;
  const perfectThreshold = 0.28 + sweetSpotBonus * 0.22;
  const greatThreshold = 0.55 + sweetSpotBonus * 0.25;

  const finishQTE = (isAutoTimeout = false) => {
    if (resolved) return;
    resolved = true;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('keydown', keyHandler);

    const diff = Math.abs(scale - 1.0);
    let rating = 'GOOD';
    let bonusCoins = 10;
    let bonusBases = 0;
    let label = '⚾ 紮實擊球 (+10 💰)';

    if (!isAutoTimeout && diff <= perfectThreshold) {
      rating = 'PERFECT';
      bonusCoins = 35;
      bonusBases = 2; // 直接升級為全壘打級重砲！
      label = '👑 PERFECT 完美紅心重砲！(+35 💰・直飛全壘打牆)';
    } else if (!isAutoTimeout && diff <= greatThreshold) {
      rating = 'GREAT';
      bonusCoins = 20;
      bonusBases = 1;
      label = '🔥 GREAT 強勁平飛長打！(+20 💰・推進 +1 壘)';
    }

    if (onSound) onSound(rating === 'PERFECT');
    overlay.className = 'hidden';
    overlay.innerHTML = '';
    onComplete({ rating, bonusCoins, bonusBases, label });
  };

  const keyHandler = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      finishQTE(false);
    }
  };
  window.addEventListener('keydown', keyHandler);
  swingBtn.onclick = () => finishQTE(false);
  clickZone.onclick = () => finishQTE(false);

  const tick = () => {
    if (resolved) return;
    scale -= 0.028;
    if (scale <= 0.45) {
      loops++;
      if (loops >= 2) {
        finishQTE(true);
        return;
      }
      scale = 2.4;
    }
    if (ringEl) {
      ringEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
      const isSweet = Math.abs(scale - 1.0) <= perfectThreshold;
      ringEl.style.borderColor = isSweet ? '#facc15' : '#38bdf8';
      ringEl.style.boxShadow = isSweet ? '0 0 24px #facc15' : '0 0 12px #38bdf8';
    }
    animId = requestAnimationFrame(tick);
  };
  animId = requestAnimationFrame(tick);
}

// ==========================================
// 6. ⛏️ 麥塊版：答對後「3秒狂暴連擊・挖礦砍怪 Rush」
// ==========================================
export function runMinecraftMiningRush({ hasHaste = false, petClickBonus = 0, onHitSound, onComplete }) {
  let overlay = document.getElementById('action-qte-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'action-qte-overlay';
    document.body.appendChild(overlay);
  }

  const maxHits = 8;
  let hits = 0;
  let bonusDmg = 0;
  let bonusEmeralds = 0;
  let resolved = false;
  let timeLeft = 3.0;

  overlay.className = 'qte-overlay-active';
  overlay.innerHTML = `
    <div class="qte-card mc-qte-card">
      <div class="qte-badge mc-qte-badge">💎 礦脈破防！3 秒狂暴連擊時間！</div>
      <div class="qte-title">⚡ 狂點方塊或按【空白鍵】連擊砍爆魔王核心！(<span id="mc-rush-timer">3.0</span>s)</div>
      <div class="mc-rush-progress-wrap">
        <div class="mc-rush-progress-bar" id="mc-rush-bar" style="width: 0%;"></div>
        <span class="mc-rush-progress-label" id="mc-rush-count">連擊 0 / ${maxHits}（集滿觸發終極 TNT 核爆！）</span>
      </div>
      <div class="mc-rush-arena" id="mc-rush-target">
        <div class="mc-rush-cube" id="mc-rush-cube">💎</div>
        <div id="mc-floating-dmg-layer"></div>
      </div>
      <button type="button" class="qte-swing-btn mc-rush-btn" id="btn-mc-rush-hit">
        ⛏️ 瘋狂揮鎬連擊！(空白鍵 / 狂點這裡)
      </button>
    </div>
  `;

  const barEl = document.getElementById('mc-rush-bar');
  const countEl = document.getElementById('mc-rush-count');
  const cubeEl = document.getElementById('mc-rush-cube');
  const floatLayer = document.getElementById('mc-floating-dmg-layer');
  const timerEl = document.getElementById('mc-rush-timer');
  const hitBtn = document.getElementById('btn-mc-rush-hit');
  const targetArea = document.getElementById('mc-rush-target');

  const finishRush = () => {
    if (resolved) return;
    resolved = true;
    clearInterval(countdownTimer);
    window.removeEventListener('keydown', keyHandler);

    const isMegaTnt = hits >= maxHits;
    if (isMegaTnt) {
      bonusDmg += 160;
      bonusEmeralds += 25;
    }

    const label = isMegaTnt
      ? `🧨 終極紅石大核爆！(${hits} 連擊・+${bonusDmg} 傷害 / +${bonusEmeralds} 🟢)`
      : `⛏️ 狂暴連擊 x${hits}！(+${bonusDmg} 傷害 / +${bonusEmeralds} 🟢)`;

    overlay.className = 'hidden';
    overlay.innerHTML = '';
    onComplete({ hits, isMegaTnt, bonusDmg, bonusEmeralds, label });
  };

  const registerStrike = () => {
    if (resolved || hits >= maxHits) return;
    const step = hasHaste ? 2 : 1;
    hits = Math.min(maxHits, hits + step);
    const dmgPerClick = 25 + petClickBonus;
    bonusDmg += dmgPerClick * step;
    bonusEmeralds += 4 * step;

    if (onHitSound) onHitSound(hits >= maxHits);

    if (barEl) barEl.style.width = `${(hits / maxHits) * 100}%`;
    if (countEl) {
      countEl.textContent = hits >= maxHits
        ? '🧨 紅石能量 100% 滿載！終極核爆發動！'
        : `連擊 ${hits} / ${maxHits}（集滿觸發終極 TNT 核爆！）`;
    }

    if (cubeEl) {
      cubeEl.style.transform = `scale(${0.85 + Math.random() * 0.35}) rotate(${(Math.random() - 0.5) * 28}deg)`;
      cubeEl.textContent = hits >= maxHits ? '🧨' : hits >= 4 ? '💎' : '⛏️';
    }

    if (floatLayer) {
      const pop = document.createElement('div');
      pop.className = 'mc-float-dmg';
      pop.style.left = `${25 + Math.random() * 50}%`;
      pop.style.top = `${20 + Math.random() * 45}%`;
      pop.textContent = `+${dmgPerClick * step} ⚔️`;
      floatLayer.appendChild(pop);
      setTimeout(() => pop.remove(), 550);
    }

    if (hits >= maxHits) {
      setTimeout(() => finishRush(), 260);
    }
  };

  const keyHandler = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      registerStrike();
    }
  };
  window.addEventListener('keydown', keyHandler);
  hitBtn.onclick = () => registerStrike();
  targetArea.onclick = () => registerStrike();

  const countdownTimer = setInterval(() => {
    timeLeft -= 0.1;
    if (timerEl) timerEl.textContent = Math.max(0, timeLeft).toFixed(1);
    if (timeLeft <= 0) {
      finishRush();
    }
  }, 100);
}

// ==========================================
// 6.5 🌀 Roblox 版：答對後「極限彈簧蓄力起跳 QTE (Spring Coil Jump)」
// ==========================================
export function runRobloxSpringQTE({ hasGravityCoil = false, petJumpBonus = 0, onBounceSound, onComplete }) {
  let overlay = document.getElementById('action-qte-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'action-qte-overlay';
    document.body.appendChild(overlay);
  }

  let resolved = false;
  let animId = null;
  let progress = 0;
  let direction = 1;
  const speed = hasGravityCoil ? 2.2 : 2.8;
  const sweetMin = 70 - (petJumpBonus ? 10 : 0);
  const sweetMax = 90 + (petJumpBonus ? 6 : 0);

  overlay.className = 'action-qte-active';
  overlay.innerHTML = `
    <div class="qte-modal-card roblox-qte-card">
      <div class="qte-badge" style="background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #fff;">
        🚀 OBBY 彈簧跳躍蓄力 (SPRING COIL)
      </div>
      <h3 style="color: #facc15; font-size: 20px; margin: 8px 0 4px; text-shadow: 0 0 10px rgba(250,204,21,0.6);">
        抓準指針進入【黃金綠區】時按下起跳！
      </h3>
      <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 12px;">
        完美起跳將觸發超重力螺旋沖天，跳過前方危險雷射！
      </p>

      <div class="roblox-qte-spring-icon" id="roblox-spring-icon">🌀</div>

      <div class="roblox-meter-container" style="position: relative; width: 280px; height: 32px; background: #0f172a; border: 3px solid #38bdf8; border-radius: 16px; margin: 0 auto 16px; overflow: hidden; box-shadow: 0 0 16px rgba(56,189,248,0.4);">
        <!-- 甜蜜區 -->
        <div style="position: absolute; left: ${sweetMin}%; width: ${sweetMax - sweetMin}%; height: 100%; background: linear-gradient(90deg, #10b981, #facc15); opacity: 0.85;"></div>
        <!-- 指針 -->
        <div id="roblox-meter-needle" style="position: absolute; left: 0%; top: 0; bottom: 0; width: 8px; background: #ffffff; border-radius: 4px; box-shadow: 0 0 10px #ffffff, 0 0 20px #38bdf8; transform: translateX(-50%);"></div>
      </div>

      <button type="button" class="action-btn" id="btn-roblox-jump" style="background: linear-gradient(135deg, #00f2fe, #4facfe); color: #0f172a; font-size: 20px; font-weight: 900; padding: 12px 32px; border-radius: 30px; box-shadow: 0 0 20px rgba(0,242,254,0.6); border: none; cursor: pointer;">
        🚀 彈簧起跳！ (空白鍵 Space)
      </button>
    </div>
  `;

  const needle = document.getElementById('roblox-meter-needle');
  const springIcon = document.getElementById('roblox-spring-icon');
  const jumpBtn = document.getElementById('btn-roblox-jump');

  const finishJump = () => {
    if (resolved) return;
    resolved = true;
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('keydown', keyHandler);

    let rating = 'GOOD';
    let bonusRobux = 10;
    let leapPower = 0;
    let label = '🌀 穩健起跳 (+10 R$)';

    if (progress >= sweetMin && progress <= sweetMax) {
      rating = 'PERFECT';
      bonusRobux = 35;
      leapPower = 2;
      label = '👑 PERFECT 超重力螺旋沖天！(+35 R$・直接滑翔跳躍)';
    } else if (progress >= sweetMin - 18 && progress <= sweetMax + 10) {
      rating = 'GREAT';
      bonusRobux = 20;
      leapPower = 1;
      label = '🔥 GREAT 強勁彈簧大跳！(+20 R$・高速推進)';
    }

    if (onBounceSound) onBounceSound(rating === 'PERFECT');
    overlay.className = 'hidden';
    overlay.innerHTML = '';
    onComplete({ rating, bonusRobux, leapPower, label });
  };

  const keyHandler = (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      finishJump();
    }
  };
  window.addEventListener('keydown', keyHandler);
  if (jumpBtn) jumpBtn.onclick = () => finishJump();

  const tick = () => {
    if (resolved) return;
    progress += speed * direction;
    if (progress >= 100) {
      progress = 100;
      direction = -1;
    } else if (progress <= 0) {
      progress = 0;
      direction = 1;
    }
    if (needle) {
      needle.style.left = `${progress}%`;
    }
    if (springIcon) {
      const scaleY = 0.7 + (progress / 100) * 0.6;
      springIcon.style.transform = `scaleY(${scaleY})`;
    }
    animId = requestAnimationFrame(tick);
  };
  animId = requestAnimationFrame(tick);
}

// ==========================================
// 7. 🃏 Roguelike 三選一神裝天賦卡視窗
// ==========================================
export function openRoguelikeDraftModal({ edition = 'baseball', onSelectCard }) {
  let modal = document.getElementById('roguelike-draft-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'roguelike-draft-modal';
    document.body.appendChild(modal);
  }

  let pool = BASEBALL_ROGUELIKE_CARDS;
  let titleText = '🃏 局間狂暴覺醒！選擇 1 張傳奇天賦卡';

  if (edition === 'minecraft') {
    pool = MC_ROGUELIKE_CARDS;
    titleText = '📜 魔王破防獎勵！選擇 1 張傳奇附魔卷軸';
  } else if (edition === 'roblox') {
    pool = ROBLOX_ROGUELIKE_CARDS;
    titleText = '🚀 跑酷突破極限！選擇 1 個超能齒輪特技';
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);

  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card roguelike-modal-card">
      <h2 class="modal-title" style="color: #facc15;">${titleText}</h2>
      <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 14px;">
        每過 3 題可疊加 1 種超能力！點選下方任一張卡片立即生效：
      </p>
      <div class="roguelike-cards-grid" id="roguelike-cards-container"></div>
    </div>
  `;

  const container = document.getElementById('roguelike-cards-container');
  shuffled.forEach(card => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'roguelike-card-item';
    btn.innerHTML = `
      <div class="rogue-card-icon">${card.icon}</div>
      <div class="rogue-card-name">${card.name}</div>
      <div class="rogue-card-desc">${card.desc}</div>
      <div class="rogue-card-pick">✨ 點擊裝備天賦</div>
    `;
    btn.onclick = () => {
      modal.className = 'modal-overlay hidden';
      onSelectCard(card);
    };
    container.appendChild(btn);
  });
}

// ==========================================
// 8. 🎈 飛天動態靶心模式 (戳破飄浮氣球 / 砍飛天附魔方塊)
// ==========================================
export function renderFloatingTargetsOverlay({
  active = false,
  edition = 'baseball',
  question,
  eliminatedIndices = new Set(),
  onSelectOption
}) {
  let layer = document.getElementById('floating-targets-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'floating-targets-layer';
    document.body.appendChild(layer);
  }

  if (!active || !question) {
    layer.className = 'hidden';
    layer.innerHTML = '';
    return;
  }

  const bannerText = edition === 'baseball'
    ? '🎈 飛天熱氣球靶心挑戰！直接點破空中飄動的正確氣球！'
    : edition === 'minecraft'
    ? '👾 飛天附魔方塊挑戰！直接點擊空中盤旋的正確礦石方塊！'
    : '🌀 霓虹懸浮光標挑戰！直接點擊空中盤旋的正確通關積木！';

  layer.className = 'floating-targets-active';
  layer.innerHTML = `
    <div class="floating-mode-banner">
      ${bannerText}
    </div>
    <div class="floating-targets-stage" id="floating-stage"></div>
  `;

  const stage = document.getElementById('floating-stage');
  const icons = edition === 'baseball'
    ? ['🎈', '🛸', '🎯']
    : edition === 'minecraft'
    ? ['💎', '🪙', '🟢']
    : ['🌀', '⚡', '🏆'];
  const keys = ['A', 'S', 'D'];

  question.options.forEach((opt, idx) => {
    if (eliminatedIndices.has(idx)) return;
    const target = document.createElement('button');
    target.type = 'button';
    target.className = `floating-target-item float-anim-${idx}`;
    target.innerHTML = `
      <span class="float-target-icon">${icons[idx % icons.length]}</span>
      <span class="float-target-key">[${keys[idx]}]</span>
      <span class="float-target-text">${String(opt.text).replace(/</g, '&lt;')}</span>
    `;
    target.onclick = () => {
      const allTargets = stage.querySelectorAll('.floating-target-item');
      allTargets.forEach(t => (t.disabled = true));
      target.classList.add('float-target-popped');
      setTimeout(() => {
        layer.className = 'hidden';
        onSelectOption(opt, idx);
      }, 150);
    };
    stage.appendChild(target);
  });
}

// ==========================================
// 9. 🥚 3D 寵物盲盒扭蛋 ＆ 3D 球場/家園建造中心彈窗
// ==========================================
export function openPetAndBuildModal({
  edition = 'baseball',
  currency = 0,
  unlockedPets = [],
  equippedPet = '',
  unlockedBuilds = [],
  lastWonPet = null,
  onPullGacha,
  onEquipPet,
  onBuyBuild
}) {
  let modal = document.getElementById('pet-build-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pet-build-modal';
    document.body.appendChild(modal);
  }

  const isBaseball = edition === 'baseball';
  const isMinecraft = edition === 'minecraft';
  const currencyIcon = isBaseball ? '💰' : isMinecraft ? '🟢' : '🪙';
  const currencyName = isBaseball ? '金幣' : isMinecraft ? '綠寶石' : 'R$ 蘿蔔幣';
  const petsCatalog = isBaseball ? BASEBALL_PETS : isMinecraft ? MC_PETS : ROBLOX_PETS;
  const buildsCatalog = isBaseball ? BASEBALL_STADIUM_BUILDS : isMinecraft ? MC_BASE_BUILDS : ROBLOX_TOWER_BUILDS;
  const gachaPrice = 50;
  const allPetsOwned = unlockedPets.length >= petsCatalog.length;

  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card shop-card" style="max-width: 720px; max-height: 88vh; overflow-y: auto;">
      <h2 class="modal-title" style="color: #facc15;">
        ${
          isBaseball
            ? '🥚 3D 寵物盲盒 ＆ 🎡 豪華球場擴建'
            : isMinecraft
            ? '🥚 3D 生物刷怪蛋 ＆ 🏰 麥塊家園建造'
            : '🥚 3D 萌寵盲盒 ＆ 🗼 跑酷神塔自由組建'
        }
      </h2>
      <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 10px;">
        目前擁有：<b style="color: #4ade80; font-size: 20px;">${currency} ${currencyIcon} ${currencyName}</b>
        （抽出的 3D 寵物與建造的設施會直接出現在 3D 場景中助戰！）
      </p>

      <!-- 盲盒扭蛋區 -->
      <div class="gacha-hero-box">
        <div class="gacha-hero-info">
          <div style="font-weight: 900; font-size: 17px; color: #fef08a;">
            🎰 神秘 3D 神獸夥伴盲盒（已收集 ${unlockedPets.length} / ${petsCatalog.length}）
          </div>
          <div style="font-size: 13px; color: #e2e8f0; margin-top: 3px;">
            保證優先抽出「尚未擁有」的 3D 神獸夥伴！上場時會站在你身邊一起跳動並提供超強加成！
          </div>
        </div>
        <button type="button" class="action-btn gacha-pull-btn" id="btn-pull-gacha" ${
          allPetsOwned || currency < gachaPrice ? 'disabled' : ''
        }>
          ${allPetsOwned ? '🎉 神獸已全數收集完畢！' : `🥚 抽一顆神獸盲盒 (${gachaPrice} ${currencyIcon})`}
        </button>
      </div>

      <div id="gacha-result-banner" class="hidden"></div>

      <!-- 寵物列表 -->
      <div style="text-align: left; font-weight: 900; color: #38bdf8; margin: 10px 0 6px;">
        🐾 我的 3D 隨身神獸夥伴：
      </div>
      <div class="shop-grid" id="pets-grid-container"></div>

      <!-- 3D 擴建/建造列表 -->
      <div style="text-align: left; font-weight: 900; color: #4ade80; margin: 14px 0 6px;">
        ${
          isBaseball
            ? '🎡 3D 外野傳奇球場擴建（蓋好直接出現在外野！）：'
            : isMinecraft
            ? '🏰 3D 麥塊家園自由建造（蓋好直接佇立在礦區兩側！）：'
            : '🗼 3D 螺旋神塔跑酷機關建造（蓋好直接屹立在通天賽道旁！）：'
        }
      </div>
      <div class="shop-grid" id="builds-grid-container"></div>

      <button type="button" class="action-btn" id="btn-close-pet-build" style="margin-top: 14px;">
        ${isBaseball ? '回到球場 ⚾' : isMinecraft ? '回到礦區 ⛏️' : '回到跑酷關卡 🚀'}
      </button>
    </div>
  `;

  // 綁定抽盲盒按鈕
  const bannerEl = document.getElementById('gacha-result-banner');
  if (bannerEl && lastWonPet) {
    bannerEl.className = 'gacha-win-banner';
    bannerEl.innerHTML = `🎉 恭喜抽出全新 3D 神獸：<b>【${lastWonPet.name}】</b>！已自動裝備隨身助戰！`;
  }

  const pullBtn = document.getElementById('btn-pull-gacha');
  if (pullBtn) {
    pullBtn.onclick = () => {
      const unowned = petsCatalog.filter(p => !unlockedPets.includes(p.id));
      if (unowned.length === 0 || currency < gachaPrice) return;
      const wonPet = unowned[Math.floor(Math.random() * unowned.length)];
      onPullGacha(wonPet, gachaPrice);
    };
  }

  // 渲染寵物卡片
  const petsGrid = document.getElementById('pets-grid-container');
  petsCatalog.forEach(pet => {
    const owned = unlockedPets.includes(pet.id);
    const equipped = equippedPet === pet.id;
    const card = document.createElement('div');
    card.className = `shop-item ${equipped ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="shop-item-title">${pet.name} <span class="pet-rarity-badge">${pet.rarity}</span></div>
      <div class="shop-item-desc">${owned ? pet.desc : '🔒 尚未解鎖（透過上方神獸盲盒抽出！）'}</div>
      <button type="button" class="shop-buy-btn" ${!owned || equipped ? 'disabled' : ''}>
        ${equipped ? '✅ 隨身出戰中' : owned ? '召喚上場助戰' : '🔒 盲盒抽取'}
      </button>
    `;
    const btn = card.querySelector('.shop-buy-btn');
    btn.onclick = () => {
      if (owned && !equipped) onEquipPet(pet.id);
    };
    petsGrid.appendChild(card);
  });

  // 渲染 3D 建築卡片
  const buildsGrid = document.getElementById('builds-grid-container');
  buildsCatalog.forEach(bItem => {
    const built = unlockedBuilds.includes(bItem.id);
    const canAfford = currency >= bItem.price;
    const card = document.createElement('div');
    card.className = `shop-item ${built ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="shop-item-title">${bItem.name}</div>
      <div class="shop-item-desc">${bItem.desc}</div>
      <button type="button" class="shop-buy-btn" ${built || !canAfford ? 'disabled' : ''}>
        ${built ? '✅ 已建造於 3D 世界' : `🔨 ${bItem.price} ${currencyIcon} 立即建造`}
      </button>
    `;
    const btn = card.querySelector('.shop-buy-btn');
    btn.onclick = () => {
      if (!built && canAfford) onBuyBuild(bItem);
    };
    buildsGrid.appendChild(card);
  });

  document.getElementById('btn-close-pet-build').onclick = () => {
    modal.className = 'modal-overlay hidden';
  };
}
