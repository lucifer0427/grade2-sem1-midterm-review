/**
 * 麥塊方塊冒險版：學科專屬紅石機關與英雄成就卡產生器
 * 包含：
 * 1. 紅石活塞方塊量尺 (RedstonePistonRuler - 翰林數學第 3 單元公分與斷尺)
 * 2. 動力鐵軌礦車兩步驟連鎖 (MinecartRailChain - 翰林數學第 4 單元兩步驟應用)
 * 3. 3x3 工作台合成九宮格 (CraftingTableGrid - 國語挑錯字/部首 & 數學心算)
 * 4. 麥塊屠龍英雄成就卡：HTML5 Canvas 像素風高解析度繪製與 PNG 下載
 */

const MC_RULER_CONFIGS = {
  math_25: { item: '🪄 附魔木棍 (鉛筆)', itemColor: '#f59e0b', rulerMin: 2, rulerMax: 10, startTick: 3, endTick: 9, brokenLeft: true },
  math_26: { item: '🧽 海綿方塊 (橡皮擦)', itemColor: '#facc15', rulerMin: 4, rulerMax: 12, startTick: 5, endTick: 11, brokenLeft: true },
  math_32: { item: '🕯️ 終界燭 (粉筆)', itemColor: '#e879f9', rulerMin: 1, rulerMax: 9, startTick: 2, endTick: 8, brokenLeft: true },
  math_33: { item: '🔴 從 0 推 7 塊金磚到哪裡？', itemColor: '#ef4444', rulerMin: 0, rulerMax: 9, startTick: 0, endTick: 7, brokenLeft: false, hideEndLabel: true, hideObjectBar: true }
};

const MC_MINECART_CHAINS = {
  math_35: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】32 瓶水喝掉 14 瓶，先算剩下幾瓶？',
    choices: ['18 瓶', '28 瓶', '46 瓶'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】剩下 18 瓶，再加搬來的 20 瓶（18 + 20），快揮鎬敲出最終答案！'
  },
  math_36: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】公車原有 25 人，下車 8 人，先算車上剩幾人？',
    choices: ['17 人', '33 人', '18 人'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】車上剩 17 人，又上來 12 人（17 + 12），快揮鎬敲出最終答案！'
  },
  math_37: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】買 15 元鉛筆和 20 元筆記本，先算共花掉多少元？',
    choices: ['35 元', '25 元', '30 元'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】原有 50 元，扣掉花掉的 35 元（50 - 35），快揮鎬敲出最終答案！'
  },
  math_38: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】16 朵紅花和 24 朵黃花，先算全部有幾朵花？',
    choices: ['40 朵', '30 朵', '38 朵'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】全部有 40 朵，扣掉採走的 15 朵（40 - 15），快揮鎬敲出最終答案！'
  },
  math_39: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】二甲借走 22 顆、二乙借走 18 顆，先算共借走幾顆？',
    choices: ['40 顆', '30 顆', '38 顆'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】原有 60 顆，扣掉共借走的 40 顆（60 - 40），快揮鎬敲出最終答案！'
  },
  math_40: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】哥哥有 42 張，弟弟比哥哥少 15 張，先算弟弟有幾張？',
    choices: ['27 張', '37 張', '57 張'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】哥哥 42 張加弟弟 27 張（42 + 27），快揮鎬敲出最終答案！'
  },
  math_41: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】早上賣出 38 個、下午賣出 27 個，先算共賣出幾個？',
    choices: ['65 個', '55 個', '63 個'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】烤了 85 個，扣掉賣出的 65 個（85 - 65），快揮鎬敲出最終答案！'
  },
  math_42: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】原有 18 顆糖，爸爸給她 15 顆，先算合起來有幾顆？',
    choices: ['33 顆', '23 顆', '35 顆'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】共有 33 顆，吃掉 7 顆（33 - 7），快揮鎬敲出最終答案！'
  },
  math_43: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】男生有 26 人，女生比男生多 9 人，先算女生有幾人？',
    choices: ['35 人', '17 人', '34 人'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】男生 26 人加女生 35 人（26 + 35），快揮鎬敲出最終答案！'
  },
  math_44: {
    step1Prompt: '🛤️ 【第一站動力鐵軌】原有 52 輛車，開走 19 輛，先算剩下幾輛車？',
    choices: ['33 輛', '43 輛', '37 輛'],
    correctIdx: 0,
    step2Prompt: '🧨 【第二站終點礦車】剩下 33 輛，又開進來 14 輛（33 + 14），快揮鎬敲出最終答案！'
  }
};

/**
 * 渲染「紅石活塞方塊量尺」
 */
export function renderRedstoneRulerWidget(containerEl, questionObj, onPistonPushSound) {
  if (!containerEl) return;
  const cfg = MC_RULER_CONFIGS[questionObj?.id];
  if (!cfg) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');
  const totalSpan = cfg.rulerMax - cfg.rulerMin;
  const leftPct = ((cfg.startTick - cfg.rulerMin) / totalSpan) * 100;
  const widthPct = ((cfg.endTick - cfg.startTick) / totalSpan) * 100;

  let ticksHtml = '';
  for (let t = cfg.rulerMin; t <= cfg.rulerMax; t++) {
    const posPct = ((t - cfg.rulerMin) / totalSpan) * 100;
    const isStart = t === cfg.startTick;
    const isEnd = t === cfg.endTick && !cfg.hideEndLabel;
    const cls = isStart ? 'mc-tick-start' : isEnd ? 'mc-tick-end' : '';
    ticksHtml += `
      <div class="mc-ruler-tick" style="left: ${posPct}%;">
        <div class="mc-tick-line"></div>
        <div class="mc-tick-num ${cls}">${t}</div>
      </div>
    `;
  }

  let blocksHtml = '';
  const totalBlocks = cfg.endTick - cfg.startTick;
  for (let i = 0; i < totalBlocks; i++) {
    const bLeft = ((cfg.startTick + i - cfg.rulerMin) / totalSpan) * 100;
    const bWidth = (1 / totalSpan) * 100;
    blocksHtml += `
      <div class="mc-piston-block hidden" style="left: ${bLeft}%; width: ${bWidth}%;">
        <span>+1格</span>
      </div>
    `;
  }

  containerEl.innerHTML = `
    <div class="mc-ruler-box">
      <div class="mc-ruler-header">
        <span>🔴 <b>紅石活塞方塊尺</b>：${cfg.brokenLeft ? '⚠️ 斷尺警告！起點不是刻度 0！' : '標準方塊尺對齊刻度 0'}</span>
        ${!cfg.highlightZero ? `<button type="button" class="mc-piston-btn" id="btn-mc-piston">🧱 啟動紅石活塞（推 1 格金塊）</button>` : ''}
      </div>
      <div class="mc-ruler-stage">
        ${!cfg.hideObjectBar ? `
        <div class="mc-measured-bar" style="left: ${leftPct}%; width: ${widthPct}%; background: ${cfg.itemColor};">
          ${cfg.item}
        </div>` : ''}
        ${blocksHtml}
        <div class="mc-ruler-track">
          ${ticksHtml}
        </div>
      </div>
    </div>
  `;

  const pistonBtn = containerEl.querySelector('#btn-mc-piston');
  if (pistonBtn) {
    let pushed = 0;
    pistonBtn.onclick = () => {
      const blocks = containerEl.querySelectorAll('.mc-piston-block');
      if (pushed < blocks.length) {
        blocks[pushed].classList.remove('hidden');
        pushed++;
        if (onPistonPushSound) onPistonPushSound();
        if (pushed < blocks.length) {
          pistonBtn.textContent = `🧱 已推出 ${pushed} 塊金磚... 再點一下繼續推！`;
        } else {
          pistonBtn.textContent = `✅ 從刻度 ${cfg.startTick} 到 ${cfg.endTick} 共推了幾塊金磚？快揮鎬！`;
          pistonBtn.disabled = true;
        }
      }
    };
  }
}

/**
 * 渲染「動力鐵軌礦車兩步驟連鎖」
 */
export function renderMinecartChainWidget(containerEl, questionObj, onStep1Success) {
  if (!containerEl) return;
  const chain = MC_MINECART_CHAINS[questionObj?.id];
  if (!chain) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');

  // 隨機打亂第一站的 3 個中間量選項，避免正確答案固定在第一個按鈕
  const shuffledChoices = chain.choices.map((c, origIdx) => ({
    text: c,
    isCorrect: origIdx === chain.correctIdx
  }));
  for (let i = shuffledChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
  }

  const choicesHtml = shuffledChoices
    .map((item, idx) => `<button type="button" class="mc-rail-btn" data-idx="${idx}">${item.text}</button>`)
    .join('');

  containerEl.innerHTML = `
    <div class="mc-rail-box">
      <div class="mc-rail-row">
        <span class="mc-rail-prompt">${chain.step1Prompt}</span>
        <div class="mc-rail-choices">${choicesHtml}</div>
      </div>
      <div class="mc-rail-step2 hidden" id="mc-rail-step2">
        ✅ <b>礦車充能加速通過第一站 (+10 🟢)！</b> ${chain.step2Prompt}
      </div>
    </div>
  `;

  const btns = containerEl.querySelectorAll('.mc-rail-btn');
  btns.forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.idx);
      const picked = shuffledChoices[idx];
      if (picked && picked.isCorrect) {
        btn.classList.add('rail-correct');
        btns.forEach(b => (b.disabled = true));
        containerEl.querySelector('#mc-rail-step2')?.classList.remove('hidden');
        if (onStep1Success) onStep1Success(picked.text);
      } else {
        btn.classList.add('rail-wrong');
        btn.disabled = true;
      }
    };
  });
}

/**
 * 渲染麥塊版生活科第 2 單元「☀️ 麥塊日晷與紅石燈光影實驗台」
 */
export function renderMcShadowLabWidget(containerEl, questionObj, onSwitchSound) {
  if (!containerEl) return;
  const isLightShadowUnit = questionObj?.subject === '生活' && questionObj?.unit?.includes('光與影子');
  if (!isLightShadowUnit) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');
  containerEl.innerHTML = `
    <div class="mc-shadow-box">
      <div class="mc-shadow-header">
        <span>☀️ <b>麥塊方塊日晷實驗台</b>：切換方塊太陽時間或紅石火把距離，觀察勇者方塊影子！</span>
        <div class="mc-shadow-btns">
          <button type="button" class="mc-shadow-btn" data-mode="morning">🌅 早晨太陽在東(左)</button>
          <button type="button" class="mc-shadow-btn" data-mode="noon">☀️ 中午12點(正上方)</button>
          <button type="button" class="mc-shadow-btn" data-mode="evening">🌇 傍晚太陽在西(右)</button>
          <button type="button" class="mc-shadow-btn" data-mode="torch_near">🔦 紅石火把靠近</button>
        </div>
      </div>
      <div class="mc-shadow-stage">
        <div class="mc-compass mc-east">東 (左)</div>
        <div class="mc-compass mc-west">西 (右)</div>
        <div class="mc-light-icon" id="mc-lab-light" style="left: 50%; top: 4px;">☀️</div>
        <div class="mc-caster-hero">⛏️勇者</div>
        <div class="mc-casted-shadow" id="mc-lab-shadow" style="width: 34px; transform: translateX(-50%);">方塊影</div>
        <div class="mc-shadow-note" id="mc-lab-note">👆 點擊上方按鈕切換光源，觀察方塊影子往哪邊拉長或縮短！</div>
      </div>
    </div>
  `;

  const btns = containerEl.querySelectorAll('.mc-shadow-btn');
  const lightEl = containerEl.querySelector('#mc-lab-light');
  const shadowEl = containerEl.querySelector('#mc-lab-shadow');
  const noteEl = containerEl.querySelector('#mc-lab-note');

  const states = {
    morning: {
      lightLeft: '14%',
      lightTop: '14px',
      icon: '🌅',
      shadowStyle: 'left: 50%; width: 96px; height: 12px; transform: translateX(6px);',
      note: '🔍 實測結果：太陽在【東邊(左)】偏低 ➔ 方塊影子指向相反的【西邊(右)】，而且【長長的】！'
    },
    noon: {
      lightLeft: '50%',
      lightTop: '2px',
      icon: '☀️',
      shadowStyle: 'left: 50%; width: 26px; height: 10px; transform: translateX(-50%);',
      note: '🔍 實測結果：中午 12 點太陽在【正上方最高處】 ➔ 腳下的方塊影子【最短】！'
    },
    evening: {
      lightLeft: '86%',
      lightTop: '14px',
      icon: '🌇',
      shadowStyle: 'left: 50%; width: 96px; height: 12px; transform: translateX(-102px);',
      note: '🔍 實測結果：太陽在【西邊(右)】偏低 ➔ 方塊影子指向相反的【東邊(左)】，而且【長長的】！'
    },
    torch_near: {
      lightLeft: '36%',
      lightTop: '20px',
      icon: '🔦',
      shadowStyle: 'left: 50%; width: 125px; height: 18px; transform: translateX(8px);',
      note: '🔍 實測結果：紅石火把（光源）越【靠近】勇者 ➔ 擋住的光越多，影子變得【超大】！'
    }
  };

  btns.forEach(btn => {
    btn.onclick = () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const st = states[btn.dataset.mode];
      if (!st) return;
      if (onSwitchSound) onSwitchSound();
      lightEl.style.left = st.lightLeft;
      lightEl.style.top = st.lightTop;
      lightEl.textContent = st.icon;
      shadowEl.style.cssText = st.shadowStyle;
      noteEl.textContent = st.note;
    };
  });
}

function generateCraftDecoys(questionObj, existingTexts) {
  const used = new Set(existingTexts);
  const decoys = [];
  let pool = [];

  if (questionObj.subject === '數學') {
    const correctOpt = questionObj.options.find(o => o.isCorrect);
    const numMatch = correctOpt?.text.match(/\d+/);
    const unitSuffix = correctOpt?.text.replace(/^\d+\s*/, '') || '';
    if (numMatch) {
      const baseNum = parseInt(numMatch[0], 10);
      [-10, -8, -5, -2, -1, 1, 2, 5, 8, 10, 12, 15].forEach(off => {
        const val = baseNum + off;
        if (val > 0) pool.push(unitSuffix ? `${val} ${unitSuffix}` : `${val}`);
      });
    }
    pool.push('100', '90', '64', '48', '36', '25', '120');
  } else if (questionObj.subject === '生活') {
    pool = ['東邊', '西邊', '中午 12 點', '影子變長', '影子變短', '台灣欒樹', '松鼠', '撥打 119', '壓低身體', '影子在反方向'];
  } else {
    if (questionObj.question.includes('讀音')) {
      pool = ['ㄐㄧㄚ (一聲)', 'ㄉㄜˊ (二聲)', 'ㄓㄨㄢˇ (三聲)', 'ㄎㄨㄥ (一聲)', 'ㄅㄟˋ (四聲)', 'ㄐㄧㄠ (一聲)', 'ㄓㄨㄛˊ (二聲)', '˙ㄓㄜ (輕聲)'];
    } else if (questionObj.question.includes('部首') || questionObj.question.includes('部件')) {
      pool = ['水部', '火部', '木部', '口部', '手部', '心部', '糸部', '金部', '土部'];
    } else {
      pool = ['圓、園', '藍、籃', '准、準', '市、柿', '條、隻', '朵、張', '熱鬧', '分工', '微風'];
    }
  }

  for (const item of pool) {
    if (!used.has(item)) {
      used.add(item);
      decoys.push(item);
      if (decoys.length >= 6) break;
    }
  }
  while (decoys.length < 6) {
    decoys.push(`石頭 #${decoys.length + 1}`);
  }
  return decoys;
}

/**
 * 渲染「🛠️ 3x3 工作台合成九宮格」
 */
export function renderCraftingTableGrid(containerEl, questionObj, eliminatedIndices, onSelectOption, onDecoyMiss) {
  if (!containerEl || !questionObj) return;
  const optionTexts = questionObj.options.map(o => o.text);
  const decoys = generateCraftDecoys(questionObj, optionTexts);

  const slots = [
    ...questionObj.options.map((opt, idx) => ({
      type: 'option',
      opt,
      optIdx: idx,
      label: opt.text,
      eliminated: eliminatedIndices.has(idx)
    })),
    ...decoys.slice(0, 6).map(d => ({
      type: 'decoy',
      label: d,
      eliminated: false
    }))
  ];

  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  containerEl.innerHTML = '';
  slots.forEach((slot, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mc-craft-slot ${slot.eliminated ? 'slot-eliminated' : ''}`;
    btn.disabled = slot.eliminated;
    btn.innerHTML = `
      <span class="slot-num">#${idx + 1}</span>
      <span class="slot-label">${slot.label}</span>
    `;
    btn.onclick = () => {
      if (slot.type === 'option') {
        btn.classList.add(slot.opt.isCorrect ? 'slot-correct' : 'slot-wrong');
        onSelectOption(slot.opt, slot.optIdx);
      } else {
        btn.classList.add('slot-wrong');
        btn.disabled = true;
        if (onDecoyMiss) onDecoyMiss(slot.label);
      }
    };
    containerEl.appendChild(btn);
  });
}

/**
 * 繪製像素風「🏆 麥塊期中考屠龍英雄成就卡 (PNG)」並下載
 */
export function generateAndDownloadMinecraftCard(playerData) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1060;
  const ctx = canvas.getContext('2d');

  // 1. 終界深紫與黑曜石方塊背景
  const bg = ctx.createLinearGradient(0, 0, 800, 1060);
  bg.addColorStop(0, '#090d16');
  bg.addColorStop(0.5, '#1e1b4b');
  bg.addColorStop(1, '#14532d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 800, 1060);

  // 2. 綠寶石與黃金像素雙邊框
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 16;
  ctx.strokeRect(24, 24, 752, 1012);

  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, 712, 972);

  // 3. 頂部橫幅
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(60, 65, 680, 74);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⛏️ 國小二年級期中考・麥塊屠龍英雄成就卡', 400, 114);

  // 4. 方塊勇者披風徽章
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(290, 180, 220, 220);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 8;
  ctx.strokeRect(290, 180, 220, 220);

  ctx.fillStyle = '#fef08a';
  ctx.font = '900 88px "Segoe UI", sans-serif';
  ctx.fillText(`#${playerData.heroId || '99'}`, 400, 315);

  // 5. 勇者姓名與稱號
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`${playerData.playerName || '鑽石小勇者'}`, 400, 465);

  ctx.fillStyle = '#4ade80';
  ctx.font = '800 30px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`${playerData.rankTitle}`, 400, 515);

  // 6. 三大戰績方塊格 (精準率 / 爆擊數 / 屠龍總傷)
  const stats = [
    { label: '採礦精準率', val: playerData.accuracy, x: 165 },
    { label: 'TNT 爆擊數', val: String(playerData.crits), x: 400 },
    { label: '屠龍總傷害', val: String(playerData.damage), x: 635 }
  ];

  stats.forEach(s => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 3;
    ctx.fillRect(s.x - 105, 555, 210, 150);
    ctx.strokeRect(s.x - 105, 555, 210, 150);

    ctx.fillStyle = '#a7f3d0';
    ctx.font = '700 22px "Microsoft JhengHei", sans-serif';
    ctx.fillText(s.label, s.x, 600);

    ctx.fillStyle = '#facc15';
    ctx.font = '900 50px "Segoe UI", sans-serif';
    ctx.fillText(s.val, s.x, 675);
  });

  // 7. 裝備神兵與綠寶石存量
  ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
  ctx.fillRect(75, 740, 650, 125);
  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 740, 650, 125);

  ctx.fillStyle = '#dcfce7';
  ctx.font = '800 26px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`所持神兵：${playerData.weaponName} ｜ 綠寶石：🟢 ${playerData.emeralds}`, 400, 790);

  ctx.fillStyle = '#fef08a';
  ctx.font = '700 23px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`冒險領域：${playerData.modeLabel || '綜合大滿貫 (康軒國語 + 翰林數學)'}`, 400, 838);

  const todayStr = new Date().toISOString().slice(0, 10);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '700 22px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`🏅 108 課綱二上期中考麥塊冒險認證 ｜ 日期：${todayStr}`, 400, 935);

  ctx.fillStyle = '#4ade80';
  ctx.font = '800 20px "Microsoft JhengHei", sans-serif';
  ctx.fillText('「用知識合成鑽石神鎬，沒有挖不開的期中考題！」', 400, 978);

  const link = document.createElement('a');
  link.download = `麥塊英雄卡_${playerData.playerName || '鑽石勇者'}_編號${playerData.heroId || '99'}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
