/**
 * 108 課綱二上期中考題庫與引導式教學防洩題自動化驗證腳本
 * 執行方式：node scripts/validate-questions.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {
  CHINESE_QUESTIONS,
  MATH_QUESTIONS,
  LIFE_QUESTIONS,
  ALL_QUESTIONS,
  getQuestionsByFilter,
  getGameQuestions
} from '../js/curriculum.js';
import { buildGuidedCoachingData } from '../js/guidedTeaching.js';
import * as specialModes from '../js/specialModes.js';
import * as mcSpecialModes from '../js/minecraftSpecialModes.js';

console.log('⚾⛏️ 開始執行雙版本（棒球版 & 麥塊版）150 題庫結構、答案唯一性與引導教學遮罩率自動化檢測...\n');

// 1. 題數檢測
assert.equal(CHINESE_QUESTIONS.length, 50, '康軒國語題庫必須剛好 50 題');
assert.equal(MATH_QUESTIONS.length, 50, '翰林數學題庫必須剛好 50 題');
assert.equal(LIFE_QUESTIONS.length, 50, '生活課程題庫必須剛好 50 題');
assert.equal(ALL_QUESTIONS.length, 150, '總題庫必須剛好 150 題');
console.log('✅ [1/6] 題數檢驗通過：國語 50 題 + 數學 50 題 + 生活 50 題 = 150 題');

// 2. ID 唯一性與選項結構檢測
const seenIds = new Set();
for (const q of ALL_QUESTIONS) {
  assert.ok(q.id && typeof q.id === 'string', `題目缺少有效 id`);
  assert.ok(!seenIds.has(q.id), `發現重複題號: ${q.id}`);
  seenIds.add(q.id);

  assert.ok(q.subject === '國語' || q.subject === '數學' || q.subject === '生活', `${q.id} 科目異常: ${q.subject}`);
  assert.ok(q.unit && q.question && q.hint, `${q.id} 缺少 unit / question / hint`);
  assert.equal(q.options.length, 3, `${q.id} 選項數量必須為 3`);

  const correctOpts = q.options.filter(o => o.isCorrect === true);
  assert.equal(correctOpts.length, 1, `${q.id} 正確選項 (isCorrect: true) 必須唯一，實際為 ${correctOpts.length}`);

  const optTexts = new Set(q.options.map(o => o.text.trim()));
  assert.equal(optTexts.size, 3, `${q.id} 出現重複的選項文字`);
}
console.log('✅ [2/6] 150 題 ID 唯一性、3 選項格式與單一正解檢驗 100% 通過');

// 3. 多音字防洩題檢驗
const polyQuestions = CHINESE_QUESTIONS.filter(q => q.question.includes('讀音'));
for (const q of polyQuestions) {
  const correctOpt = q.options.find(o => o.isCorrect);
  const bopomofo = correctOpt.text.split(/\s|\(/)[0].trim();
  assert.ok(
    q.phonetic.includes('？'),
    `${q.id} 多音字題 phonetic 欄位必須包含遮罩符號「？」`
  );
  assert.ok(
    !q.phonetic.includes(bopomofo),
    `${q.id} 多音字題 phonetic 欄位洩漏了正確讀音「${bopomofo}」`
  );
}
console.log(`✅ [3/6] 多音字題型 (${polyQuestions.length} 題) 注音防洩題遮罩檢驗通過`);

// 4. 蘇格拉底引導教學遮罩率與防假陽性檢測
let maskedPassCount = 0;
for (const q of ALL_QUESTIONS) {
  const wrongOpt = q.options.find(o => !o.isCorrect);
  const correctOpt = q.options.find(o => o.isCorrect);
  const guide = buildGuidedCoachingData(q, wrongOpt);
  assert.ok(guide.step1Question.length > 10, `${q.id} 第一步蘇格拉底提問過短`);
  assert.ok(
    guide.step2MaskedHint.includes('❓'),
    `${q.id} 第二步解題錦囊未成功遮罩答案: ${guide.step2MaskedHint}`
  );
  assert.ok(
    !guide.step2MaskedHint.includes(correctOpt.text.trim()),
    `${q.id} 第二步解題錦囊仍殘留完整正確選項文字: ${guide.step2MaskedHint}`
  );
  maskedPassCount++;
}

// 針對複合答案題（筆畫+部首、緊急電話、時間刻度）進行防洩題深度斷言
const strictMaskChecks = [
  { id: 'chi_28', forbidden: ['4 畫', '二部'] },
  { id: 'chi_30', forbidden: ['14 畫', '舛'] },
  { id: 'math_33', forbidden: ['畫到刻度 7', '（7 公分）'] },
  { id: 'life_17', forbidden: ['中午 12', '頭頂正上方'] },
  { id: 'life_30', forbidden: ['119', '消防員'] },
  { id: 'life_31', forbidden: ['110', '警察局'] }
];
for (const chk of strictMaskChecks) {
  const q = ALL_QUESTIONS.find(item => item.id === chk.id);
  const wrongOpt = q.options.find(o => !o.isCorrect);
  const guide = buildGuidedCoachingData(q, wrongOpt);
  for (const word of chk.forbidden) {
    assert.ok(
      !guide.step2MaskedHint.includes(word),
      `${chk.id} 遮罩不完全，仍殘留關鍵字「${word}」: ${guide.step2MaskedHint}`
    );
  }
}
console.log(`✅ [4/6] 蘇格拉底三階段引導教學 (${maskedPassCount}/150 題) 答案遮罩率與複合題防洩題 100% 通過`);

// 5. 專項篩選器與未讀優先抽題池檢測
const filterModes = [
  'all', 'chinese', 'math', 'life',
  'chi_poly', 'chi_typo', 'chi_radical', 'chi_reading', 'chi_grammar',
  'math_u1', 'math_u2', 'math_u3', 'math_u4', 'math_u5',
  'life_u1', 'life_u2', 'life_u3', 'life_u4'
];
for (const mode of filterModes) {
  const list = getQuestionsByFilter(mode);
  assert.ok(list.length >= 6, `篩選模式 ${mode} 題數過少: ${list.length}`);
}

const tracker = new Set();
for (let round = 0; round < 16; round++) {
  getGameQuestions('all', 9, tracker);
}
assert.equal(tracker.size, 144, '連續 16 場 (144 題) 未讀優先抽題必須不重複覆蓋 144 題');
console.log('✅ [5/6] 18 種專項篩選模式與未讀優先智慧抽題演算法檢驗通過');

// 6. 雙版本特殊互動模組匯出介面檢測
assert.equal(typeof specialModes.renderRulerWidget, 'function', '棒球版缺少 renderRulerWidget');
assert.equal(typeof specialModes.renderBaseRunningChainWidget, 'function', '棒球版缺少 renderBaseRunningChainWidget');
assert.equal(typeof specialModes.renderShadowLabWidget, 'function', '棒球版缺少 renderShadowLabWidget');
assert.equal(typeof specialModes.renderStrikeZoneGrid, 'function', '棒球版缺少 renderStrikeZoneGrid');
assert.equal(typeof specialModes.generateAndDownloadPlayerCard, 'function', '棒球版缺少 generateAndDownloadPlayerCard');

assert.equal(typeof mcSpecialModes.renderRedstoneRulerWidget, 'function', '麥塊版缺少 renderRedstoneRulerWidget');
assert.equal(typeof mcSpecialModes.renderMinecartChainWidget, 'function', '麥塊版缺少 renderMinecartChainWidget');
assert.equal(typeof mcSpecialModes.renderMcShadowLabWidget, 'function', '麥塊版缺少 renderMcShadowLabWidget');
assert.equal(typeof mcSpecialModes.renderCraftingTableGrid, 'function', '麥塊版缺少 renderCraftingTableGrid');
assert.equal(typeof mcSpecialModes.generateAndDownloadMinecraftCard, 'function', '麥塊版缺少 generateAndDownloadMinecraftCard');

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browserEntryModules = [
  'sw.js',
  'js/game.js',
  'js/baseballField.js',
  'js/audio.js',
  'js/minecraftGame.js',
  'js/minecraftWorld.js',
  'js/minecraftAudio.js'
];
for (const relPath of browserEntryModules) {
  execFileSync(process.execPath, ['--check', path.join(rootDir, relPath)], { stdio: 'pipe' });
}

// 檢驗 HTML 篩選選單完整性與紙本教材繁體中文規範
const printHtml = fs.readFileSync(path.join(rootDir, 'print-exam.html'), 'utf8');
for (const mode of filterModes) {
  assert.ok(printHtml.includes(`value="${mode}"`), `print-exam.html 缺少篩選選項: ${mode}`);
}
assert.ok(!printHtml.includes("includes('第1單元')"), 'print-exam.html 弱點雷達不可使用無空白之 第1單元 字串比對');

const mdFiles = [
  'chinese/vocab.md',
  'chinese/grammar.md',
  'chinese/mock-tests/midterm-mock-1.md',
  'math/concepts.md',
  'math/worksheets/calculation-and-word-problems.md',
  'math/mock-tests/midterm-mock-1.md',
  'life/midterm-review.md',
  'life/mock-tests/midterm-mock-1.md'
];
for (const mdRel of mdFiles) {
  const content = fs.readFileSync(path.join(rootDir, mdRel), 'utf8');
  assert.ok(content.length > 200, `${mdRel} 內容過短`);
  assert.ok(!content.includes('与'), `${mdRel} 發現簡體字「与」`);
}
console.log('✅ [6/6] 棒球版、麥塊版、PWA Service Worker、print-exam 18 專項與 8 份紙本教材檢驗全數通過\n');

console.log('🎉 全部 150 題與雙版本系統模組檢測 100% 完美通過！');
