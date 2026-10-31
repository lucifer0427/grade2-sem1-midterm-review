/**
 * 國小二年級期中考複習：純邏輯與規則結算模組 (無 DOM 依賴，100% 可單元測試)
 */

/**
 * 跑壘進壘與得分推進結算
 * @param {boolean[]} currentBases - 目前壘包狀態 [一壘, 二壘, 三壘]
 * @param {number} hitBases - 安打類型 (1=一壘打, 2=二壘打, 3=三壘打, 4=全壘打)
 * @returns {{ newBases: boolean[], runsScored: number }}
 */
export function advanceRunners(currentBases = [false, false, false], hitBases = 1) {
  let runsScored = 0;
  const newBases = [false, false, false];

  // 壘上現有跑者由三壘往一壘依序推進
  for (let i = 2; i >= 0; i--) {
    if (currentBases[i]) {
      const destBase = i + hitBases;
      if (destBase >= 3) {
        runsScored++;
      } else {
        newBases[destBase] = true;
      }
    }
  }

  // 打者本人推進
  if (hitBases >= 4) {
    runsScored++;
  } else if (hitBases >= 1) {
    newBases[hitBases - 1] = true;
  }

  return { newBases, runsScored };
}

/**
 * 揮棒擊球落點與壘打數判定
 * @param {number} powerPos - 揮棒能量條光標位置 (0.0 ~ 1.0，0.5 為正中心)
 * @param {number} combo - 當前連擊次數
 * @param {string} equippedBat - 裝備球棒 ID ('wood' | 'thunder' | 'dragon' | 'rainbow')
 * @param {string} equippedPet - 裝備寵物 ID
 * @returns {number} 1=一壘打, 2=二壘打, 4=全壘打
 */
export function evaluateHitBases(powerPos = 0.5, combo = 0, equippedBat = 'wood', equippedPet = '') {
  const distFromCenter = Math.abs(powerPos - 0.5);
  const sweetThreshold = equippedBat === 'thunder' ? 0.22 : 0.14;

  if (distFromCenter <= sweetThreshold || combo >= 5) {
    return 4; // HOME RUN
  } else if (distFromCenter <= 0.28 || equippedBat === 'dragon' || equippedPet === 'minidragon') {
    return 2; // DOUBLE 二壘打
  }
  return 1; // SINGLE 一壘打
}

/**
 * 金幣獎勵計算 (支援 QTE 加成、球棒、寵物、球場設施、閃電懸賞與雙倍磁鐵疊加)
 */
export function calculateBaseballCoins({
  isHR = false,
  wasBasesLoaded = false,
  hitBases = 1,
  qteBonus = 0,
  isDragonBat = false,
  petBonus = 0,
  buildBonus = 0,
  blitzBonus = 0,
  encounterMultiplier = 1,
  isRainbowBat = false,
  hasCoinMagnet = false
}) {
  let baseCoins = isHR ? (wasBasesLoaded ? 80 : 40) : hitBases === 2 ? 25 : 15;
  let total = baseCoins + qteBonus;

  if (isDragonBat) total += 15;
  total += petBonus;
  total += buildBonus;
  total += blitzBonus;

  if (encounterMultiplier > 1) total *= encounterMultiplier;
  if (isRainbowBat) total *= 2;
  if (hasCoinMagnet) total *= 2;

  return Math.round(total);
}

/**
 * HTML 特殊字元轉義 (安全過濾 XSS)
 */
export function escapeHTML(rawText = '') {
  return String(rawText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
