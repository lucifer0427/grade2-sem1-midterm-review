/**
 * 國小二年級上學期期中考 棒球對決題庫
 * - 國語：康軒版第 1~6 課（新學年新希望、一起做早餐、走過小巷、運動會、坐竹籃船、小鎮的柿餅節）
 * - 數學：翰林版第 1~5 單元（200以內的數、二位數加減、公分長度、兩步驟應用、直線與角/平面圖形）
 */

export const CURRICULUM_DATA = [
  // ================= 國語：多音字與字音字形 (康軒版) =================
  {
    id: "chi_01",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "「放暑[假]真開心！」括號中的「假」讀音是？",
    phonetic: "ㄈㄤˋ ㄕㄨˇ ㄐㄧㄚˋ ㄓㄣ ㄎㄞ ㄒㄧㄣ",
    options: [
      { text: "ㄐㄧㄚˋ (四聲)", isCorrect: true, hitResult: "全壘打！直飛中外野！" },
      { text: "ㄐㄧㄚˇ (三聲)", isCorrect: false, hitResult: "揮棒落空！這是真假的意思喔。" },
      { text: "ㄐㄧㄚ (一聲)", isCorrect: false, hitResult: "界外球！沒有這個讀音。" }
    ],
    hint: "表示放假、假期的休息時間，要讀第四聲「ㄐㄧㄚˋ」喔！"
  },
  {
    id: "chi_02",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「想要進步，就[得]加倍努力。」括號中的「得」讀音是？",
    phonetic: "ㄒㄧㄤˇ ㄧㄠˋ ㄐㄧㄣˋ ㄅㄨˋ ， ㄐㄧㄡˋ ㄉㄟˇ ㄐㄧㄚ ㄅㄟˋ ㄋㄨˇ ㄌㄧˋ",
    options: [
      { text: "ㄉㄜˊ (二聲)", isCorrect: false, hitResult: "內野滾地出局！這是得到的意思。" },
      { text: "ㄉㄟˇ (三聲)", isCorrect: true, hitResult: "滿貫全壘打！越過計分板！" },
      { text: "˙ㄉㄜ (輕聲)", isCorrect: false, hitResult: "揮棒落空！這是跑得快的意思。" }
    ],
    hint: "表示「必須、不得不」時，要讀第三聲「ㄉㄟˇ」！"
  },
  {
    id: "chi_03",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "「微風輕輕的吹[著]。」括號中的「著」讀音是？",
    phonetic: "ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄑㄧㄥ ˙ㄉㄜ ㄔㄨㄟ ㄓㄜ˙",
    options: [
      { text: "ㄓㄨㄛˊ (二聲)", isCorrect: false, hitResult: "高飛球被接殺！這是著急的意思。" },
      { text: "ㄓㄠ (一聲)", isCorrect: false, hitResult: "界外球！這是著涼的意思。" },
      { text: "˙ㄓㄜ (輕聲)", isCorrect: true, hitResult: "轟出右外野看台！全壘打！" }
    ],
    hint: "表示動作正在持續進行（吹著、走著），讀輕聲「˙ㄓㄜ」！"
  },
  {
    id: "chi_04",
    subject: "國語",
    unit: "統整活動一",
    question: "「晴、暗、晨」這三個字都有共同的部件，和什麼有關？",
    phonetic: "ㄑㄧㄥˊ 、 ㄢˋ 、 ㄔㄣˊ",
    options: [
      { text: "太陽、時間 (日部)", isCorrect: true, hitResult: "陽春全壘打！轟出球場！" },
      { text: "月亮、身體 (月部)", isCorrect: false, hitResult: "投手正面滾地球出局！" },
      { text: "樹木、植物 (木部)", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "「日」字旁的字通常與太陽、白天或時間光線有關喔！"
  },
  {
    id: "chi_05",
    subject: "國語",
    unit: "第四課 運動會",
    question: "找出錯字：「大家齊心協立一起拔河。」哪一個字寫錯了？",
    phonetic: "ㄉㄚˋ ㄐㄧㄚ ㄑㄧˊ ㄒㄧㄣ ㄒㄧㄝˊ ㄌㄧˋ",
    options: [
      { text: "「立」應改為「力」", isCorrect: true, hitResult: "強勁平飛安打！攻下大分！" },
      { text: "「齊」應改為「奇」", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "「拔」應改為「撥」", isCorrect: false, hitResult: "三壘界外球出局！" }
    ],
    hint: "齊心協「力」表示大家一起出力，是力量的「力」！"
  },

  // ================= 數學：數值、運算與量測 (翰林版) =================
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
    unit: "第 3 單元 公分 (殘尺陷阱題)",
    question: "鉛筆的左端對齊直尺的【刻度 3】，右端對齊【刻度 9】，鉛筆長幾公分？",
    phonetic: "ㄑㄧㄢ ㄅㄧˇ ㄔㄤˊ ㄐㄧˇ ㄍㄨㄥ ㄈㄣ",
    options: [
      { text: "9 公分", isCorrect: false, hitResult: "揮空落空！陷阱：起點不是 0 刻度！" },
      { text: "6 公分 (9 - 3 = 6)", isCorrect: true, hitResult: "掃過中外野！滿貫砲！" },
      { text: "3 公分", isCorrect: false, hitResult: "擦棒被捕出局！" }
    ],
    hint: "注意！尺不是從 0 開始量，要用右邊刻度減左邊刻度：9 - 3 = 6 公分！"
  },
  {
    id: "math_03",
    subject: "數學",
    unit: "第 2 單元 二位數加減法",
    question: "棒球隊昨天練球有 48 顆球，今天又買了 35 顆，一共有幾顆球？",
    phonetic: "48 + 35 = ?",
    options: [
      { text: "73 顆", isCorrect: false, hitResult: "揮空！忘記個位 8+5=13 要進位囉！" },
      { text: "83 顆 (進位 1)", isCorrect: true, hitResult: "一棒擊沉！全壘打！" },
      { text: "85 顆", isCorrect: false, hitResult: "界外高飛球接殺！" }
    ],
    hint: "直式計算：個位 8 + 5 = 13（個位寫 3，十位進 1）；十位 4 + 3 + 1 = 8，共 83 顆！"
  },
  {
    id: "math_04",
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
    id: "math_05",
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
  }
];
