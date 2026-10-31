/**
 * 數學科（翰林版二上 第1~5單元）- 完整 50 題期中評量題庫
 * 涵蓋：200以內的數、二位數進退位加減法、公分與殘尺陷阱、加減兩步驟應用、直線與平面幾何
 * 已通過 108 課綱低年級教學規範校驗（無超綱括號併式、防洩題提示設計）
 */

export const MATH_QUESTIONS = [
  // --- 單元 1：200以內的數與錢幣化聚 (1~12) ---
  {
    id: "math_01",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "「[108]」讀作什麼？百位是 1、十位是 0、個位是 8。",
    phonetic: "定位板：百位 1 ｜ 十位 0 ｜ 個位 8",
    options: [
      { text: "一百零八", isCorrect: true, hitResult: "超大號全壘打！球飛進水池！" },
      { text: "一百八十", isCorrect: false, hitResult: "擊球無力，捕手前滾地球！" },
      { text: "一千零八", isCorrect: false, hitResult: "大揮空！那是四位數喔！" }
    ],
    hint: "中間十位是 0 要讀作「零」，合起來讀作「一百零八」！"
  },
  {
    id: "math_02",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "[1 個百]、[5 個十]和 [3 個一]合起來是多少？",
    phonetic: "位值化聚：百位、十位、個位",
    options: [
      { text: "153", isCorrect: true, hitResult: "全壘打！直飛中外野看台！" },
      { text: "135", isCorrect: false, hitResult: "看錯球路被接殺！十位和個位顛倒囉！" },
      { text: "150", isCorrect: false, hitResult: "揮棒太慢！忘了加 3 個一！" }
    ],
    hint: "百位是 1，十位是 5，個位是 3，合起來是 153！"
  },
  {
    id: "math_03",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "「[一百四十]」記作阿拉伯數字是什麼？",
    phonetic: "1 個百、4 個十、0 個一",
    options: [
      { text: "140", isCorrect: true, hitResult: "平飛安打攻佔得點圈！" },
      { text: "104", isCorrect: false, hitResult: "揮棒落空！這是一百零四。" },
      { text: "14", isCorrect: false, hitResult: "大揮空！忘了百位數！" }
    ],
    hint: "百位寫 1，十位寫 4，個位沒有要補 0，記作 140！"
  },
  {
    id: "math_04",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "小智有 [1 張一百元]鈔票，可以換成幾個十元硬幣？",
    phonetic: "錢幣兌換：100 元換 10 元",
    options: [
      { text: "10 個十元", isCorrect: true, hitResult: "長打飛越外野手頭頂！" },
      { text: "5 個十元", isCorrect: false, hitResult: "揮棒過早！5 個十元只有 50 元。" },
      { text: "100 個十元", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "十進位化聚：10 個 10 是一百，所以 100 元可以換 10 個 10 元！"
  },
  {
    id: "math_05",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "比較大小：[172] 和 [169]，哪一個數比較大？",
    phonetic: "172 ○ 169（由左邊最高位比起）",
    options: [
      { text: "172 ＞ 169", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "172 ＜ 169", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "172 ＝ 169", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "百位都是 1，比較十位：7 個十比 6 個十大，所以 172 ＞ 169！"
  },
  {
    id: "math_06",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "按照順序填填看：188、189、[ ？ ]、191、192。",
    phonetic: "連續向上數數（每次＋1）",
    options: [
      { text: "190", isCorrect: true, hitResult: "滿貫全壘打！全場沸騰！" },
      { text: "180", isCorrect: false, hitResult: "內野滾地刺殺！" },
      { text: "200", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "連續加 1 數數：189 再多 1，個位滿十進一變成 190！"
  },
  {
    id: "math_07",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "[1 張 100 元]和 [1 個 50 元]硬幣合起來是多少元？",
    phonetic: "錢幣點數計數",
    options: [
      { text: "150 元", isCorrect: true, hitResult: "紮實擊中球心！二壘安打！" },
      { text: "105 元", isCorrect: false, hitResult: "看錯球路被接殺！" },
      { text: "60 元", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "100 元加上 50 元等於 150 元！"
  },
  {
    id: "math_08",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "[16 個十]合起來是多少？",
    phonetic: "十進位化聚：10 個十是 100",
    options: [
      { text: "160", isCorrect: true, hitResult: "直飛右外野看台！全壘打！" },
      { text: "16", isCorrect: false, hitResult: "大揮空！那是 16 個一！" },
      { text: "106", isCorrect: false, hitResult: "滾地球出局！" }
    ],
    hint: "10 個十是一百，還有 6 個十是六十，合起來是 160！"
  },
  {
    id: "math_09",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "5 個一數跳數：125、130、135、[ ？ ]、145。",
    phonetic: "5 個一數（每次＋5）",
    options: [
      { text: "140", isCorrect: true, hitResult: "乾淨俐落的安打！" },
      { text: "136", isCorrect: false, hitResult: "揮棒太快！" },
      { text: "150", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "每次多 5：135 往上數 5 就是 140！"
  },
  {
    id: "math_10",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "「[199]」再加 1 是多少？",
    phonetic: "199 往後數 1",
    options: [
      { text: "200", isCorrect: true, hitResult: "超大號滿貫全壘打！" },
      { text: "190", isCorrect: false, hitResult: "擦棒被捕！" },
      { text: "100", isCorrect: false, hitResult: "好球進壘未揮棒！" }
    ],
    hint: "199 多 1，個位與十位連續滿十進位，變成 2 個百，就是 200！"
  },
  {
    id: "math_11",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "小美買了一本 [135 元]的故事書，下面哪種付錢方式剛好不用找錢？",
    phonetic: "百位 1、十位 3、個位 5",
    options: [
      { text: "1 張 100 元、3 個 10 元、1 個 5 元", isCorrect: true, hitResult: "平飛安打攻佔壘包！" },
      { text: "1 張 100 元、5 個 10 元、3 個 1 元", isCorrect: false, hitResult: "這是 153 元，付太多囉！" },
      { text: "1 張 100 元、3 個 1 元", isCorrect: false, hitResult: "只有 103 元，付不夠喔！" }
    ],
    hint: "135 元 ＝ 100 元 ＋ 30 元（3個10元）＋ 5 元！"
  },
  {
    id: "math_12",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "在數線上，哪一個數最接近 [150]？",
    phonetic: "數線距離與數感",
    options: [
      { text: "148", isCorrect: true, hitResult: "轟出全壘打！直擊外野草皮！" },
      { text: "140", isCorrect: false, hitResult: "揮棒落空！140 相差了 10 格。" },
      { text: "160", isCorrect: false, hitResult: "界外高飛接殺！160 相差了 10 格。" }
    ],
    hint: "148 離 150 只差 2 格，距離最近！"
  },

  // --- 單元 2：二位數直式加減法 (13~24) ---
  {
    id: "math_13",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "棒球隊昨天練球有 [48 顆]球，今天又買了 [35 顆]，一共有幾顆球？",
    phonetic: "進位加法：48 ＋ 35",
    options: [
      { text: "83 顆", isCorrect: true, hitResult: "一棒擊沉！全壘打！" },
      { text: "73 顆", isCorrect: false, hitResult: "揮空！忘記個位 8+5=13 要進位囉！" },
      { text: "85 顆", isCorrect: false, hitResult: "界外高飛球接殺！" }
    ],
    hint: "直式計算：個位 8 + 5 = 13（個位寫 3，十位進 1）；十位 4 + 3 + 1 = 8，共 83 顆！"
  },
  {
    id: "math_14",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式計算退位減法：[72 - 38] ＝ ？",
    phonetic: "個位 2 不夠減 8，需向十位借 1",
    options: [
      { text: "34", isCorrect: true, hitResult: "強勁安打！送回壘上跑者！" },
      { text: "44", isCorrect: false, hitResult: "揮棒太慢！十位借出 1 個十後只剩 6 囉！" },
      { text: "46", isCorrect: false, hitResult: "擦棒被捕！不能用 8 反減 2 喔！" }
    ],
    hint: "個位 2 不夠減 8，跟十位借 1 當 10：10 - 8 + 2 = 4；十位 6 - 3 = 3，答案是 34！"
  },
  {
    id: "math_15",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "書架上原有 [64 本]漫畫，借走 [27 本]，還剩下幾本？",
    phonetic: "退位減法：64 － 27",
    options: [
      { text: "37 本", isCorrect: true, hitResult: "炸裂全壘打！追平比分！" },
      { text: "47 本", isCorrect: false, hitResult: "揮棒落空！十位忘了減去借走的 1！" },
      { text: "33 本", isCorrect: false, hitResult: "滾地球雙殺！" }
    ],
    hint: "個位 14 - 7 = 7，十位 5 - 2 = 3，剩下 37 本！"
  },
  {
    id: "math_16",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "操場上有 [29 個]男生和 [36 個]女生，操場上共有幾位學童？",
    phonetic: "進位加法：29 ＋ 36",
    options: [
      { text: "65 位", isCorrect: true, hitResult: "二壘安打！全場歡呼！" },
      { text: "55 位", isCorrect: false, hitResult: "出棒過晚！忘了進位 1！" },
      { text: "64 位", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "個位 9 + 6 = 15（進 1）；十位 2 + 3 + 1 = 6，共 65 位！"
  },
  {
    id: "math_17",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式計算：[50 - 24] ＝ ？",
    phonetic: "整十退位減法",
    options: [
      { text: "26", isCorrect: true, hitResult: "高高飛過計分板！全壘打！" },
      { text: "36", isCorrect: false, hitResult: "揮棒落空！十位 4 - 2 = 2 喔！" },
      { text: "24", isCorrect: false, hitResult: "內野滾地！個位 0 不能直接放下來！" }
    ],
    hint: "個位 0 不夠減 4，向十位借 1 當 10：10 - 4 = 6；十位 4 - 2 = 2，答案是 26！"
  },
  {
    id: "math_18",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式加減法計算時，第一個步驟要先從哪一個位值開始算？",
    phonetic: "直式演算法則",
    options: [
      { text: "個位對齊個位，先從個位算起", isCorrect: true, hitResult: "首打席陽春砲！" },
      { text: "先從十位開始算", isCorrect: false, hitResult: "揮棒太慢！先算十位遇到進退位會改寫！" },
      { text: "隨便從哪邊算都可以", isCorrect: false, hitResult: "好球三振！" }
    ],
    hint: "直式運算法則：個位對齊個位、十位對齊十位，並從「個位」開始算！"
  },
  {
    id: "math_19",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "水果行進了 80 顆西瓜，上午賣掉 [18 顆]，下午賣掉 [25 顆]，一共賣掉幾顆？",
    phonetic: "注意題目問「一共賣掉幾顆」",
    options: [
      { text: "43 顆", isCorrect: true, hitResult: "一棒扛出全壘打牆！" },
      { text: "37 顆", isCorrect: false, hitResult: "揮空好球！這是剩下的顆數喔！" },
      { text: "33 顆", isCorrect: false, hitResult: "捕手前滾地刺殺！" }
    ],
    hint: "小心干擾數字 80！題目只問「一共賣掉幾顆」：18 + 25 = 43 顆！"
  },
  {
    id: "math_20",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "檢查驗算：算式 [85 - 37 = 48]，下面哪一個加法算式可以檢查有沒有算對？",
    phonetic: "加減互逆驗算",
    options: [
      { text: "48 + 37 = 85", isCorrect: true, hitResult: "超前三分砲！" },
      { text: "85 + 48 = 133", isCorrect: false, hitResult: "揮棒過早！" },
      { text: "85 + 37 = 122", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "減法與加法互逆：剩下的 48 ＋ 減去的 37 ＝ 原來的 85！"
  },
  {
    id: "math_21",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "計算：[37 + 43] ＝ ？",
    phonetic: "個位相加剛好滿十",
    options: [
      { text: "80", isCorrect: true, hitResult: "直擊外野草皮平飛安打！" },
      { text: "70", isCorrect: false, hitResult: "揮棒太慢！忘了進位 1！" },
      { text: "81", isCorrect: false, hitResult: "出棒被接殺！" }
    ],
    hint: "個位 7 + 3 = 10（個位寫 0，十位進 1）；十位 3 + 4 + 1 = 8，等於 80！"
  },
  {
    id: "math_22",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "小華有 [90 元]，買鉛筆盒花了 [45 元]，他還剩下多少元？",
    phonetic: "退位減法：90 － 45",
    options: [
      { text: "45 元", isCorrect: true, hitResult: "滿貫全壘打震撼登場！" },
      { text: "55 元", isCorrect: false, hitResult: "揮棒落空！十位借走 1 只剩 8！" },
      { text: "35 元", isCorrect: false, hitResult: "游擊滾地封殺！" }
    ],
    hint: "個位 10 - 5 = 5；十位 8 - 4 = 4，剩下 45 元！"
  },
  {
    id: "math_23",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式加法算式中，個位相加滿十時，要怎麼做？",
    phonetic: "滿十進一原則",
    options: [
      { text: "向十位進 1，並在十位上方標記小小的 1", isCorrect: true, hitResult: "再添一支全壘打！" },
      { text: "直接把 10 寫在個位", isCorrect: false, hitResult: "三振出局！" },
      { text: "假裝沒看見不用理它", isCorrect: false, hitResult: "揮空！" }
    ],
    hint: "滿十進一：個位滿十要向十位進 1，才不會漏加！"
  },
  {
    id: "math_24",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "算算看：[81 - 56] ＝ ？",
    phonetic: "退位減法練習",
    options: [
      { text: "25", isCorrect: true, hitResult: "深遠二壘安打！" },
      { text: "35", isCorrect: false, hitResult: "揮棒太慢！十位借 1 後是 7 - 5 = 2！" },
      { text: "27", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "個位 11 - 6 = 5；十位 7 - 5 = 2，答案是 25！"
  },

  // --- 單元 3：公分長度測量與殘尺陷阱 (25~34)：不洩漏減法算式 ---
  {
    id: "math_25",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "鉛筆的左端對齊直尺的[刻度 3]，右端對齊[刻度 9]，鉛筆長幾公分？",
    phonetic: "小心！起點不是從刻度 0 開始喔！",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "掃過中外野！滿貫砲！" },
      { text: "9 公分", isCorrect: false, hitResult: "掉入陷阱！起點不是 0 刻度！" },
      { text: "3 公分", isCorrect: false, hitResult: "擦棒被捕出局！" }
    ],
    hint: "尺不是從 0 開始量，要用右端刻度減左端刻度：9 - 3 = 6 公分！"
  },
  {
    id: "math_26",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "橡皮擦的左端對齊斷尺的[刻度 5]，右端對齊[刻度 11]，橡皮擦長幾公分？",
    phonetic: "斷尺測量：從刻度 5 到刻度 11 有幾大格？",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "全壘打！越過左外野標竿！" },
      { text: "11 公分", isCorrect: false, hitResult: "掉入陷阱！不能直讀右邊數字 11！" },
      { text: "5 公分", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "非零起點計算：末端刻度 11 － 起點刻度 5 ＝ 6 公分！"
  },
  {
    id: "math_27",
    subject: "數學",
    unit: "第 3 單元 公分 (測量基礎)",
    question: "用直尺測量課本長度時，物體的左端應該對齊直尺的哪裡最標準？",
    phonetic: "直尺正確操作方法",
    options: [
      { text: "刻度「0」的線", isCorrect: true, hitResult: "平飛安打上壘！" },
      { text: "直尺最左邊的塑膠外框邊緣", isCorrect: false, hitResult: "擊球落空！外框到刻度 0 有空隙喔！" },
      { text: "刻度「1」的線", isCorrect: false, hitResult: "滾地球出局！" }
    ],
    hint: "標準測量必須對齊「刻度 0 線」，不是對齊尺的最左邊塑膠外殼！"
  },
  {
    id: "math_28",
    subject: "數學",
    unit: "第 3 單元 公分 (單位認識)",
    question: "國際標準長度單位「[公分]」，英文縮寫記作什麼？",
    phonetic: "長度單位符號",
    options: [
      { text: "cm", isCorrect: true, hitResult: "超大號陽春砲！" },
      { text: "kg", isCorrect: false, hitResult: "那是重量公斤喔！" },
      { text: "m", isCorrect: false, hitResult: "m 是公尺喔！" }
    ],
    hint: "公分的英文縮寫是小寫的 cm（Centimeter）！"
  },
  {
    id: "math_29",
    subject: "數學",
    unit: "第 3 單元 公分 (長度加減)",
    question: "紅絲帶長 [18 公分]，藍絲帶長 [25 公分]，兩條絲帶接在一起共長幾公分？",
    phonetic: "長度合成計算",
    options: [
      { text: "43 公分", isCorrect: true, hitResult: "長打直擊外野看台！" },
      { text: "33 公分", isCorrect: false, hitResult: "揮棒落空！忘了進位！" },
      { text: "40 公分", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "兩條接在一起用加法：18 + 25 = 43 公分！"
  },
  {
    id: "math_30",
    subject: "數學",
    unit: "第 3 單元 公分 (長度比較)",
    question: "竹籤長 [15 公分]，吸管長 [9 公分]，竹籤比吸管長幾公分？",
    phonetic: "比較長短相差多少",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "強勁安打帶有打點！" },
      { text: "24 公分", isCorrect: false, hitResult: "這是兩根加起來，題目問相差多少！" },
      { text: "7 公分", isCorrect: false, hitResult: "揮棒太快！" }
    ],
    hint: "比長短求相差用減法：15 - 9 = 6 公分！"
  },
  {
    id: "math_31",
    subject: "數學",
    unit: "第 3 單元 公分 (長度估測)",
    question: "我們手掌的[食指指甲寬度]，大約是多少長度？",
    phonetic: "生活中的量感估測",
    options: [
      { text: "大約 1 公分", isCorrect: true, hitResult: "精準擊中球心！全壘打！" },
      { text: "大約 10 公分", isCorrect: false, hitResult: "太長了！揮空！" },
      { text: "大約 50 公分", isCorrect: false, hitResult: "那是課桌寬度了！" }
    ],
    hint: "食指指甲寬度大約就是 1 公分（1 cm）！"
  },
  {
    id: "math_32",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "一根粉筆從直尺的[刻度 2]量到[刻度 8]，這根粉筆長多少？",
    phonetic: "殘尺測量：從刻度 2 跳到刻度 8",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "8 公分", isCorrect: false, hitResult: "揮棒落空！起點是刻度 2 不是 0 喔！" },
      { text: "10 公分", isCorrect: false, hitResult: "出棒被接殺！不能把兩端刻度相加喔！" }
    ],
    hint: "末端刻度 8 － 起點刻度 2 ＝ 6 公分！"
  },
  {
    id: "math_33",
    subject: "數學",
    unit: "第 3 單元 公分 (畫線技巧)",
    question: "用直尺畫一條 [7 公分]的直線，筆尖從刻度 0 開始，要畫到刻度幾停筆？",
    phonetic: "標準直尺作圖",
    options: [
      { text: "畫到刻度 7", isCorrect: true, hitResult: "平飛安打攻佔一二壘！" },
      { text: "畫到刻度 8", isCorrect: false, hitResult: "揮空好球！畫到 8 就變成 8 公分囉！" },
      { text: "畫到刻度 6", isCorrect: false, hitResult: "擦棒出局！" }
    ],
    hint: "從刻度 0 開始畫，畫到刻度 7 剛好是 7 大格（7 公分）！"
  },
  {
    id: "math_34",
    subject: "數學",
    unit: "第 3 單元 公分 (長度估測)",
    question: "全新沒削過的[一枝鉛筆]，長度大約是多少？",
    phonetic: "常見文具長度估測",
    options: [
      { text: "大約 18 公分", isCorrect: true, hitResult: "全壘打飛出場外！" },
      { text: "大約 2 公分", isCorrect: false, hitResult: "那比橡皮擦還短喔！" },
      { text: "大約 180 公分", isCorrect: false, hitResult: "那跟籃球員一樣高了！" }
    ],
    hint: "一枝全新鉛筆的長度大約在 17 ~ 19 公分左右！"
  },

  // --- 單元 4：加減兩步驟應用題 (35~44)：遵守 108 課綱分步列式原則 ---
  {
    id: "math_35",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "休息區原有 [32 瓶]水，上午喝掉 [14 瓶]，教練又搬來 [20 瓶]，現在有幾瓶？",
    phonetic: "兩步驟：先減後加",
    options: [
      { text: "38 瓶", isCorrect: true, hitResult: "再見全壘打！全場歡呼！" },
      { text: "28 瓶", isCorrect: false, hitResult: "游擊方向雙殺打！退位減法算錯囉！" },
      { text: "18 瓶", isCorrect: false, hitResult: "揮棒落空！忘了加教練搬來的 20 瓶！" }
    ],
    hint: "分兩步算：第一步 32 - 14 = 18 瓶；第二步 18 + 20 = 38 瓶！"
  },
  {
    id: "math_36",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "公車上原有 [25 人]，到站下去 [8 人]，又上來 [12 人]，現在公車上有幾人？",
    phonetic: "兩步驟：先算下車剩幾人，再算上車後幾人",
    options: [
      { text: "29 人", isCorrect: true, hitResult: "滿貫全壘打！比分逆轉！" },
      { text: "17 人", isCorrect: false, hitResult: "揮棒過早！只算完第一步下車！" },
      { text: "35 人", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "第一步：25 - 8 = 17 人；第二步：17 + 12 = 29 人！"
  },
  {
    id: "math_37",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "小明有 [50 元]，買了 [15 元]的鉛筆和 [20 元]的筆記本，還剩下多少元？",
    phonetic: "兩步驟：連續買東西找錢",
    options: [
      { text: "15 元", isCorrect: true, hitResult: "深遠安打！跑者連跑兩個壘包！" },
      { text: "25 元", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "35 元", isCorrect: false, hitResult: "35 元是花掉的錢，不是剩下的錢喔！" }
    ],
    hint: "第一步先算共花掉：15 + 20 = 35 元；第二步算剩下：50 - 35 = 15 元！"
  },
  {
    id: "math_38",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "花園裡有 [16 朵]紅花、[24 朵]黃花，媽媽採走 [15 朵]，還剩下幾朵花？",
    phonetic: "兩步驟：先加後減",
    options: [
      { text: "25 朵", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "40 朵", isCorrect: false, hitResult: "只算完全部幾朵，忘了扣掉採走的 15 朵！" },
      { text: "35 朵", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "第一步先算全部：16 + 24 = 40 朵；第二步扣掉採走：40 - 15 = 25 朵！"
  },
  {
    id: "math_39",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "箱子裡有 [60 顆]棒球，二甲借走 [22 顆]，二乙借走 [18 顆]，箱子還剩幾顆？",
    phonetic: "兩步驟：連減問題",
    options: [
      { text: "20 顆", isCorrect: true, hitResult: "掃過外野大牆！再添兩分！" },
      { text: "40 顆", isCorrect: false, hitResult: "揮棒落空！40 顆是兩班借走的總數喔！" },
      { text: "30 顆", isCorrect: false, hitResult: "滾地球刺殺！" }
    ],
    hint: "第一步共借走：22 + 18 = 40 顆；第二步算剩下：60 - 40 = 20 顆！"
  },
  {
    id: "math_40",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "哥哥有 [42 張]球員卡，弟弟比哥哥[少 15 張]，兩人一共有幾張球員卡？",
    phonetic: "第一步先算出弟弟有幾張，再把兩人合起來",
    options: [
      { text: "69 張", isCorrect: true, hitResult: "超大號滿貫全壘打！" },
      { text: "27 張", isCorrect: false, hitResult: "27 張只是弟弟一個人的卡片數喔！" },
      { text: "57 張", isCorrect: false, hitResult: "出棒被接殺！" }
    ],
    hint: "第一步先算弟弟：42 - 15 = 27 張；第二步兩人合起來：42 + 27 = 69 張！"
  },
  {
    id: "math_41",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "麵包店烤了 [85 個]蛋塔，早上賣出 [38 個]，下午賣出 [27 個]，還剩下幾個？",
    phonetic: "兩步驟分步計算",
    options: [
      { text: "20 個", isCorrect: true, hitResult: "擊潰對手王牌！全壘打！" },
      { text: "65 個", isCorrect: false, hitResult: "65 個是賣出的數量喔！" },
      { text: "30 個", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "第一步共賣出：38 + 27 = 65 個；第二步剩下：85 - 65 = 20 個！"
  },
  {
    id: "math_42",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "小美原有 [18 顆]糖果，爸爸給她 [15 顆]，她吃掉 [7 顆]，現在有幾顆？",
    phonetic: "兩步驟：先加後減",
    options: [
      { text: "26 顆", isCorrect: true, hitResult: "二壘安打清空壘包！" },
      { text: "33 顆", isCorrect: false, hitResult: "揮空好球！忘了減去吃掉的 7 顆！" },
      { text: "25 顆", isCorrect: false, hitResult: "內野滾地！" }
    ],
    hint: "第一步共有：18 + 15 = 33 顆；第二步吃掉 7 顆：33 - 7 = 26 顆！"
  },
  {
    id: "math_43",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "跳繩隊男生有 [26 人]，女生比男生[多 9 人]，跳繩隊全隊共有多少人？",
    phonetic: "第一步先算女生人數，第二步算全隊人數",
    options: [
      { text: "61 人", isCorrect: true, hitResult: "平飛安打得分！" },
      { text: "35 人", isCorrect: false, hitResult: "35 人只是女生的人數，還沒加男生喔！" },
      { text: "51 人", isCorrect: false, hitResult: "揮棒落空！忘了進位！" }
    ],
    hint: "第一步女生人數：26 + 9 = 35 人；第二步全隊人數：26 + 35 = 61 人！"
  },
  {
    id: "math_44",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "停車場原有 [52 輛]車，開走 [19 輛]，又開進來 [14 輛]，現在有幾輛車？",
    phonetic: "兩步驟：先減後加",
    options: [
      { text: "47 輛", isCorrect: true, hitResult: "全壘打！越過外野大螢幕！" },
      { text: "33 輛", isCorrect: false, hitResult: "只算完第一步開走後剩下的車！" },
      { text: "57 輛", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "第一步：52 - 19 = 33 輛；第二步：33 + 14 = 47 輛！"
  },

  // --- 單元 5：直線與角 / 平面圖形 (45~50) ---
  {
    id: "math_45",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "關於「[正方形]」的秘密，哪一個說法是正確的？",
    phonetic: "正方形的邊與角特徵",
    options: [
      { text: "四條邊都一樣長，有四個直角", isCorrect: true, hitResult: "炸裂全壘打！MVP 特寫！" },
      { text: "只有對面的兩條邊一樣長", isCorrect: false, hitResult: "揮棒太慢！這是長方形的特徵！" },
      { text: "有三條邊和三個角", isCorrect: false, hitResult: "好球進壘未揮棒！那是三角形！" }
    ],
    hint: "正方形最重要的特徵是「四個邊全部一樣長」，且「四個角都是直角」！"
  },
  {
    id: "math_46",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "[長方形]和[正方形]共同擁有的特徵是什麼？",
    phonetic: "四邊形的幾何性質",
    options: [
      { text: "都有 4 個邊、4 個頂點和 4 個直角", isCorrect: true, hitResult: "轟出特大號滿貫全壘打！" },
      { text: "四個邊都必須一樣長", isCorrect: false, hitResult: "長方形只有上下等長、左右等長喔！" },
      { text: "只有三個頂點", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "長方形與正方形都有 4 條直線邊、4 個頂點與 4 個直角！"
  },
  {
    id: "math_47",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "一個「[三角形]」有幾個邊和幾個頂點？",
    phonetic: "平面圖形的邊與頂點",
    options: [
      { text: "3 個邊、3 個頂點", isCorrect: true, hitResult: "平飛安打送回超前分！" },
      { text: "4 個邊、4 個頂點", isCorrect: false, hitResult: "這是四邊形！" },
      { text: "3 個邊、4 個頂點", isCorrect: false, hitResult: "頂點數算錯囉！" }
    ],
    hint: "三角形由三條直線段圍成，有 3 個邊和 3 個頂點！"
  },
  {
    id: "math_48",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "下面的描述中，哪一個是數學上「[直線]」的特點？",
    phonetic: "認識直線與曲線",
    options: [
      { text: "把繩子拉緊，直直的、沒有彎曲", isCorrect: true, hitResult: "乾淨俐落掃出看台！全壘打！" },
      { text: "像波浪一樣彎彎曲曲的", isCorrect: false, hitResult: "那是曲線！" },
      { text: "像蚊香一樣繞圈圈", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "沿著直尺邊緣畫出來、或把細繩拉緊的形狀，都是「直直的且不彎曲」的直線！"
  },
  {
    id: "math_49",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "一個長方形的[上邊長 12 公分]、[左邊長 5 公分]，那麼它的[下邊]長幾公分？",
    phonetic: "長方形對邊等長性質",
    options: [
      { text: "12 公分（上下對邊一樣長）", isCorrect: true, hitResult: "深遠安打！攻下大分！" },
      { text: "5 公分", isCorrect: false, hitResult: "5 公分是左右兩邊的長度喔！" },
      { text: "17 公分", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "長方形的上下兩邊一樣長、左右兩邊一樣長，所以上邊 12 公分，下邊也是 12 公分！"
  },
  {
    id: "math_50",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "在生活周遭，哪一個物品的角落可以找到標準的「[直角]」？",
    phonetic: "生活中的角",
    options: [
      { text: "數學課本的四個角落", isCorrect: true, hitResult: "再見滿貫全壘打！奪得冠軍盃！" },
      { text: "棒球的表面", isCorrect: false, hitResult: "棒球是圓球體沒有角！" },
      { text: "硬幣的邊緣", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "課本、三角板的直角端、正方形色紙的四個角都是標準的直角！"
  }
];
