/**
 * 數學科（翰林版二上 第1~5單元）- 完整 50 題期中評量題庫
 * 涵蓋：200以內的數、二位數進退位加減法、公分與殘尺陷阱、加減兩步驟應用、直線與平面幾何
 */

export const MATH_QUESTIONS = [
  // --- 單元 1：200以內的數與錢幣化聚 (1~12) ---
  {
    id: "math_01",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "「108」讀作什麼？百位是 1、十位是 0、個位是 8。",
    phonetic: "ㄧ ㄅㄞˇ ㄌㄧㄥˊ ㄅㄚ",
    options: [
      { text: "一百零八", isCorrect: true, hitResult: "超大號全壘打！球飛進水池！" },
      { text: "一百八十", isCorrect: false, hitResult: "擊球無力，捕手前滾地球！" },
      { text: "一千零八", isCorrect: false, hitResult: "大揮空！那是四位數喔！" }
    ],
    hint: "中間十位是 0 要讀作「零」，不要讀成一百八喔！"
  },
  {
    id: "math_02",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "1 個百、5 個十和 3 個一合起來是多少？",
    phonetic: "100 + 50 + 3 = ?",
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
    question: "「一百四十」記作阿拉伯數字是什麼？",
    phonetic: "ㄧ ㄅㄞˇ ㄙˋ ㄕˊ",
    options: [
      { text: "140", isCorrect: true, hitResult: "平飛安打攻佔得點圈！" },
      { text: "104", isCorrect: false, hitResult: "揮棒落空！這是的一百零四。" },
      { text: "14", isCorrect: false, hitResult: "大揮空！忘了百位數！" }
    ],
    hint: "百位寫 1，十位寫 4，個位沒有就補 0，記作 140！"
  },
  {
    id: "math_04",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "小智有 1 張一百元鈔票，可以換成幾個十元硬幣？",
    phonetic: "100 ㄩㄢˊ = ㄐㄧˇ ㄍㄜ˙ 10 ㄩㄢˊ",
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
    question: "比較大小：172 和 169，哪一個數比較大？",
    phonetic: "172 ○ 169",
    options: [
      { text: "172 ＞ 169", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "172 ＜ 169", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "172 ＝ 169", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "百位都是 1，比較十位：7 個十比 6 個十大，所以 172 > 169！"
  },
  {
    id: "math_06",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "按照順序填填看：188、189、(  )、191、192。",
    phonetic: "ㄕㄨˋ ㄕㄨˋ ㄒㄩˋ ㄌㄧㄝˋ",
    options: [
      { text: "190", isCorrect: true, hitResult: "滿貫全壘打！全場沸騰！" },
      { text: "180", isCorrect: false, hitResult: "內野滾地刺殺！" },
      { text: "200", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "連續加 1 數數：189 再多 1 就是 190！"
  },
  {
    id: "math_07",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "1 張 100 元和 1 個 50 元硬幣合起來是多少元？",
    phonetic: "100 + 50 = ?",
    options: [
      { text: "150 元", isCorrect: true, hitResult: "紮實擊中球心！二壘安打！" },
      { text: "105 元", isCorrect: false, hitResult: "看錯球路被接殺！" },
      { text: "60 元", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "100 加上 50 等於 150 元！"
  },
  {
    id: "math_08",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "16 個十合起來是多少？",
    phonetic: "16 ㄍㄜ˙ 10",
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
    question: "5 個一數跳數：125、130、135、(  )、145。",
    phonetic: "ㄊㄧㄠˋ ㄕㄨˋ ㄒㄩˋ ㄌㄧㄝˋ",
    options: [
      { text: "140", isCorrect: true, hitResult: "乾淨俐落的安打！" },
      { text: "136", isCorrect: false, hitResult: "揮棒太快！" },
      { text: "150", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "每次多 5：135 + 5 = 140！"
  },
  {
    id: "math_10",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "「199」再加 1 是多少？",
    phonetic: "199 + 1 = ?",
    options: [
      { text: "200", isCorrect: true, hitResult: "超大號滿貫全壘打！" },
      { text: "190", isCorrect: false, hitResult: "擦棒被捕！" },
      { text: "100", isCorrect: false, hitResult: "好球進壘未揮棒！" }
    ],
    hint: "199 多 1，個位十位都進位，變成 2 個百，就是 200！"
  },
  {
    id: "math_11",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "小美買了一本 135 元的故事書，下面哪種付錢方式剛好不用找錢？",
    phonetic: "ㄈㄨˋ ㄑㄧㄢˊ ㄈㄤ ㄕˋ",
    options: [
      { text: "1 張 100 元、3 個 10 元、1 個 5 元", isCorrect: true, hitResult: "平飛安打攻佔壘包！" },
      { text: "1 張 100 元、5 個 10 元、3 個 1 元", isCorrect: false, hitResult: "這是 153 元，付太多囉！" },
      { text: "1 張 100 元、3 個 1 元", isCorrect: false, hitResult: "只有 103 元，付不夠喔！" }
    ],
    hint: "135 元 = 100 元 ＋ 30 元（3個10元）＋ 5 元！"
  },
  {
    id: "math_12",
    subject: "數學",
    unit: "第 1 單元 200以內的數",
    question: "在數線上，哪一個數最接近 150？",
    phonetic: "ㄐㄧㄝ ㄐㄧㄣˋ 150",
    options: [
      { text: "148 (只相差 2)", isCorrect: true, hitResult: "轟出全壘打！直擊外野草皮！" },
      { text: "140 (相差 10)", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "160 (相差 10)", isCorrect: false, hitResult: "界外高飛接殺！" }
    ],
    hint: "150 - 148 = 2，相差最小的數最接近！"
  },

  // --- 單元 2：二位數直式加減法 (13~24) ---
  {
    id: "math_13",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "棒球隊昨天練球有 48 顆球，今天又買了 35 顆，一共有幾顆球？",
    phonetic: "48 + 35 = ?",
    options: [
      { text: "83 顆 (進位 1)", isCorrect: true, hitResult: "一棒擊沉！全壘打！" },
      { text: "73 顆", isCorrect: false, hitResult: "揮空！忘記個位 8+5=13 要進位囉！" },
      { text: "85 顆", isCorrect: false, hitResult: "界外高飛球接殺！" }
    ],
    hint: "直式計算：個位 8 + 5 = 13（個位寫 3，十位進 1）；十位 4 + 3 + 1 = 8，共 83 顆！"
  },
  {
    id: "math_14",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式計算退位減法：72 - 38 = ？",
    phonetic: "72 - 38 = ?",
    options: [
      { text: "34", isCorrect: true, hitResult: "強勁安打！送回壘上跑者！" },
      { text: "44", isCorrect: false, hitResult: "揮棒太慢！十位借出 1 個十後只剩 6 囉！" },
      { text: "46", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "個位 2 不夠減 8，跟十位借 1 當 10：10 - 8 + 2 = 4；十位 6 - 3 = 3，答案是 34！"
  },
  {
    id: "math_15",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "書架上原有 64 本漫畫，借走 27 本，還剩下幾本？",
    phonetic: "64 - 27 = ?",
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
    question: "操場上有 29 個男生和 36 個女生，操場上共有幾位學童？",
    phonetic: "29 + 36 = ?",
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
    question: "直式計算：50 - 24 = ？",
    phonetic: "50 - 24 = ?",
    options: [
      { text: "26", isCorrect: true, hitResult: "高高飛過計分板！全壘打！" },
      { text: "36", isCorrect: false, hitResult: "揮棒落空！十位 4 - 2 = 2 喔！" },
      { text: "24", isCorrect: false, hitResult: "內野滾地！" }
    ],
    hint: "個位 0 不夠減 4，向十位借 1 當 10：10 - 4 = 6；十位 4 - 2 = 2，答案是 26！"
  },
  {
    id: "math_18",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式加法計算時，第一個步驟要先從哪一個位值開始算？",
    phonetic: "ㄓˊ ㄕˋ ㄙㄨㄢˋ ㄗㄜˊ",
    options: [
      { text: "個位對齊個位，先算個位", isCorrect: true, hitResult: "首打席陽春砲！" },
      { text: "先算十位", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "從哪邊開始算都沒差", isCorrect: false, hitResult: "好球三振！" }
    ],
    hint: "直式運算法則：先對齊位值，再從最低位（個位）開始計算！"
  },
  {
    id: "math_19",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "水果行進了 53 顆西瓜，上午賣掉 18 顆，下午賣掉 25 顆，一共賣掉幾顆？",
    phonetic: "18 + 25 = ?",
    options: [
      { text: "43 顆", isCorrect: true, hitResult: "一棒扛出全壘打牆！" },
      { text: "33 顆", isCorrect: false, hitResult: "揮空好球！" },
      { text: "45 顆", isCorrect: false, hitResult: "捕手前滾地刺殺！" }
    ],
    hint: "看清楚題目是問「一共賣掉幾顆」：18 + 25 = 43 顆！"
  },
  {
    id: "math_20",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "檢查驗算：算式 85 - 37 = 48，下面哪一個加法算式可以檢查有沒有算對？",
    phonetic: "ㄧㄢˋ ㄙㄨㄢˋ ㄈㄤ ㄈㄚˇ",
    options: [
      { text: "48 + 37 = 85", isCorrect: true, hitResult: "超前三分砲！" },
      { text: "85 + 48 = 133", isCorrect: false, hitResult: "揮棒過早！" },
      { text: "48 + 48 = 96", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "減法與加法互逆：差 ＋ 減數 ＝ 被減數（48 + 37 = 85）！"
  },
  {
    id: "math_21",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "計算：37 + 43 = ？",
    phonetic: "37 + 43 = ?",
    options: [
      { text: "80", isCorrect: true, hitResult: "直擊外野草皮平飛安打！" },
      { text: "70", isCorrect: false, hitResult: "揮棒太慢！忘了進位！" },
      { text: "81", isCorrect: false, hitResult: "出棒被接殺！" }
    ],
    hint: "個位 7 + 3 = 10（個位寫 0，十位進 1）；十位 3 + 4 + 1 = 8，等於 80！"
  },
  {
    id: "math_22",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "小華有 90 元，買鉛筆盒花了 45 元，他還剩下多少元？",
    phonetic: "90 - 45 = ?",
    options: [
      { text: "45 元", isCorrect: true, hitResult: "滿貫全壘打震撼登場！" },
      { text: "55 元", isCorrect: false, hitResult: "揮棒落空！十位借走 1 只剩 8！" },
      { text: "35 元", isCorrect: false, hitResult: "游擊滾地封殺！" }
    ],
    hint: "90 - 45 = 45 元！"
  },
  {
    id: "math_23",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "直式加法算式中，個位相加滿十時，要怎麼做？",
    phonetic: "ㄇㄢˇ ㄕˊ ㄐㄧㄣˋ ㄧ",
    options: [
      { text: "向十位進 1，並在十位上方標記小小的 1", isCorrect: true, hitResult: "再添一支全壘打！" },
      { text: "直接把 10 寫在個位", isCorrect: false, hitResult: "三振出局！" },
      { text: "假裝沒看見不用理它", isCorrect: false, hitResult: "揮空！" }
    ],
    hint: "滿十進一：個位滿十要向高位（十位）進 1！"
  },
  {
    id: "math_24",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "算算看：81 - 56 = ？",
    phonetic: "81 - 56 = ?",
    options: [
      { text: "25", isCorrect: true, hitResult: "深遠二壘安打！" },
      { text: "35", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "27", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "個位 11 - 6 = 5；十位 7 - 5 = 2，答案是 25！"
  },

  // --- 單元 3：公分長度測量與殘尺陷阱 (25~34) ---
  {
    id: "math_25",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "鉛筆的左端對齊直尺的【刻度 3】，右端對齊【刻度 9】，鉛筆長幾公分？",
    phonetic: "ㄑㄧㄢ ㄅㄧˇ ㄔㄤˊ ㄐㄧˇ ㄍㄨㄥ ㄈㄣ",
    options: [
      { text: "6 公分 (9 - 3 = 6)", isCorrect: true, hitResult: "掃過中外野！滿貫砲！" },
      { text: "9 公分", isCorrect: false, hitResult: "揮空落空！陷阱：起點不是 0 刻度！" },
      { text: "3 公分", isCorrect: false, hitResult: "擦棒被捕出局！" }
    ],
    hint: "注意！尺不是從 0 開始量，要用右邊刻度減左邊刻度：9 - 3 = 6 公分！"
  },
  {
    id: "math_26",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "橡皮擦的左端對齊直尺的【刻度 5】，右端對齊【刻度 11】，橡皮擦長多少？",
    phonetic: "11 - 5 = ?",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "全壘打！越過左外野標竿！" },
      { text: "11 公分", isCorrect: false, hitResult: "掉入陷阱！不能直讀末端數字！" },
      { text: "5 公分", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "非零起點計算：11 - 5 = 6 公分！"
  },
  {
    id: "math_27",
    subject: "數學",
    unit: "第 3 單元 公分 (測量基礎)",
    question: "用直尺測量課本長度時，物體的左端應該對齊直尺的哪裡最標準？",
    phonetic: "ㄎㄜˋ ㄉㄨˋ 0",
    options: [
      { text: "刻度「0」的線", isCorrect: true, hitResult: "平飛安打上壘！" },
      { text: "直尺最左邊的塑膠外框邊緣", isCorrect: false, hitResult: "擊球落空！外框到刻度 0 有縫隙喔！" },
      { text: "刻度「1」的線", isCorrect: false, hitResult: "滾地球出局！" }
    ],
    hint: "標準測量必須嚴格對齊「刻度 0 線」，不是對齊尺的外殼塑膠邊緣！"
  },
  {
    id: "math_28",
    subject: "數學",
    unit: "第 3 單元 公分 (單位認識)",
    question: "國際公制長度單位「公分」，英文縮寫記作什麼？",
    phonetic: "ㄍㄨㄥ ㄈㄣ ㄧㄥ ㄨㄣˊ",
    options: [
      { text: "cm", isCorrect: true, hitResult: "超大號陽春砲！" },
      { text: "kg", isCorrect: false, hitResult: "那是重量公斤喔！" },
      { text: "km", isCorrect: false, hitResult: "那是公里喔！" }
    ],
    hint: "公分的英文縮寫是 cm（Centimeter）！"
  },
  {
    id: "math_29",
    subject: "數學",
    unit: "第 3 單元 公分 (長度加減)",
    question: "紅絲帶長 18 公分，藍絲帶長 25 公分，兩條絲帶接在一起共長幾公分？",
    phonetic: "18 + 25 = ?",
    options: [
      { text: "43 公分", isCorrect: true, hitResult: "長打直擊外野看台！" },
      { text: "33 公分", isCorrect: false, hitResult: "揮棒落空！忘了進位！" },
      { text: "40 公分", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "相同單位直接相加：18 + 25 = 43 公分！"
  },
  {
    id: "math_30",
    subject: "數學",
    unit: "第 3 單元 公分 (長度比較)",
    question: "竹籤長 15 公分，吸管長 9 公分，竹籤比吸管長幾公分？",
    phonetic: "15 - 9 = ?",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "強勁安打帶有打點！" },
      { text: "24 公分", isCorrect: false, hitResult: "這是相加，題目問相差多少！" },
      { text: "7 公分", isCorrect: false, hitResult: "揮棒太快！" }
    ],
    hint: "比較差量用減法：15 - 9 = 6 公分！"
  },
  {
    id: "math_31",
    subject: "數學",
    unit: "第 3 單元 公分 (長度估測)",
    question: "我們手掌的食指指甲寬度，大約是多少長度？",
    phonetic: "ㄍㄨ ㄘㄜˋ 1 ㄍㄨㄥ ㄈㄣ",
    options: [
      { text: "大約 1 公分", isCorrect: true, hitResult: "精準擊中球心！全壘打！" },
      { text: "大約 10 公分", isCorrect: false, hitResult: "太長了！揮空！" },
      { text: "大約 100 公分", isCorrect: false, hitResult: "那是跟小朋友一樣高了！" }
    ],
    hint: "食指指甲寬度或大人衣服鈕扣直徑，大約就是 1 公分！"
  },
  {
    id: "math_32",
    subject: "數學",
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "一根粉筆從直尺的【刻度 2】量到【刻度 8】，這根粉筆長多少？",
    phonetic: "8 - 2 = ?",
    options: [
      { text: "6 公分", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "8 公分", isCorrect: false, hitResult: "揮棒落空！起點是 2 刻度喔！" },
      { text: "10 公分", isCorrect: false, hitResult: "出棒被接殺！" }
    ],
    hint: "8 - 2 = 6 公分！"
  },
  {
    id: "math_33",
    subject: "數學",
    unit: "第 3 單元 公分 (畫線技巧)",
    question: "要在紙上畫一條 7 公分的線段，筆尖應從刻度 0 畫到刻度幾？",
    phonetic: "ㄏㄨㄚˋ ㄒㄧㄢˋ ㄉㄨㄢˋ",
    options: [
      { text: "畫到刻度 7", isCorrect: true, hitResult: "平飛安打攻佔一二壘！" },
      { text: "畫到刻度 8", isCorrect: false, hitResult: "揮空好球！" },
      { text: "畫到刻度 6", isCorrect: false, hitResult: "擦棒出局！" }
    ],
    hint: "從刻度 0 開始畫，長度幾公分就畫到刻度幾（畫到 7）！"
  },
  {
    id: "math_34",
    subject: "數學",
    unit: "第 3 單元 公分 (長度估測)",
    question: "教室裡的課桌高度大約有多高？",
    phonetic: "ㄍㄨ ㄘㄜˋ ㄎㄜˋ ㄓㄨㄛ",
    options: [
      { text: "大約 60 公分", isCorrect: true, hitResult: "全壘打飛出場外！" },
      { text: "大約 6 公分", isCorrect: false, hitResult: "那只有橡皮擦大小！" },
      { text: "大約 600 公分", isCorrect: false, hitResult: "那是兩層樓高了！" }
    ],
    hint: "國小課桌高度大約在 55 ~ 65 公分之間！"
  },

  // --- 單元 4：加減兩步驟應用題 (35~44) ---
  {
    id: "math_35",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "休息區原本有 32 瓶水，上午喝掉 14 瓶，教練又搬來 20 瓶，現在有幾瓶？",
    phonetic: "32 - 14 + 20 = ?",
    options: [
      { text: "38 瓶 (先 32-14=18，再 18+20=38)", isCorrect: true, hitResult: "再見全壘打！全場歡呼！" },
      { text: "28 瓶", isCorrect: false, hitResult: "游擊方向雙殺打！" },
      { text: "42 瓶", isCorrect: false, hitResult: "揮棒落空！算式順序要注意喔！" }
    ],
    hint: "分兩步算：第一步 32 - 14 = 18 瓶；第二步 18 + 20 = 38 瓶！"
  },
  {
    id: "math_36",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "公車上原本有 25 人，到第一站下去 8 人，又上來 12 人，現在公車上有幾人？",
    phonetic: "25 - 8 + 12 = ?",
    options: [
      { text: "29 人", isCorrect: true, hitResult: "滿貫全壘打！比分逆轉！" },
      { text: "17 人", isCorrect: false, hitResult: "揮棒過早！只算完第一步！" },
      { text: "35 人", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "分步列式：25 - 8 = 17 人；17 + 12 = 29 人！"
  },
  {
    id: "math_37",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "小明有 50 元，買了 15 元的鉛筆和 20 元的筆記本，小明還剩下多少元？",
    phonetic: "50 - 15 - 20 = ?",
    options: [
      { text: "15 元 (先 15+20=35，再 50-35=15)", isCorrect: true, hitResult: "深遠安打！跑者連跑兩個壘包！" },
      { text: "25 元", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "35 元", isCorrect: false, hitResult: "這是花掉的錢，不是剩下的！" }
    ],
    hint: "先算花掉多少：15 + 20 = 35 元；再算剩下：50 - 35 = 15 元！"
  },
  {
    id: "math_38",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "花園裡有 16 朵紅花、24 朵黃花，媽媽採了 15 朵，花園裡還剩下幾朵花？",
    phonetic: "16 + 24 - 15 = ?",
    options: [
      { text: "25 朵", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "40 朵", isCorrect: false, hitResult: "只算完全部有幾朵，忘了扣掉採走的！" },
      { text: "35 朵", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "第一步先算全部：16 + 24 = 40 朵；第二步扣掉採走：40 - 15 = 25 朵！"
  },
  {
    id: "math_39",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "箱子裡有 60 顆棒球，二甲借走 22 顆，二乙借走 18 顆，箱子裡還剩幾顆？",
    phonetic: "60 - 22 - 18 = ?",
    options: [
      { text: "20 顆", isCorrect: true, hitResult: "掃過外野大牆！再添兩分！" },
      { text: "40 顆", isCorrect: false, hitResult: "揮棒落空！那是借走的總數！" },
      { text: "30 顆", isCorrect: false, hitResult: "滾地球刺殺！" }
    ],
    hint: "共借走：22 + 18 = 40 顆；剩下：60 - 40 = 20 顆！"
  },
  {
    id: "math_40",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "哥哥有 42 張球員卡，弟弟比哥哥少 15 張，兩人一共有幾張球員卡？",
    phonetic: "42 + (42 - 15) = ?",
    options: [
      { text: "69 張", isCorrect: true, hitResult: "超大號滿貫全壘打！" },
      { text: "27 張", isCorrect: false, hitResult: "這只是弟弟的卡片張數！" },
      { text: "57 張", isCorrect: false, hitResult: "出棒被接殺！" }
    ],
    hint: "第一步先算弟弟：42 - 15 = 27 張；第二步合起來：42 + 27 = 69 張！"
  },
  {
    id: "math_41",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "麵包店烤了 85 個蛋塔，早上賣出 38 個，下午賣出 27 個，還剩下幾個？",
    phonetic: "85 - 38 - 27 = ?",
    options: [
      { text: "20 個", isCorrect: true, hitResult: "擊潰對手王牌！全壘打！" },
      { text: "65 個", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "30 個", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "賣掉：38 + 27 = 65 個；剩下：85 - 65 = 20 個！"
  },
  {
    id: "math_42",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "小美原本有 18 顆糖果，爸爸給她 15 顆，她吃掉 7 顆，現在有幾顆？",
    phonetic: "18 + 15 - 7 = ?",
    options: [
      { text: "26 顆", isCorrect: true, hitResult: "二壘安打清空壘包！" },
      { text: "33 顆", isCorrect: false, hitResult: "揮空好球！忘了算吃掉的！" },
      { text: "25 顆", isCorrect: false, hitResult: "內野滾地！" }
    ],
    hint: "先算得到後共有：18 + 15 = 33 顆；吃掉 7 顆：33 - 7 = 26 顆！"
  },
  {
    id: "math_43",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "跳繩隊男生有 26 人，女生比男生多 9 人，跳繩隊一共有多少人？",
    phonetic: "26 + (26 + 9) = ?",
    options: [
      { text: "61 人", isCorrect: true, hitResult: "平飛安打得分！" },
      { text: "35 人", isCorrect: false, hitResult: "這只是女生的人數！" },
      { text: "51 人", isCorrect: false, hitResult: "揮棒落空！忘了進位！" }
    ],
    hint: "女生人數：26 + 9 = 35 人；全隊人數：26 + 35 = 61 人！"
  },
  {
    id: "math_44",
    subject: "數學",
    unit: "第 4 單元 加減兩步驟應用",
    question: "停車場原有 52 輛車，開走 19 輛，又開進來 14 輛，現在有幾輛車？",
    phonetic: "52 - 19 + 14 = ?",
    options: [
      { text: "47 輛", isCorrect: true, hitResult: "全壘打！越過外野大螢幕！" },
      { text: "33 輛", isCorrect: false, hitResult: "只算完第一步！" },
      { text: "57 輛", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "52 - 19 = 33 輛；33 + 14 = 47 輛！"
  },

  // --- 單元 5：直線與角 / 平面圖形 (45~50) ---
  {
    id: "math_45",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "關於「正方形」的秘密，哪一個說法是正確的？",
    phonetic: "ㄓㄥˋ ㄈㄤ ㄒㄧㄥˊ",
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
    question: "長方形和正方形共同擁有的特徵是什麼？",
    phonetic: "ㄍㄨㄥˋ ㄊㄨㄥˊ ㄊㄜˋ ㄓㄥ",
    options: [
      { text: "都有 4 個邊、4 個頂點和 4 個直角", isCorrect: true, hitResult: "轟出特大號滿貫全壘打！" },
      { text: "四個邊都必須一樣長", isCorrect: false, hitResult: "長方形只有對邊等長喔！" },
      { text: "三個邊一樣長", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "長方形與正方形都是四邊形，都有 4 條邊、4 個頂點與 4 個直角！"
  },
  {
    id: "math_47",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "三角形有幾個邊和幾個頂點？",
    phonetic: "ㄙㄢ ㄐㄧㄠˇ ㄒㄧㄥˊ",
    options: [
      { text: "3 個邊、3 個頂點", isCorrect: true, hitResult: "平飛安打送回超前分！" },
      { text: "4 個邊、4 個頂點", isCorrect: false, hitResult: "這是四邊形！" },
      { text: "3 個邊、4 個頂點", isCorrect: false, hitResult: "頂點數算錯囉！" }
    ],
    hint: "三角形由三條直線連接而成，有 3 個邊和 3 個頂點！"
  },
  {
    id: "math_48",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "下面的描述中，哪一個是「直線」的特點？",
    phonetic: "ㄓˊ ㄒㄧㄢˋ",
    options: [
      { text: "直直的、沒有彎曲，有兩個端點", isCorrect: true, hitResult: "乾淨俐落掃出看台！全壘打！" },
      { text: "像波浪一樣彎彎曲曲的", isCorrect: false, hitResult: "那是曲線！" },
      { text: "轉角圓圓的沒有頂點", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "拿直尺畫出來、拉緊的細線都是直線，特徵是「直直的且不彎曲」！"
  },
  {
    id: "math_49",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "教室黑板的表面是什麼形狀？",
    phonetic: "ㄏㄟ ㄅㄢˇ ㄒㄧㄥˊ ㄓㄨㄤˋ",
    options: [
      { text: "長方形 (上下等長、左右等長)", isCorrect: true, hitResult: "深遠安打！攻下大分！" },
      { text: "正方形", isCorrect: false, hitResult: "黑板上下比左右長很多喔！" },
      { text: "圓形", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "黑板對邊等長、有四個直角，是標準的長方形！"
  },
  {
    id: "math_50",
    subject: "數學",
    unit: "第 5 單元 平面圖形與直線",
    question: "在生活周遭，哪一個物品的角落可以找到「直角」？",
    phonetic: "ㄓˊ ㄐㄧㄠˇ",
    options: [
      { text: "數學課本的四個角落", isCorrect: true, hitResult: "再見滿貫全壘打！奪得冠軍盃！" },
      { text: "棒球的表面", isCorrect: false, hitResult: "棒球是圓形沒有角！" },
      { text: "呼拉圈的邊緣", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "課本、墊板、白板、桌角等邊緣方正相交的角落都是直角！"
  }
];
