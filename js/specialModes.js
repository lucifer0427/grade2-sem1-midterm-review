/**
 * Phase 2 & Phase 3 學科專屬棒球互動機制與球員卡產生器
 * 包含：
 * 1. 外野邊線爭議：互動式斷尺視覺量測台 (RulerChallenge - 翰林數學第 3 單元)
 * 2. 盜壘衝刺連鎖：兩步驟分步解題導引 (BaseRunningChain - 翰林數學第 4 單元)
 * 3. 王牌投手九宮格：3x3 好球帶靶心擊碎模式 (PitchingChallenge - 國語挑錯字/部首 & 數學心算)
 * 4. 傳奇 MVP 球員卡：HTML5 Canvas 高解析度繪製與 PNG 下載
 */

// 數學第 3 單元：斷尺與直尺視覺化配置表（防視覺洩題設計）
const RULER_CONFIGS = {
  math_25: { item: '✏️ 鉛筆', itemColor: '#f59e0b', rulerMin: 2, rulerMax: 10, startTick: 3, endTick: 9, brokenLeft: true },
  math_26: { item: '🧼 橡皮擦', itemColor: '#38bdf8', rulerMin: 4, rulerMax: 12, startTick: 5, endTick: 11, brokenLeft: true },
  math_32: { item: '🖍️ 粉筆', itemColor: '#a855f7', rulerMin: 1, rulerMax: 9, startTick: 2, endTick: 8, brokenLeft: true },
  math_33: { item: '📏 從 0 畫 7 大格到哪裡？', itemColor: '#22c55e', rulerMin: 0, rulerMax: 9, startTick: 0, endTick: 7, brokenLeft: false, hideEndLabel: true, hideObjectBar: true }
};

// 數學第 4 單元：兩步驟應用題「一壘盜二壘（第一步中間量）」配置表
const TWO_STEP_CHAINS = {
  math_35: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】32 瓶水喝掉 14 瓶，先算剩下幾瓶？',
    choices: ['18 瓶', '28 瓶', '46 瓶'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】剩下 18 瓶，教練又搬來 20 瓶（18 + 20），請揮棒選最終答案！'
  },
  math_36: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】公車原有 25 人，下車 8 人，先算車上剩幾人？',
    choices: ['17 人', '33 人', '18 人'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】車上剩 17 人，又上來 12 人（17 + 12），請揮棒選最終答案！'
  },
  math_37: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】買 15 元鉛筆和 20 元筆記本，先算一共花掉多少元？',
    choices: ['35 元', '25 元', '30 元'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】原有 50 元，扣掉花掉的 35 元（50 - 35），請揮棒選最終答案！'
  },
  math_38: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】16 朵紅花和 24 朵黃花，先算花園全部有幾朵花？',
    choices: ['40 朵', '30 朵', '38 朵'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】全部有 40 朵，媽媽採走 15 朵（40 - 15），請揮棒選最終答案！'
  },
  math_39: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】二甲借走 22 顆、二乙借走 18 顆，先算兩班共借走幾顆？',
    choices: ['40 顆', '30 顆', '38 顆'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】箱子原有 60 顆，扣掉共借走的 40 顆（60 - 40），請揮棒選最終答案！'
  },
  math_40: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】哥哥有 42 張，弟弟比哥哥少 15 張，先算弟弟有幾張？',
    choices: ['27 張', '37 張', '57 張'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】哥哥 42 張加上弟弟 27 張（42 + 27），請揮棒選最終答案！'
  },
  math_41: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】早上賣出 38 個、下午賣出 27 個，先算共賣出幾個蛋塔？',
    choices: ['65 個', '55 個', '63 個'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】烤了 85 個，扣掉賣出的 65 個（85 - 65），請揮棒選最終答案！'
  },
  math_42: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】小美原有 18 顆糖，爸爸給她 15 顆，先算合起來有幾顆？',
    choices: ['33 顆', '23 顆', '35 顆'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】共有 33 顆，吃掉 7 顆（33 - 7），請揮棒選最終答案！'
  },
  math_43: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】男生有 26 人，女生比男生多 9 人，先算女生有幾人？',
    choices: ['35 人', '17 人', '34 人'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】男生 26 人加上女生 35 人（26 + 35），請揮棒選最終答案！'
  },
  math_44: {
    step1Prompt: '🏃‍♂️ 【第一步盜二壘】原有 52 輛車，開走 19 輛，先算剩下幾輛車？',
    choices: ['33 輛', '43 輛', '37 輛'],
    correctIdx: 0,
    step2Prompt: '🔥 【第二步衝本壘】剩下 33 輛，又開進來 14 輛（33 + 14），請揮棒選最終答案！'
  }
};

/**
 * 渲染「外野邊線爭議：3D 斷尺互動量測器」
 */
export function renderRulerWidget(containerEl, questionObj, onArcStepSound) {
  if (!containerEl) return;
  const cfg = RULER_CONFIGS[questionObj?.id];
  if (!cfg) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');
  const ticks = [];
  for (let t = cfg.rulerMin; t <= cfg.rulerMax; t++) {
    ticks.push(t);
  }
  const totalSpan = cfg.rulerMax - cfg.rulerMin;
  const leftPct = ((cfg.startTick - cfg.rulerMin) / totalSpan) * 100;
  const widthPct = ((cfg.endTick - cfg.startTick) / totalSpan) * 100;

  let ticksHtml = '';
  ticks.forEach(t => {
    const posPct = ((t - cfg.rulerMin) / totalSpan) * 100;
    const isStart = t === cfg.startTick;
    const isEnd = t === cfg.endTick && !cfg.hideEndLabel;
    const badgeClass = isStart ? 'tick-highlight-start' : isEnd ? 'tick-highlight-end' : '';
    ticksHtml += `
      <div class="ruler-tick" style="left: ${posPct}%;">
        <div class="tick-line"></div>
        <div class="tick-num ${badgeClass}">${t}</div>
      </div>
    `;
  });

  // 產生每一大格的跳躍圓弧 (預設隱藏，點擊按鈕後逐一亮起)
  let arcsHtml = '';
  const totalJumps = cfg.endTick - cfg.startTick;
  for (let i = 0; i < totalJumps; i++) {
    const arcLeft = ((cfg.startTick + i - cfg.rulerMin) / totalSpan) * 100;
    const arcWidth = (1 / totalSpan) * 100;
    arcsHtml += `
      <div class="ruler-jump-arc hidden" data-jump-idx="${i}" style="left: ${arcLeft}%; width: ${arcWidth}%;">
        <span class="arc-badge">+1大格</span>
      </div>
    `;
  }

  containerEl.innerHTML = `
    <div class="ruler-challenge-box">
      <div class="ruler-header">
        <span>📐 <b>外野實測雷達</b>：${cfg.brokenLeft ? '⚠️ 斷尺注意！起點不是 0 喔！' : '標準直尺對齊刻度 0'}</span>
        ${!cfg.highlightZero ? `<button type="button" class="ruler-hop-btn" id="btn-ruler-hop">🐸 點我數數看有幾大格</button>` : ''}
      </div>
      <div class="ruler-visual-area">
        ${!cfg.hideObjectBar ? `
        <div class="measured-object" style="left: ${leftPct}%; width: ${widthPct}%; background: ${cfg.itemColor};">
          <span>${cfg.item}</span>
        </div>` : ''}
        ${arcsHtml}
        <div class="ruler-body ${cfg.brokenLeft ? 'ruler-broken-left' : ''}">
          ${ticksHtml}
        </div>
      </div>
    </div>
  `;

  const hopBtn = containerEl.querySelector('#btn-ruler-hop');
  if (hopBtn) {
    let shownCount = 0;
    hopBtn.onclick = () => {
      const arcs = containerEl.querySelectorAll('.ruler-jump-arc');
      if (shownCount < arcs.length) {
        arcs[shownCount].classList.remove('hidden');
        shownCount++;
        if (onArcStepSound) onArcStepSound();
        if (shownCount < arcs.length) {
          hopBtn.textContent = `🐸 已跳 ${shownCount} 大格... 再點一下繼續跳！`;
        } else {
          hopBtn.textContent = `✅ 從刻度 ${cfg.startTick} 跳到 ${cfg.endTick}，總共跳了幾大格？快揮棒！`;
          hopBtn.disabled = true;
        }
      }
    };
  }
}

/**
 * 渲染「盜壘衝刺：兩步驟數學連鎖解題」
 */
export function renderBaseRunningChainWidget(containerEl, questionObj, onStep1Success) {
  if (!containerEl) return;
  const chain = TWO_STEP_CHAINS[questionObj?.id];
  if (!chain) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');

  // 隨機打亂第一步的 3 個中間量選項，避免正確答案固定在第一個按鈕
  const shuffledChoices = chain.choices.map((cText, origIdx) => ({
    text: cText,
    isCorrect: origIdx === chain.correctIdx
  }));
  for (let i = shuffledChoices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledChoices[i], shuffledChoices[j]] = [shuffledChoices[j], shuffledChoices[i]];
  }

  const choicesHtml = shuffledChoices
    .map((item, idx) => `<button type="button" class="chain-choice-btn" data-idx="${idx}">${item.text}</button>`)
    .join('');

  containerEl.innerHTML = `
    <div class="baserun-chain-box">
      <div class="chain-step-row" id="chain-step1-row">
        <span class="chain-title">${chain.step1Prompt}</span>
        <div class="chain-choices">${choicesHtml}</div>
      </div>
      <div class="chain-step2-banner hidden" id="chain-step2-row">
        ✅ <b>成功盜上二壘 (+10💰)！</b> ${chain.step2Prompt}
      </div>
    </div>
  `;

  const btns = containerEl.querySelectorAll('.chain-choice-btn');
  btns.forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.dataset.idx);
      const picked = shuffledChoices[idx];
      if (picked && picked.isCorrect) {
        btn.classList.add('chain-correct');
        btns.forEach(b => (b.disabled = true));
        const step2Row = containerEl.querySelector('#chain-step2-row');
        if (step2Row) step2Row.classList.remove('hidden');
        if (onStep1Success) onStep1Success(picked.text);
      } else {
        btn.classList.add('chain-wrong');
        btn.disabled = true;
      }
    };
  });
}

/**
 * 渲染生活科第 2 單元「☀️ 球場光與影子互動實驗室」
 * 讓學童親自切換早晨（東）、中午（正上方）、傍晚（西）與手電筒遠近，觀察影子方向與長短
 */
export function renderShadowLabWidget(containerEl, questionObj, onSwitchSound) {
  if (!containerEl) return;
  const isLightShadowUnit = questionObj?.subject === '生活' && questionObj?.unit?.includes('光與影子');
  if (!isLightShadowUnit) {
    containerEl.innerHTML = '';
    containerEl.classList.add('hidden');
    return;
  }

  containerEl.classList.remove('hidden');
  containerEl.innerHTML = `
    <div class="shadow-lab-box">
      <div class="shadow-lab-header">
        <span>☀️ <b>球場光影實驗雷達</b>：點選不同光源位置，觀察打者影子的方向與長短！</span>
        <div class="shadow-lab-btns">
          <button type="button" class="shadow-mode-btn" data-mode="morning">🌅 早晨太陽在東(左)</button>
          <button type="button" class="shadow-mode-btn" data-mode="noon">☀️ 中午12點(正上方)</button>
          <button type="button" class="shadow-mode-btn" data-mode="evening">🌇 傍晚太陽在西(右)</button>
          <button type="button" class="shadow-mode-btn" data-mode="torch_near">🔦 手電筒靠近</button>
        </div>
      </div>
      <div class="shadow-stage" id="shadow-stage-area">
        <div class="compass-tag compass-east">東 (左)</div>
        <div class="compass-tag compass-west">西 (右)</div>
        <div class="light-source-icon" id="lab-light-icon" style="left: 50%; top: 4px;">☀️</div>
        <div class="shadow-caster-player">⚾打者</div>
        <div class="casted-shadow" id="lab-casted-shadow" style="width: 34px; transform: translateX(-50%);">影子</div>
        <div class="shadow-lab-note" id="lab-obs-note">👆 點擊上方按鈕做實驗，看看影子會往哪邊跑、變長還是變短！</div>
      </div>
    </div>
  `;

  const btns = containerEl.querySelectorAll('.shadow-mode-btn');
  const lightEl = containerEl.querySelector('#lab-light-icon');
  const shadowEl = containerEl.querySelector('#lab-casted-shadow');
  const noteEl = containerEl.querySelector('#lab-obs-note');

  const states = {
    morning: {
      lightLeft: '14%',
      lightTop: '14px',
      icon: '🌅',
      shadowStyle: 'left: 50%; width: 96px; height: 12px; transform: translateX(6px);',
      note: '🔍 觀察結果：太陽在【東邊(左)】偏低 ➔ 影子指向相反的【西邊(右)】，而且【長長的】！'
    },
    noon: {
      lightLeft: '50%',
      lightTop: '2px',
      icon: '☀️',
      shadowStyle: 'left: 50%; width: 26px; height: 10px; transform: translateX(-50%);',
      note: '🔍 觀察結果：中午 12 點太陽在【頭頂正上方最高處】 ➔ 腳下的影子【最短】！'
    },
    evening: {
      lightLeft: '86%',
      lightTop: '14px',
      icon: '🌇',
      shadowStyle: 'left: 50%; width: 96px; height: 12px; transform: translateX(-102px);',
      note: '🔍 觀察結果：太陽在【西邊(右)】偏低 ➔ 影子指向相反的【東邊(左)】，而且【長長的】！'
    },
    torch_near: {
      lightLeft: '36%',
      lightTop: '20px',
      icon: '🔦',
      shadowStyle: 'left: 50%; width: 125px; height: 18px; transform: translateX(8px);',
      note: '🔍 觀察結果：手電筒（光源）越【靠近】物體 ➔ 擋住的光越多，影子變得【超大】！'
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

/**
 * 產生九宮格好球帶干擾靶板詞庫
 */
function generateDecoyLabels(questionObj, existingTexts) {
  const used = new Set(existingTexts);
  const decoys = [];

  let pool = [];
  if (questionObj.subject === '數學') {
    const correctOpt = questionObj.options.find(o => o.isCorrect);
    const numMatch = correctOpt?.text.match(/\d+/);
    const unitSuffix = correctOpt?.text.replace(/^\d+\s*/, '') || '';
    if (numMatch) {
      const baseNum = parseInt(numMatch[0], 10);
      const offsets = [-12, -10, -8, -5, -2, -1, 1, 2, 4, 8, 10, 12, 15, 20];
      offsets.forEach(off => {
        const val = baseNum + off;
        if (val > 0) pool.push(unitSuffix ? `${val} ${unitSuffix}` : `${val}`);
      });
    }
    pool.push('100', '99', '50', '45', '36', '28', '72', '120', '60');
  } else if (questionObj.subject === '生活') {
    pool = ['東邊', '西邊', '中午 12 點', '影子變長', '影子變短', '台灣欒樹', '松鼠', '撥打 119', '壓低身體', '影子在反方向'];
  } else {
    if (questionObj.question.includes('讀音')) {
      pool = ['ㄐㄧㄚ (一聲)', 'ㄉㄜˊ (二聲)', 'ㄓㄨㄢˇ (三聲)', 'ㄎㄨㄥ (一聲)', 'ㄅㄟˋ (四聲)', 'ㄐㄧㄠ (一聲)', 'ㄓㄨㄛˊ (二聲)', '˙ㄓㄜ (輕聲)', 'ㄏㄠˇ (三聲)'];
    } else if (questionObj.question.includes('部首') || questionObj.question.includes('部件')) {
      pool = ['水部', '火部', '木部', '口部', '手部', '心部', '糸部', '金部', '土部', '言部'];
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
    const fallback = `壞球 #${decoys.length + 1}`;
    decoys.push(fallback);
  }
  return decoys;
}

/**
 * 渲染「好球帶九宮格投球機 (3x3 靶心板)」
 */
export function renderStrikeZoneGrid(containerEl, questionObj, eliminatedIndices, onSelectOption, onDecoyMiss) {
  if (!containerEl || !questionObj) return;

  const optionTexts = questionObj.options.map(o => o.text);
  const decoys = generateDecoyLabels(questionObj, optionTexts);

  // 建立 9 宮格項目：包含 3 個真實選項 + 6 個干擾壞球區，固定洗牌位置
  const cells = [
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

  // 依據題目 ID 做穩定或隨機排列
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  containerEl.innerHTML = '';
  cells.forEach((cell, cellNumber) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `sz-plate ${cell.eliminated ? 'sz-eliminated' : ''}`;
    btn.disabled = cell.eliminated;
    btn.innerHTML = `
      <span class="sz-num">${cellNumber + 1}</span>
      <span class="sz-label">${cell.label}</span>
    `;

    btn.onclick = () => {
      if (cell.type === 'option') {
        btn.classList.add(cell.opt.isCorrect ? 'sz-hit-correct' : 'sz-hit-wrong');
        onSelectOption(cell.opt, cell.optIdx);
      } else {
        btn.classList.add('sz-hit-wrong');
        btn.disabled = true;
        if (onDecoyMiss) onDecoyMiss(cell.label);
      }
    };

    containerEl.appendChild(btn);
  });
}

/**
 * 使用 HTML5 Canvas 繪製高解析度「期中考大聯盟 MVP 傳奇球員卡」並觸發下載
 */
export function generateAndDownloadPlayerCard(playerData) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1060;
  const ctx = canvas.getContext('2d');

  // 1. 深邃星光漸層背景
  const bgGrad = ctx.createLinearGradient(0, 0, 800, 1060);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 1060);

  // 2. 璀璨金色雙層外框
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 14;
  ctx.strokeRect(24, 24, 752, 1012);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, 716, 976);

  // 3. 頂部聯盟認證橫幅
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(60, 65, 680, 72);
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 34px "Microsoft JhengHei", "PingFang TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚾ 國小二年級期中考大聯盟・傳奇球員卡', 400, 113);

  // 4. 球員球衣背號大徽章與稱號
  ctx.save();
  ctx.beginPath();
  ctx.arc(400, 290, 115, 0, Math.PI * 2);
  const circleGrad = ctx.createRadialGradient(400, 290, 20, 400, 290, 115);
  circleGrad.addColorStop(0, '#2563eb');
  circleGrad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = circleGrad;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#fef08a';
  ctx.font = '900 92px "Segoe UI", "Microsoft JhengHei", sans-serif';
  ctx.fillText(`#${playerData.jerseyNumber || '99'}`, 400, 320);

  // 5. 選手姓名與獲得稱號
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 44px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`${playerData.playerName || '台灣小巨砲'} 選手`, 400, 465);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 30px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`${playerData.rankTitle}`, 400, 515);

  // 6. 戰績數據格 (AVG / HR / RBI)
  const statBoxes = [
    { label: '打擊率 (AVG)', val: playerData.avg, x: 165 },
    { label: '全壘打 (HR)', val: String(playerData.homeRuns), x: 400 },
    { label: '總打點 (RBI)', val: String(playerData.score), x: 635 }
  ];

  statBoxes.forEach(box => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.fillRect(box.x - 105, 555, 210, 150);
    ctx.strokeRect(box.x - 105, 555, 210, 150);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 22px "Microsoft JhengHei", sans-serif';
    ctx.fillText(box.label, box.x, 600);

    ctx.fillStyle = '#facc15';
    ctx.font = '900 54px "Segoe UI", sans-serif';
    ctx.fillText(box.val, box.x, 675);
  });

  // 7. 裝備神兵與累積賞金
  ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
  ctx.fillRect(75, 740, 650, 125);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 740, 650, 125);

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '800 26px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`所持神兵：${playerData.batName} ｜ 累積金幣：💰 ${playerData.coins}`, 400, 790);

  ctx.fillStyle = '#fef08a';
  ctx.font = '700 23px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`挑戰科目：${playerData.modeLabel || '綜合大滿貫 (康軒國語 + 翰林數學)'}`, 400, 838);

  // 8. 底部認證簽名與日期
  const todayStr = new Date().toISOString().slice(0, 10);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '700 22px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`🏅 108 課綱二上期中考複習認證 ｜ 日期：${todayStr}`, 400, 935);

  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 20px "Microsoft JhengHei", sans-serif';
  ctx.fillText('「每一次揮棒思考，都是邁向滿分全壘打的超能力！」', 400, 978);

  // 觸發 PNG 下載
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `MVP球員卡_${playerData.playerName || '小巨砲'}_背號${playerData.jerseyNumber || '99'}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
