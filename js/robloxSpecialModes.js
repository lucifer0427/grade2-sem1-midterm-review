/**
 * 國小二年級期中考：Roblox 跑酷專屬學科機關與傳奇英雄卡模組 (RobloxSpecialModes)
 * 機關清單：
 * 1. 霓虹雷射斷尺測量儀 (Laser Tape Measure - 數學第 3 單元非零起點)
 * 2. 雙重高空彈簧跳床 (Double Trampoline Chain - 數學第 4 單元兩步驟應用題)
 * 3. 探照燈暗影實驗室 (Searchlight Shadow Lab - 生活科第 2 單元光與影子)
 * 4. 霓虹九宮格跳舞踏板 (Neon Obby Dance Grid)
 * 5. 傳奇 Obby 跑酷王獎狀卡 Canvas 匯出
 */
import { escapeHTML } from './gameLogic.js';

// 1. 霓虹雷射斷尺測量跑道 (Laser Tape Measure)
export function renderLaserRulerWidget(container, question, onStepSound) {
  if (!container) return;
  const match = question.question.match(/\[(\d+)\s*公分\][^\d]*\[(\d+)\s*公分\]/);
  if (!match) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const startCm = parseInt(match[1], 10);
  const endCm = parseInt(match[2], 10);
  const actualLen = endCm - startCm;

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="roblox-laser-ruler-card">
      <div class="ruler-title">⚡ 霓虹雷射尺跑道：非零起點雷射光感應測量</div>
      <div class="ruler-sub">雷射起點：<b style="color:#38bdf8;">${startCm} cm</b> ｜ 終點：<b style="color:#f43f5e;">${endCm} cm</b></div>
      
      <div class="ruler-track" id="laser-ruler-track">
        <div class="laser-beam start-laser" style="left: ${((startCm - 1) / 14) * 100}%;">
          <div class="laser-tag">起點 ${startCm}cm</div>
        </div>
        <div class="laser-target-obj" style="left: ${((startCm - 1) / 14) * 100}%; width: ${(actualLen / 14) * 100}%;">
          🧲 磁浮跑酷滑塊 (長度：${actualLen} cm)
        </div>
        <div class="laser-beam end-laser" style="left: ${((endCm - 1) / 14) * 100}%;">
          <div class="laser-tag">終點 ${endCm}cm</div>
        </div>
      </div>

      <div class="ruler-action-row">
        <button type="button" class="roblox-btn-step" id="btn-laser-jump">
          🌀 一格一格跳大格數數看 (${startCm} ➔ ${endCm})
        </button>
        <span class="ruler-formula-hint">💡 口訣：終點 ${endCm} - 起點 ${startCm} ＝ <b>${actualLen} 公分</b></span>
      </div>
    </div>
  `;

  const btnJump = container.querySelector('#btn-laser-jump');
  if (btnJump) {
    btnJump.onclick = () => {
      if (onStepSound) onStepSound();
      btnJump.style.transform = 'scale(0.95)';
      setTimeout(() => (btnJump.style.transform = ''), 120);
    };
  }
}

// 2. 雙重高空彈簧跳床 (Double Trampoline Chain)
export function renderTrampolineChainWidget(container, question, onStep1Correct) {
  if (!container) return;
  const match = question.hint.match(/第一步[^\d]*(\d+)\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/);
  if (!match) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const [_, a, op, b, ans1] = match;
  const numAns1 = parseInt(ans1, 10);
  const decoys = [numAns1 - 5, numAns1 + 8, numAns1 + 2].filter(x => x > 0 && x !== numAns1);
  const options1 = [numAns1, decoys[0], decoys[1]].sort(() => Math.random() - 0.5);

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="roblox-chain-card">
      <div class="chain-title">🌀 雙重高空彈簧跳床：先踩第一座彈簧算中間量 (+10 R$)</div>
      <div class="chain-step-hint">第一步計算：【${a} ${op} ${b} ＝ ？】</div>
      <div class="trampoline-options-row" id="tramp-opts-row">
        ${options1
          .map(
            val => `
          <button type="button" class="tramp-chip" data-val="${val}">
            🟡 彈簧踩跳：${val}
          </button>
        `
          )
          .join('')}
      </div>
      <div id="tramp-success-banner" class="hidden tramp-success">
        🎉 成功踩上第一跳！中繼量為 <b>${numAns1}</b>！現在踩上第二座彈簧直衝終點！
      </div>
    </div>
  `;

  const chips = container.querySelectorAll('.tramp-chip');
  const banner = container.querySelector('#tramp-success-banner');

  chips.forEach(btn => {
    btn.onclick = () => {
      const val = parseInt(btn.dataset.val, 10);
      if (val === numAns1) {
        chips.forEach(c => (c.disabled = true));
        btn.classList.add('tramp-chip-correct');
        if (banner) banner.classList.remove('hidden');
        if (onStep1Correct) onStep1Correct(numAns1);
      } else {
        btn.classList.add('tramp-chip-wrong');
        btn.disabled = true;
      }
    };
  });
}

// 3. 探照燈暗影實驗室 (Searchlight Shadow Lab)
export function renderSearchlightShadowWidget(container, onLightChange) {
  if (!container) return;

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="roblox-shadow-card">
      <div class="shadow-title">🔦 探照燈暗影實驗室：觀察 Roblox 積木人陰影規律</div>
      <div class="light-btn-group">
        <button type="button" class="light-btn active" data-mode="east">🌅 東方朝陽 (影在西・長)</button>
        <button type="button" class="light-btn" data-mode="noon">☀️ 正午頭頂 (影在腳下・極短)</button>
        <button type="button" class="light-btn" data-mode="west">🌇 西方夕陽 (影在東・長)</button>
        <button type="button" class="light-btn" data-mode="close">🔦 手電筒靠近 (影子變大)</button>
      </div>
      <div class="shadow-stage-box" id="shadow-stage">
        <div class="shadow-lamp" id="stage-lamp">🔦</div>
        <div class="robloxian-silhouette">🤖</div>
        <div class="cast-shadow-block" id="stage-shadow"></div>
      </div>
      <div class="shadow-tip" id="shadow-tip">💡 規律：影子永遠出現在光源的「相反方向」！</div>
    </div>
  `;

  const lamp = container.querySelector('#stage-lamp');
  const shadow = container.querySelector('#stage-shadow');
  const tip = container.querySelector('#shadow-tip');
  const buttons = container.querySelectorAll('.light-btn');

  const updateState = mode => {
    buttons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
    if (mode === 'east') {
      lamp.style.left = '15%';
      lamp.style.top = '25%';
      shadow.style.left = '65%';
      shadow.style.width = '70px';
      shadow.style.height = '14px';
      tip.textContent = '💡 太陽在東邊，影子落在西邊，早晨斜射影子較長！';
    } else if (mode === 'noon') {
      lamp.style.left = '50%';
      lamp.style.top = '10%';
      shadow.style.left = '48%';
      shadow.style.width = '35px';
      shadow.style.height = '12px';
      tip.textContent = '💡 中午 12 點太陽在頭頂正上方，影子在腳底下最微小！';
    } else if (mode === 'west') {
      lamp.style.left = '85%';
      lamp.style.top = '25%';
      shadow.style.left = '25%';
      shadow.style.width = '70px';
      shadow.style.height = '14px';
      tip.textContent = '💡 傍晚太陽在西邊，影子落在東邊，夕陽斜射影子很長！';
    } else if (mode === 'close') {
      lamp.style.left = '38%';
      lamp.style.top = '35%';
      shadow.style.left = '58%';
      shadow.style.width = '95px';
      shadow.style.height = '24px';
      tip.textContent = '💡 手電筒越靠近積木人，擋住的光線越多，影子變得越大！';
    }
    if (onLightChange) onLightChange(mode);
  };

  buttons.forEach(btn => {
    btn.onclick = () => updateState(btn.dataset.mode);
  });
  updateState('east');
}

// 4. 霓虹九宮格跳舞踏板 (Neon Obby Dance Grid)
export function renderObbyGridPad(container, question, onSelectOption, onMiss) {
  if (!container || !question) return;

  const validOpts = question.options.map((opt, i) => ({ ...opt, origIndex: i }));
  const decoys = [
    { text: '⚠️ 紅色致命熔岩', isDecoy: true },
    { text: '🌀 空轉虛空踏板', isDecoy: true },
    { text: '⚡ 漏電雷射格', isDecoy: true },
    { text: '🧱 易碎豆腐方塊', isDecoy: true },
    { text: '🌫️ 幽靈迷霧格', isDecoy: true },
    { text: '🚫 封鎖禁行區', isDecoy: true }
  ];
  const gridCells = [...validOpts, ...decoys].sort(() => Math.random() - 0.5).slice(0, 9);

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="roblox-grid-card">
      <div class="grid-title">🟩 霓虹安全方塊九宮格：踩中正確答案踏板立即通關！</div>
      <div class="grid-arena" id="lobby-grid">
        ${gridCells
          .map(
            (c, i) => `
          <button type="button" class="grid-plate ${c.isDecoy ? 'decoy-plate' : 'choice-plate'}" data-idx="${i}">
            <span class="plate-text">${escapeHTML(c.text)}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  const plates = container.querySelectorAll('.grid-plate');
  plates.forEach((p, idx) => {
    const data = gridCells[idx];
    p.onclick = () => {
      if (data.isDecoy) {
        p.classList.add('plate-broken');
        p.disabled = true;
        if (onMiss) onMiss(data.text);
      } else {
        plates.forEach(pl => (pl.disabled = true));
        p.classList.add('plate-active');
        setTimeout(() => {
          container.classList.add('hidden');
          container.innerHTML = '';
          if (onSelectOption) onSelectOption(data, data.origIndex);
        }, 150);
      }
    };
  });
}

// 5. 傳奇 Obby 跑酷王獎狀卡 Canvas 匯出 (Download PNG)
export function generateAndDownloadRobloxCard({
  playerName = '極限跑酷王',
  robux = 0,
  stageCleared = 9,
  accuracy = '100%',
  rankTitle = '👑 傳奇 Obby 跑酷戰神',
  totalStages = 9
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 680;
  canvas.height = 860;
  const ctx = canvas.getContext('2d');

  // 背景：深邃賽博藍 + 霓虹邊框
  const grad = ctx.createLinearGradient(0, 0, 680, 860);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 680, 860);

  // 霓虹金邊
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#facc15';
  ctx.strokeRect(10, 10, 660, 840);

  // 頂部標題
  ctx.fillStyle = '#facc15';
  ctx.font = '900 36px "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏆 ROBLOX OBBY CHAMPION', 340, 75);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 22px "Microsoft JhengHei", sans-serif';
  ctx.fillText('國小二年級期中考：極限障礙跑酷通關認證', 340, 115);

  // 積木人獎章底盤
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.beginPath();
  ctx.arc(340, 260, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#38bdf8';
  ctx.stroke();

  // 積木人 Noob 像素插圖 (黃頭藍身)
  ctx.fillStyle = '#fde047'; // 頭
  ctx.fillRect(305, 175, 70, 65);
  ctx.fillStyle = '#0284c7'; // 軀幹
  ctx.fillRect(295, 240, 90, 80);
  ctx.fillStyle = '#fde047'; // 手
  ctx.fillRect(270, 240, 25, 75);
  ctx.fillRect(385, 240, 25, 75);
  ctx.fillStyle = '#16a34a'; // 腿
  ctx.fillRect(300, 320, 36, 65);
  ctx.fillRect(344, 320, 36, 65);
  // 眼睛與笑臉
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(320, 195, 10, 10);
  ctx.fillRect(350, 195, 10, 10);
  ctx.fillRect(328, 220, 24, 6);

  // 玩家稱號與姓名
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 32px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`🎮 跑酷勇者：${playerName}`, 340, 440);

  ctx.fillStyle = '#4ade80';
  ctx.font = '800 24px "Microsoft JhengHei", sans-serif';
  ctx.fillText(rankTitle, 340, 485);

  // 數據網格卡片
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(50, 520, 580, 200);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 20px "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('通關層數：', 85, 570);
  ctx.fillText('期中考正確率：', 85, 620);
  ctx.fillText('累積 R$ 蘿蔔幣：', 85, 670);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#facc15';
  ctx.font = '900 24px "Microsoft JhengHei", sans-serif';
  ctx.fillText(`第 ${stageCleared} / ${totalStages} 關`, 595, 570);
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(accuracy, 595, 620);
  ctx.fillStyle = '#4ade80';
  ctx.fillText(`${robux} R$`, 595, 670);

  // 底部認證章
  ctx.fillStyle = '#64748b';
  ctx.font = '600 16px "Microsoft JhengHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('108 課綱 康軒國語 ｜ 翰林數學 ｜ 生活課程 實境檢定完成', 340, 770);
  ctx.fillText(new Date().toLocaleDateString('zh-TW') + ' 官方正式頒發', 340, 798);

  const link = document.createElement('a');
  link.download = `Roblox_Obby_Champion_${playerName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// 別名匯出，確保相容性
export { renderTrampolineChainWidget as renderRobloxTrampolineWidget };
export { renderSearchlightShadowWidget as renderRobloxShadowWidget };
