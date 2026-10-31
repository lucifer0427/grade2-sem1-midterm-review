/**
 * 引導式教學引擎 (Scaffolding & Socratic Guided Teaching Module)
 * 當學童答錯時，不直接給答案，而是透過三階段鷹架引導學童自己推導出正確答案：
 * 1. 迷思診斷 (Why it missed)：指出剛剛選的選項錯在哪個陷阱
 * 2. 第一步思考提問 (Step 1 Socratic Prompt)：引導觀察題目關鍵字與解題方向
 * 3. 第二步拆解鷹架 (Step 2 Masked Scaffold)：提供算式或語意推導步驟，將最終答案遮罩為【 ❓ 】
 */

/**
 * 將詳解文字中的正確答案遮罩為【 ❓ 】，避免在引導階段直接洩漏答案
 */
function maskAnswerInHint(questionObj, correctText) {
  const hintText = questionObj.hint || '';
  if (!hintText || !correctText) return hintText;
  let masked = hintText;
  const cleanCorrect = correctText.trim();

  // 1. 直接遮罩完整正確選項文字
  if (cleanCorrect.length > 0) {
    masked = masked.split(cleanCorrect).join('【 ❓ 】');
  }

  // 2. 處理國語多音字選項（例如 "ㄐㄧㄚˋ (四聲)" -> 遮罩 "ㄐㄧㄚˋ" 與 "第四聲/四聲"）
  if (questionObj.question.includes('讀音')) {
    const bopomofoPart = cleanCorrect.split(/\s|\(/)[0].trim();
    if (bopomofoPart) {
      masked = masked.split(`「${bopomofoPart}」`).join('「【 ❓ 】」');
      masked = masked.split(bopomofoPart).join('【 ❓ 】');
    }
    masked = masked.replace(/第?[一二三四]聲|輕聲/g, '【 ❓ 聲】');
  }

  // 3. 處理國語改錯字選項（例如 "「立」應改為「力」" -> 遮罩正確字「力」）
  const fixMatch = cleanCorrect.match(/「(.)」應改為「(.)」/);
  if (fixMatch) {
    const rightChar = fixMatch[2];
    masked = masked.split(`「${rightChar}」`).join('「 ❓ 」');
    masked = masked.split(rightChar).join('❓');
  }

  // 4. 處理國語二選一填空或量詞（例如 "園、圓" 或 "陣、顆"）
  if (cleanCorrect.includes('、') && cleanCorrect.length <= 6) {
    const parts = cleanCorrect.split('、').map(s => s.trim()).filter(Boolean);
    parts.forEach(p => {
      masked = masked.split(`「${p}」`).join('「 ❓ 」');
      masked = masked.split(p).join('❓');
    });
  }

  // 5. 處理部首題（例如 "日部"、"肉部 (常寫成月字旁)"）
  if (questionObj.question.includes('部首') || questionObj.question.includes('部件')) {
    const basePart = cleanCorrect.split(/\s|\(|，/)[0].trim();
    if (basePart) {
      masked = masked.split(basePart).join('【 ❓ 】');
    }
    masked = masked.replace(/「[日田肉青舛走竹二食米]部?」/g, '「 ❓ 部」');
  }

  // 6. 處理數學答案中的數字：只遮罩算式結果或句尾結論數字（使用獨立數字邊界避免切到 100）
  const numMatch = cleanCorrect.match(/\d+/g);
  if (numMatch && numMatch.length === 1) {
    const targetNum = numMatch[0];
    const conclusionRegex = new RegExp(
      `([=＝]|答案是|合起來是|結果是|現在有|相差|共長|剩下|共有|讀作|記作|就是|變成|等於|下邊也是|大約就是|可以換)\\s*${targetNum}(?!\\d)`,
      'g'
    );
    masked = masked.replace(conclusionRegex, '$1 【 ❓ 】');
  }

  // 7. 若經過上述處理後，masked 完全沒出現 ❓，將句尾最後關鍵結論遮罩
  if (!masked.includes('❓')) {
    const corePart = cleanCorrect.split(/\s|\(|（/)[0].trim();
    if (corePart && corePart.length >= 2 && !/^\d+$/.test(corePart) && masked.includes(corePart)) {
      masked = masked.split(corePart).join('【 ❓ 】');
    } else {
      const clauses = masked.split(/[，、；：]/);
      if (clauses.length >= 2) {
        clauses[clauses.length - 1] = '所以正確答案就是【 ❓ 】囉！';
        masked = clauses.join('，');
      } else {
        masked = `${masked.replace(/[！!。]$/, '')}，想一想哪一個選項最符合【 ❓ 】呢？`;
      }
    }
  }

  return masked;
}

/**
 * 依據科目與題型產生蘇格拉底式「第一步思考提問」
 */
function buildSocraticStep1(questionObj) {
  const unit = questionObj.unit || '';
  const qText = questionObj.question || '';

  // 擷取題目中 [重點框] 的關鍵字
  const highlights = [];
  const regex = /\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(qText)) !== null) {
    if (match[1].trim() && match[1].trim() !== '？') {
      highlights.push(match[1].trim());
    }
  }
  const keyPhrase = highlights.length > 0 ? `「${highlights.join('、')}」` : '重點數字與條件';

  if (questionObj.subject === '國語') {
    if (qText.includes('讀音')) {
      return `先別急著猜注音！請把句子裡的詞念出來聽聽看，想一想 ${keyPhrase} 在這句話裡代表什麼意思？再比對剩下的兩個選項，哪一個聲調跟我們平常說話時一模一樣？`;
    }
    if (qText.includes('哪一個字寫錯了')) {
      return `這是一題「同音錯別字」偵探題！請把句子一個字一個字慢慢讀一次，找找看哪一個字的「偏旁部首」跟這句話的意思搭不起來？`;
    }
    if (qText.includes('怎麼選') || qText.includes('的分別')) {
      return `這兩個字讀音相同，但「部首偏旁」不同喔！先看第一格跟什麼意思有關？第二格又跟什麼意思有關？用部首的意思就能一秒配對！`;
    }
    if (qText.includes('部首') || qText.includes('部件')) {
      return `觀察這個字的形狀與意思！想一想它跟「太陽時間（日）、植物（艸）、竹子器具（竹）、身體部位（肉/月）、心裡感受（心）或行走（走）」哪一個最有關係？`;
    }
    if (unit.includes('短語') || unit.includes('量詞') || unit.includes('句子') || unit.includes('反義詞') || unit.includes('詞語')) {
      return `先拆解題目的詞語結構！把剩下的兩個選項分別放進句子裡念一次，哪一個詞性結構完全相同、而且念起來最自然通順？`;
    }
    return `回想課文『${unit}』的故事畫面，主角在哪裡、看到了什麼或做了什麼事？順著課文情節想一想就能找到答案囉！`;
  }

  // 數學科引導策略
  if (unit.includes('200以內的數')) {
    return `先在腦中畫出「百位｜十位｜個位」三個格子！看清楚題目裡的 ${keyPhrase}：百位是幾？十位是幾（沒有十記得補 0）？個位又是幾？`;
  }
  if (unit.includes('二位數加減法')) {
    return `直式計算口訣：「個位對個位、十位對十位，永遠從個位先算！」請看 ${keyPhrase}：個位相加有沒有滿 10（要向十位進 1）？或是個位不夠減（要向十位借 1 當作 10）？`;
  }
  if (unit.includes('公分')) {
    if (qText.includes('刻度') && !qText.includes('刻度 0')) {
      return `⚠️ 小心斷尺陷阱！看看題目裡的 ${keyPhrase}：尺不是從刻度 0 開始量喔！記住口訣：「右端終點刻度 － 左端起點刻度 ＝ 真正長度」，相減看看差幾大格？`;
    }
    return `看清楚題目裡的 ${keyPhrase}！回想 1 公分大約是食指指甲寬，如果是兩段接起來求總長用「加法」，比長短求相差用「減法」喔！`;
  }
  if (unit.includes('兩步驟')) {
    return `兩步驟應用題要拆成兩小題來破關！看清楚 ${keyPhrase}，先問自己：「第一步要先算出什麼？是用加法還是減法？算出第一步之後，第二步再拿去加還是減？」`;
  }
  if (unit.includes('平面圖形')) {
    return `回想平面圖形的小祕密！注意題目問的 ${keyPhrase}：正方形四條邊都一樣長，長方形上下對邊一樣長、左右對邊一樣長，而且它們都有 4 個直角喔！`;
  }

  return `請仔細觀察題目標示紅框的 ${keyPhrase}，一步一步推算看看！`;
}

/**
 * 產生完整引導式教學資料包
 * @param {Object} questionObj 題目物件
 * @param {Object} wrongOption 學童誤選的錯誤選項
 */
export function buildGuidedCoachingData(questionObj, wrongOption) {
  const correctOpt = questionObj.options.find(o => o.isCorrect);
  const correctText = correctOpt ? correctOpt.text : '';

  const trapReason = wrongOption?.hitResult || '這球偏離好球帶囉！';
  const step1Question = buildSocraticStep1(questionObj);
  const step2MaskedHint = maskAnswerInHint(questionObj, correctText);

  // 給畫面頂部題目區的簡短引導提示（回打擊區重試時持續顯示）
  const liveHudGuide = `🧭 教練引導：${step2MaskedHint}`;

  // 給語音朗讀的親切引導詞（不直接念出答案）
  const cleanTrap = trapReason.replace(/[⚾💥🔥⚡]/g, '');
  const spokenGuide = `擦棒界外球！別灰心，教練帶你一步一步想。剛剛那球：${cleanTrap} 現在想一想：${step1Question}`;

  return {
    selectedWrongText: wrongOption?.text || '',
    trapReason,
    step1Question,
    step2MaskedHint,
    liveHudGuide,
    spokenGuide,
    fullExplanation: questionObj.hint,
    correctText
  };
}
