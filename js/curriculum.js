/**
 * 題庫匯總模組 (國語 50 題 + 數學 50 題 = 共 100 題)
 * 支援隨機洗牌抽題，每場對決抽取 9 局進行棒球賽
 */
import { CHINESE_QUESTIONS } from './questions/chinese.js';
import { MATH_QUESTIONS } from './questions/math.js';

export { CHINESE_QUESTIONS, MATH_QUESTIONS };

export const ALL_QUESTIONS = [
  ...CHINESE_QUESTIONS,
  ...MATH_QUESTIONS
];

// Fisher-Yates 陣列隨機洗牌演算法
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 抽取一場標準 9 局棒球賽題目 (可指定科目：all, chinese, math)
export function getGameQuestions(subject = 'all', count = 9) {
  let pool = [];
  if (subject === 'chinese') {
    pool = CHINESE_QUESTIONS;
  } else if (subject === 'math') {
    pool = MATH_QUESTIONS;
  } else {
    // 綜合賽：先隨機洗牌
    pool = ALL_QUESTIONS;
  }
  return shuffleArray(pool).slice(0, count);
}
