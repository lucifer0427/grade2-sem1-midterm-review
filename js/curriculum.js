/**
 * 題庫匯總與智慧抽題模組 (國語 50 題 + 數學 50 題 + 生活 50 題 = 共 150 題)
 * 支援：
 * 1. 科目與單元專項篩選（國語 5 大題型專項 + 數學 5 大單元專項 + 生活 4 大單元專項）
 * 2. 未作答優先智慧抽題池（Seen-question tracking），確保 150 題均勻覆蓋不重複
 * 3. Fisher-Yates 隨機洗牌與左/中/右外野選項順序打亂
 */
import { CHINESE_QUESTIONS } from './questions/chinese.js';
import { MATH_QUESTIONS } from './questions/math.js';
import { LIFE_QUESTIONS } from './questions/life.js';

export { CHINESE_QUESTIONS, MATH_QUESTIONS, LIFE_QUESTIONS };

export const ALL_QUESTIONS = [
  ...CHINESE_QUESTIONS,
  ...MATH_QUESTIONS,
  ...LIFE_QUESTIONS
];

export const QUESTION_MAP = new Map(ALL_QUESTIONS.map(q => [q.id, q]));

// Fisher-Yates 陣列隨機洗牌演算法
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 依據模式或單元專項篩選題庫
 */
export function getQuestionsByFilter(mode = 'all') {
  const numId = (q) => parseInt(q.id.split('_')[1], 10);

  switch (mode) {
    case 'chinese':
      return CHINESE_QUESTIONS;
    case 'math':
      return MATH_QUESTIONS;
    case 'life':
      return LIFE_QUESTIONS;
    // 國語 5 大專項特訓
    case 'chi_poly':
      return CHINESE_QUESTIONS.filter(q => numId(q) >= 1 && numId(q) <= 10);
    case 'chi_typo':
      return CHINESE_QUESTIONS.filter(q => numId(q) >= 11 && numId(q) <= 22 && q.id !== 'chi_15' && q.id !== 'chi_20');
    case 'chi_radical':
      return CHINESE_QUESTIONS.filter(q => (numId(q) >= 23 && numId(q) <= 32) || q.id === 'chi_15' || q.id === 'chi_20');
    case 'chi_reading':
      return CHINESE_QUESTIONS.filter(q => numId(q) >= 33 && numId(q) <= 42);
    case 'chi_grammar':
      return CHINESE_QUESTIONS.filter(q => numId(q) >= 43 && numId(q) <= 50);
    // 數學 5 大單元專項特訓
    case 'math_u1':
      return MATH_QUESTIONS.filter(q => q.unit.includes('第 1 單元'));
    case 'math_u2':
      return MATH_QUESTIONS.filter(q => q.unit.includes('第 2 單元'));
    case 'math_u3':
      return MATH_QUESTIONS.filter(q => q.unit.includes('第 3 單元'));
    case 'math_u4':
      return MATH_QUESTIONS.filter(q => q.unit.includes('第 4 單元'));
    case 'math_u5':
      return MATH_QUESTIONS.filter(q => q.unit.includes('第 5 單元'));
    // 生活 4 大單元專項特訓
    case 'life_u1':
      return LIFE_QUESTIONS.filter(q => q.unit.includes('第 1 單元'));
    case 'life_u2':
      return LIFE_QUESTIONS.filter(q => q.unit.includes('第 2 單元'));
    case 'life_u3':
      return LIFE_QUESTIONS.filter(q => q.unit.includes('第 3 單元'));
    case 'life_u4':
      return LIFE_QUESTIONS.filter(q => q.unit.includes('第 4 單元'));
    case 'all':
    default:
      return ALL_QUESTIONS;
  }
}

/**
 * 抽取一場標準棒球賽題目，優先抽取尚未作答過的題目 (Unseen-first)，並打亂每題的左/中/右外野選項順序
 * @param {string} mode 篩選模式
 * @param {number} count 抽題數量 (預設 9 局)
 * @param {Set<string>} seenIds 已作答過的題目 ID 集合
 */
export function getGameQuestions(mode = 'all', count = 9, seenIds = null) {
  const pool = getQuestionsByFilter(mode);
  const targetCount = Math.min(count, pool.length);

  let selected = [];
  if (seenIds && seenIds instanceof Set) {
    const unseen = shuffleArray(pool.filter(q => !seenIds.has(q.id)));
    if (unseen.length >= targetCount) {
      selected = unseen.slice(0, targetCount);
    } else {
      // 未作答題目不足一場時，先全數納入，再重置該分類已讀紀錄並從其餘題目補足
      const seenPool = shuffleArray(pool.filter(q => seenIds.has(q.id)));
      pool.forEach(q => seenIds.delete(q.id));
      selected = [...unseen, ...seenPool.slice(0, targetCount - unseen.length)];
    }
    selected.forEach(q => seenIds.add(q.id));
  } else {
    selected = shuffleArray(pool).slice(0, targetCount);
  }

  return selected.map(q => ({
    ...q,
    options: shuffleArray(q.options)
  }));
}
