/**
 * 國語科（康軒版二上 第1~6課、統整活動一與二）- 完整 50 題期中評量題庫
 * 涵蓋：多音字、形近字挑錯、部件部首、課文文意理解、短語仿寫與量詞
 * 已通過審定本生字表與教育部國語辭典簡編本讀音校驗（防洩題遮罩版）
 */

export const CHINESE_QUESTIONS = [
  // --- 多音字辨析 (1~10)：遮罩目標字注音防止洩題 ---
  {
    id: "chi_01",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "「放暑[假]真開心！」框起來的「假」讀音是？",
    phonetic: "ㄈㄤˋ ㄕㄨˇ 【 ？ 】 ㄓㄣ ㄎㄞ ㄒㄧㄣ",
    options: [
      { text: "ㄐㄧㄚˋ (四聲)", isCorrect: true, hitResult: "全壘打！直飛中外野！" },
      { text: "ㄐㄧㄚˇ (三聲)", isCorrect: false, hitResult: "揮棒落空！三聲是真假、假裝喔。" },
      { text: "ㄐㄧㄚ (一聲)", isCorrect: false, hitResult: "界外球！沒有這個讀音。" }
    ],
    hint: "表示放假、假期的休息時間，要讀第四聲「ㄐㄧㄚˋ」！"
  },
  {
    id: "chi_02",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「想要進步，就[得]加倍努力。」框起來的「得」讀音是？",
    phonetic: "ㄒㄧㄤˇ ㄧㄠˋ ㄐㄧㄣˋ ㄅㄨˋ ， ㄐㄧㄡˋ 【 ？ 】 ㄐㄧㄚ ㄅㄟˋ ㄋㄨˇ ㄌㄧˋ",
    options: [
      { text: "ㄉㄜˊ (二聲)", isCorrect: false, hitResult: "內野滾地出局！二聲是得到、得獎。" },
      { text: "ㄉㄟˇ (三聲)", isCorrect: true, hitResult: "滿貫全壘打！越過計分板！" },
      { text: "˙ㄉㄜ (輕聲)", isCorrect: false, hitResult: "揮棒落空！輕聲是跑得快。" }
    ],
    hint: "表示「必須、不得不」時，要讀第三聲「ㄉㄟˇ」！"
  },
  {
    id: "chi_03",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "「微風輕輕的吹[著]。」框起來的「著」讀音是？",
    phonetic: "ㄨㄟˊ ㄈㄥ ㄑㄧㄥ ㄑㄧㄥ ˙ㄉㄜ ㄔㄨㄟ 【 ？ 】",
    options: [
      { text: "ㄓㄨㄛˊ (二聲)", isCorrect: false, hitResult: "高飛球被接殺！二聲是著急、穿著。" },
      { text: "ㄓㄠ (一聲)", isCorrect: false, hitResult: "界外球！一聲是著涼、睡著。" },
      { text: "˙ㄓㄜ (輕聲)", isCorrect: true, hitResult: "轟出右外野看台！全壘打！" }
    ],
    hint: "表示動作正在持續進行（吹著、走著、看著），讀輕聲「˙ㄓㄜ」！"
  },
  {
    id: "chi_04",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「老師在[教]室裡上課。」框起來的「教」讀音是？",
    phonetic: "ㄌㄠˇ ㄕ ㄗㄞˋ 【 ？ 】 ㄕˋ ㄌㄧˇ ㄕㄤˋ ㄎㄜˋ",
    options: [
      { text: "ㄐㄧㄠˋ (四聲)", isCorrect: true, hitResult: "陽春砲炸裂！" },
      { text: "ㄐㄧㄠ (一聲)", isCorrect: false, hitResult: "揮棒太慢落空！一聲是「教書、教唱」的動作。" },
      { text: "ㄐㄧㄠˇ (三聲)", isCorrect: false, hitResult: "界外球！沒有這個讀音。" }
    ],
    hint: "「教室、教師、教育」作為場所或名詞時，讀第四聲「ㄐㄧㄠˋ」！"
  },
  {
    id: "chi_05",
    subject: "國語",
    unit: "統整活動二",
    question: "「星期天你有一點[空]閒嗎？」框起來的「空」讀音是？",
    phonetic: "ㄒㄧㄥ ㄑㄧˊ ㄊㄧㄢ ㄋㄧˇ ㄧㄡˇ 【 ？ 】 ㄒㄧㄢˊ ˙ㄇㄚ",
    options: [
      { text: "ㄎㄨㄥ (一聲)", isCorrect: false, hitResult: "投手正面接殺！一聲是天空、空氣。" },
      { text: "ㄎㄨㄥˋ (四聲)", isCorrect: true, hitResult: "中外野大號全壘打！" },
      { text: "ㄍㄨㄥ (一聲)", isCorrect: false, hitResult: "大揮空！讀音完全不同！" }
    ],
    hint: "表示閒暇時間或空間間隙（有空、空地、填空）讀第四聲「ㄎㄨㄥˋ」！"
  },
  {
    id: "chi_06",
    subject: "國語",
    unit: "第四課 運動會",
    question: "「風車在風中一直[轉]動。」框起來的「轉」讀音是？",
    phonetic: "ㄈㄥ ㄔㄜ ㄧˋ ㄓˊ 【 ？ 】 ㄉㄨㄥˋ",
    options: [
      { text: "ㄓㄨㄢˋ (四聲)", isCorrect: true, hitResult: "一棒扛出全壘打牆！" },
      { text: "ㄓㄨㄢˇ (三聲)", isCorrect: false, hitResult: "擦棒出局！三聲是轉彎、轉身。" },
      { text: "ㄓㄨㄢ (一聲)", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "圍繞中心打轉、旋轉（轉動、轉圈）讀第四聲「ㄓㄨㄢˋ」！"
  },
  {
    id: "chi_07",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「弟弟今天自己[背]著大書包上學。」框起來的「背」讀音是？",
    phonetic: "ㄉㄧˋ ˙ㄉㄧ 【 ？ 】 ˙ㄓㄜ ㄉㄚˋ ㄕㄨ ㄅㄠ",
    options: [
      { text: "ㄅㄟ (一聲)", isCorrect: true, hitResult: "超大號安打送回兩分！" },
      { text: "ㄅㄟˋ (四聲)", isCorrect: false, hitResult: "擊球無力滾地！四聲是後背、背影。" },
      { text: "ㄅㄞ (一聲)", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "用肩膀馱負物品的動作（背書包、背小孩）讀第一聲「ㄅㄟ」！"
  },
  {
    id: "chi_08",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "「妹妹跑[得]滿頭大汗。」框起來的「得」讀音是？",
    phonetic: "ㄇㄟˋ ˙ㄇㄟ ㄆㄠˇ 【 ？ 】 ㄇㄢˇ ㄊㄡˊ ㄉㄚˋ ㄏㄢˋ",
    options: [
      { text: "˙ㄉㄜ (輕聲)", isCorrect: true, hitResult: "直擊外野看台！全壘打！" },
      { text: "ㄉㄜˊ (二聲)", isCorrect: false, hitResult: "二壘滾地球封殺！" },
      { text: "ㄉㄟˇ (三聲)", isCorrect: false, hitResult: "揮棒過早落空！" }
    ],
    hint: "接在動詞後面表示狀態或程度（跑得快、跳得高）讀輕聲「˙ㄉㄜ」！"
  },
  {
    id: "chi_09",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "「小明[假]裝成一隻兇猛的老虎。」框起來的「假」讀音是？",
    phonetic: "ㄒㄧㄠˇ ㄇㄧㄥˊ 【 ？ 】 ㄓㄨㄤ ㄔㄥˊ ㄌㄠˇ ㄏㄨˇ",
    options: [
      { text: "ㄐㄧㄚˇ (三聲)", isCorrect: true, hitResult: "強勁安打！跑者衝回本壘！" },
      { text: "ㄐㄧㄚˋ (四聲)", isCorrect: false, hitResult: "游擊手攔截出局！四聲是放假。" },
      { text: "ㄐㄧㄚ (一聲)", isCorrect: false, hitResult: "好球未揮棒！" }
    ],
    hint: "表不真實、偽裝（假裝、真假、假如）讀第三聲「ㄐㄧㄚˇ」！"
  },
  {
    id: "chi_10",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "「藍藍的天[空]飄著幾朵白雲。」框起來的「空」讀音是？",
    phonetic: "ㄌㄢˊ ㄌㄢˊ ˙ㄉㄜ ㄊㄧㄢ 【 ？ 】",
    options: [
      { text: "ㄎㄨㄥ (一聲)", isCorrect: true, hitResult: "轟破記分板！全壘打！" },
      { text: "ㄎㄨㄥˋ (四聲)", isCorrect: false, hitResult: "揮棒落空！四聲是有空、空地。" },
      { text: "ㄎㄨㄥˊ (二聲)", isCorrect: false, hitResult: "界外飛球接殺！" }
    ],
    hint: "廣大無邊的空間、沒有東西（天空、空氣、空手）讀第一聲「ㄎㄨㄥ」！"
  },

  // --- 形近字挑錯與字形辨析 (11~22)：鎖定康軒二上 1~6 課核心生字 ---
  {
    id: "chi_11",
    subject: "國語",
    unit: "第四課 運動會",
    question: "找出錯字：「大家齊心協立一起拔河。」哪一個字寫錯了？",
    phonetic: "ㄑㄧˊ ㄒㄧㄣ ㄒㄧㄝˊ ㄌㄧˋ",
    options: [
      { text: "「立」應改為「力」", isCorrect: true, hitResult: "強勁安打！得分！" },
      { text: "「齊」應改為「奇」", isCorrect: false, hitResult: "揮棒太慢落空！" },
      { text: "「拔」應改為「撥」", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "齊心協「力」表示大家一起出力，是力量的「力」！"
  },
  {
    id: "chi_12",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "找出錯字：「小貓在向子裡曬太陽。」哪一個字寫錯了？",
    phonetic: "ㄒㄧㄤˋ ˙ㄗ ㄌㄧˇ",
    options: [
      { text: "「向」應改為「巷」", isCorrect: true, hitResult: "全壘打！直奔中外野！" },
      { text: "「貓」應改為「描」", isCorrect: false, hitResult: "內野飛球接殺！" },
      { text: "「陽」應改為「揚」", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "小「巷」裡面有住宅與紅磚牆，是小巷弄的「巷」！"
  },
  {
    id: "chi_13",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "「圓」和「園」怎麼選？「花[  ]裡的番茄像輪子一樣[  ]。」",
    phonetic: "ㄏㄨㄚ ㄩㄢˊ 、 ㄩㄢˊ ㄒㄧㄥˊ",
    options: [
      { text: "園、圓", isCorrect: true, hitResult: "二壘安打清壘！" },
      { text: "圓、園", isCorrect: false, hitResult: "揮棒落空！順序相反囉！" },
      { text: "園、園", isCorrect: false, hitResult: "滾地球刺殺！" }
    ],
    hint: "植物生長的地方是「花園」，形狀像輪子圓圓的是「圓」！"
  },
  {
    id: "chi_14",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "找出錯字：「小烏龜走得很漫。」哪一個字寫錯了？（第三課生字）",
    phonetic: "ㄗㄡˇ ˙ㄉㄜ ㄏㄣˇ ㄇㄢˋ",
    options: [
      { text: "「漫」應改為「慢」", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "「走」應改為「足」", isCorrect: false, hitResult: "界外球出局！" },
      { text: "「很」應改為「狠」", isCorrect: false, hitResult: "揮棒過早！" }
    ],
    hint: "速度不快、慢慢走是豎心旁的「慢」（快慢的慢）！"
  },
  {
    id: "chi_15",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "「晨」字和時間有關，它的部首是什麼？",
    phonetic: "ㄑㄧㄥ ㄔㄣˊ ˙ㄉㄜ ㄔㄣˊ",
    options: [
      { text: "日部", isCorrect: true, hitResult: "滿貫全壘打！" },
      { text: "辰部", isCorrect: false, hitResult: "投手正面接殺！" },
      { text: "月部", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "「晨」上面是「日」，代表清晨太陽升起，所以是日部！"
  },
  {
    id: "chi_16",
    subject: "國語",
    unit: "第四課 運動會",
    question: "找出錯字：「操場上漂著五彩旗幟。」哪一個字寫錯了？",
    phonetic: "ㄆㄧㄠ ˙ㄓㄜ ㄑㄧˊ ㄓˋ",
    options: [
      { text: "「漂」應改為「飄」", isCorrect: true, hitResult: "右外野深遠全壘打！" },
      { text: "「彩」應改為「採」", isCorrect: false, hitResult: "滾地雙殺！" },
      { text: "「場」應改為「暢」", isCorrect: false, hitResult: "揮空好球！" }
    ],
    hint: "在空中隨風擺動是「飄」（風部），在水上浮著才是「漂」（水部）！"
  },
  {
    id: "chi_17",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "「籃」和「藍」的分別：「外公坐在[  ]色的竹[  ]船上。」",
    phonetic: "ㄌㄢˊ ㄙㄜˋ 、 ㄓㄨˊ ㄌㄢˊ ㄔㄨㄢˊ",
    options: [
      { text: "藍、籃", isCorrect: true, hitResult: "一支漂亮的高飛犧牲打送回得分！" },
      { text: "籃、藍", isCorrect: false, hitResult: "看錯球路被三振！" },
      { text: "藍、藍", isCorrect: false, hitResult: "界外高飛球！" }
    ],
    hint: "顏色的藍是「艸字頭藍」，竹子編織的竹籃船是「竹字頭籃」！"
  },
  {
    id: "chi_18",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "找出錯字：「秋天吹起乾噪的九降風。」哪一個字寫錯了？",
    phonetic: "ㄍㄢ ㄗㄠˋ",
    options: [
      { text: "「噪」應改為「燥」", isCorrect: true, hitResult: "中外野大號全壘打！" },
      { text: "「乾」應改為「幹」", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "「吹」應改為「炊」", isCorrect: false, hitResult: "捕手接殺！" }
    ],
    hint: "天氣乾「燥」缺水容易起火，是火部的「燥」；口部「噪」是噪音！"
  },
  {
    id: "chi_19",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「準」和「准」的分別：「媽媽[  ]許我做考前[  ]備。」",
    phonetic: "ㄓㄨㄣˇ ㄒㄩˇ 、 ㄓㄨㄣˇ ㄅㄟˋ",
    options: [
      { text: "准、準", isCorrect: true, hitResult: "平飛安打上二壘！" },
      { text: "準、准", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "準、準", isCorrect: false, hitResult: "外野飛球被接殺！" }
    ],
    hint: "答應批准是兩點水的「准」；準備標準是十部（上頭有水與隹）的「準」！"
  },
  {
    id: "chi_20",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "「暖」的部首是什麼？它與什麼有關係？",
    phonetic: "ㄨㄣ ㄋㄨㄢˇ ˙ㄉㄜ ㄋㄨㄢˇ",
    options: [
      { text: "日部，和太陽溫暖有關", isCorrect: true, hitResult: "全壘打！打者霸氣甩棒！" },
      { text: "火部，和煮飯火焰有關", isCorrect: false, hitResult: "好球未揮！" },
      { text: "爪部，和抓取有關", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "「暖」左邊是「日」，陽光照下來讓人感到溫暖！"
  },
  {
    id: "chi_21",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "找出錯字：「大家分公合作做早餐。」哪一個字寫錯了？",
    phonetic: "ㄈㄣ ㄍㄨㄥ ㄏㄜˊ ㄗㄨㄛˋ",
    options: [
      { text: "「公」應改為「工」", isCorrect: true, hitResult: "全壘打飛出場外！" },
      { text: "「作」應改為「做」", isCorrect: false, hitResult: "界外球！" },
      { text: "「合」應改為「和」", isCorrect: false, hitResult: "滾地球出局！" }
    ],
    hint: "分「工」合作是分擔工作，是工作的「工」！"
  },
  {
    id: "chi_22",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "「柿」和「市」的分別：「我們去[  ]場買甜甜的[  ]餅。」",
    phonetic: "ㄕˋ ㄔㄤˇ 、 ㄕˋ ㄅㄧㄥˇ",
    options: [
      { text: "市、柿", isCorrect: true, hitResult: "掃過大牆！超前比分！" },
      { text: "柿、市", isCorrect: false, hitResult: "球路看錯出局！" },
      { text: "柿、柿", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "買東西的市集是「市」；長在樹上的柿子水果是木部的「柿」！"
  },

  // --- 部件與部首綜合歸納 (23~32) ---
  {
    id: "chi_23",
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
    id: "chi_24",
    subject: "國語",
    unit: "統整活動二",
    question: "「腿、胸、背」這三個字左邊或下方的部首是？",
    phonetic: "ㄊㄨㄟˇ 、 ㄒㄩㄥ 、 ㄅㄟˋ",
    options: [
      { text: "肉部 (常寫成月字旁)", isCorrect: true, hitResult: "二壘安打帶有一分打點！" },
      { text: "月部 (和夜晚有關)", isCorrect: false, hitResult: "一壘滾地刺殺！" },
      { text: "骨部", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "人體器官、肌肉部位的字，部首多半是「肉部」（偏旁寫作月）！"
  },
  {
    id: "chi_25",
    subject: "國語",
    unit: "統整活動二",
    question: "「籃、筷、筆」這些字上面的部件都是「⺮」，代表什麼？",
    phonetic: "ㄓㄨˊ ㄗˋ ㄊㄡˊ",
    options: [
      { text: "古代用竹子做成的器具", isCorrect: true, hitResult: "滿貫全壘打震撼全場！" },
      { text: "用金屬做成的武器", isCorrect: false, hitResult: "揮空！" },
      { text: "好吃的蔬菜水果", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "「⺮」是竹字頭，竹籃、竹筷、毛筆筆桿早期都是竹子做的！"
  },
  {
    id: "chi_26",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "「疊」字的部首是什麼？",
    phonetic: "ㄉㄧㄝˊ ㄉㄧㄝˊ ㄌㄜˋ ˙ㄉㄜ ㄉㄧㄝˊ",
    options: [
      { text: "田部", isCorrect: true, hitResult: "超前兩分全壘打！" },
      { text: "日部", isCorrect: false, hitResult: "三振出局！" },
      { text: "木部", isCorrect: false, hitResult: "游擊滾地被封殺！" }
    ],
    hint: "「疊」上面有三個田，部首是「田部」喔！"
  },
  {
    id: "chi_27",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "「餅、糕、糖」這三個字都有「米」或「飠」部件，和什麼有關？",
    phonetic: "ㄅㄧㄥˇ 、 ㄍㄠ 、 ㄊㄤˊ",
    options: [
      { text: "糧食、米麥做成的食品", isCorrect: true, hitResult: "長打飛越外野手頭頂！" },
      { text: "穿在身上的衣服", isCorrect: false, hitResult: "揮空落空！" },
      { text: "田裡耕作的農具", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "「食（飠）部」與「米部」的字大多與糧食、糕餅甜點或飲食相關！"
  },
  {
    id: "chi_28",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「相互幫助」的「互」字有幾畫？部首是什麼？",
    phonetic: "ㄏㄨˋ ㄒㄧㄤ",
    options: [
      { text: "4 畫，二部", isCorrect: true, hitResult: "乾淨俐落的中外野安打！" },
      { text: "5 畫，一部", isCorrect: false, hitResult: "打成擦棒球！" },
      { text: "3 畫，工部", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "筆畫順序：一、㇄、𠃍、一，共 4 畫，部首為「二部」。"
  },
  {
    id: "chi_29",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "「靜」字的部首是什麼？",
    phonetic: "ㄢ ㄐㄧㄥˋ ˙ㄉㄜ ㄐㄧㄥˋ",
    options: [
      { text: "青部", isCorrect: true, hitResult: "轟破右外野標竿！全壘打！" },
      { text: "爭部", isCorrect: false, hitResult: "投手觸殺出局！" },
      { text: "言部", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "「靜」左邊是「青」，部首是「青部」！"
  },
  {
    id: "chi_30",
    subject: "國語",
    unit: "第四課 運動會",
    question: "「舞」字有幾畫？它的部首是什麼？",
    phonetic: "ㄊㄧㄠˋ ㄨˇ ˙ㄉㄜ ㄨˇ",
    options: [
      { text: "14 畫，舛部", isCorrect: true, hitResult: "全壘打！帶動全場歡呼！" },
      { text: "12 畫，無部", isCorrect: false, hitResult: "外野深遠被接殺！" },
      { text: "16 畫，夕部", isCorrect: false, hitResult: "揮空落空！" }
    ],
    hint: "「舞」下面是兩隻腳相對跳動的形狀，部首是「舛（ㄔㄨㄢˇ）部」，共 14 畫！"
  },
  {
    id: "chi_31",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "「越」過小河的「越」是什麼部首？",
    phonetic: "ㄩㄝˋ ㄍㄨㄛˋ",
    options: [
      { text: "走部", isCorrect: true, hitResult: "強勁安打攻佔得點圈！" },
      { text: "戊部", isCorrect: false, hitResult: "內野刺殺！" },
      { text: "足部", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "「越」左邊是「走」，表示跨越、邁步行走，為走部！"
  },
  {
    id: "chi_32",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "「節」字的部首是？",
    phonetic: "ㄐㄧㄝˊ ㄑㄧㄥˋ ˙ㄉㄜ ㄐㄧㄝˊ",
    options: [
      { text: "竹部", isCorrect: true, hitResult: "再添一支全壘打！" },
      { text: "卩部", isCorrect: false, hitResult: "界外球出局！" },
      { text: "艸部", isCorrect: false, hitResult: "好球進壘未出棒！" }
    ],
    hint: "竹子一段一段的地方叫做竹節，所以節慶的「節」是竹部！"
  },

  // --- 課文文意理解 (33~42) ---
  {
    id: "chi_33",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "在〈新學年新希望〉中，作者升上二年級後希望怎麼做？",
    phonetic: "ㄎㄜˋ ㄨㄣˊ ㄨㄣˊ ㄧˋ",
    options: [
      { text: "上課更專心，和同學互相幫助", isCorrect: true, hitResult: "三分全壘打！直飛外野大牆！" },
      { text: "天天睡到自然醒不上學", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "整天只玩電腦遊戲", isCorrect: false, hitResult: "好球揮空！" }
    ],
    hint: "升上二年級要確立良好學習常規，專心聽講並與同儕互助！"
  },
  {
    id: "chi_34",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "在〈一起做早餐〉中，全家人用什麼材料做出「小城堡」？",
    phonetic: "ㄗㄠˇ ㄘㄢ ㄗㄨㄛˋ ㄈㄚˇ",
    options: [
      { text: "將吐司一片一片疊起來", isCorrect: true, hitResult: "掃過外野草皮的一壘安打！" },
      { text: "用黏土做出來的", isCorrect: false, hitResult: "看錯球路被接殺！" },
      { text: "用紙箱蓋出來的", isCorrect: false, hitResult: "揮空落空！" }
    ],
    hint: "課文中全家分工合作，用一層一層的吐司疊成美味的小城堡！"
  },
  {
    id: "chi_35",
    subject: "國語",
    unit: "第三課 走過小巷",
    question: "走在清晨的社區小巷裡，作者注意到了什麼景物？",
    phonetic: "ㄒㄧㄠˇ ㄒㄧㄤˋ ㄍㄨㄢ ㄔㄚˊ",
    options: [
      { text: "微風輕吹、小貓在牆上曬暖陽", isCorrect: true, hitResult: "越過內野頭頂的平飛安打！" },
      { text: "路上車水馬龍大塞車", isCorrect: false, hitResult: "出棒過晚！" },
      { text: "狂風暴雨吹倒路樹", isCorrect: false, hitResult: "擦棒被捕！" }
    ],
    hint: "小巷清晨寧靜溫馨，微風輕撫，小貓慵懶地享受暖洋洋的陽光。"
  },
  {
    id: "chi_36",
    subject: "國語",
    unit: "第四課 運動會",
    question: "運動會拔河比賽時，隊員們是如何拿到勝利的？",
    phonetic: "ㄅㄚˊ ㄏㄜˊ ㄐㄧㄥ ㄕㄣˊ",
    options: [
      { text: "步調一致，齊心協力往後拉", isCorrect: true, hitResult: "炸裂全壘打！比分拉開！" },
      { text: "大家隨便拉拉看運氣", isCorrect: false, hitResult: "三振出局！" },
      { text: "一個人用力其他人休息", isCorrect: false, hitResult: "滾地球刺殺！" }
    ],
    hint: "拔河需要全隊配合節奏、同心協力，才能發揮最大的團隊力量！"
  },
  {
    id: "chi_37",
    subject: "國語",
    unit: "第五課 坐竹籃船",
    question: "作者是在哪裡搭乘好玩又特別的「竹籃船」？",
    phonetic: "ㄓㄨˊ ㄌㄢˊ ㄔㄨㄢˊ ㄉㄧˋ ㄉㄧㄢˇ",
    options: [
      { text: "媽媽的家鄉（越南水鄉）", isCorrect: true, hitResult: "滿貫全壘打！越過中外野大螢幕！" },
      { text: "日本的滑雪場", isCorrect: false, hitResult: "界外球接殺！" },
      { text: "北極的冰山上", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "作者隨母親回到越南外公家探親，體驗東南亞水鄉獨特的竹籃船！"
  },
  {
    id: "chi_38",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "新竹小鎮曬製柿餅時，最需要哪一種天然氣候條件的幫忙？",
    phonetic: "ㄉㄧˋ ㄈㄤ ㄔㄢˇ ㄧㄝˋ",
    options: [
      { text: "乾燥的九降風與秋天溫暖日光", isCorrect: true, hitResult: "全壘打！滿場煙火歡呼！" },
      { text: "連續好幾天傾盆大雨", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "又濕又冷的冬天冰雹", isCorrect: false, hitResult: "好球三振！" }
    ],
    hint: "九降風乾燥涼爽，搭配充足日光曝曬，才能做出香甜的客家柿餅！"
  },
  {
    id: "chi_39",
    subject: "國語",
    unit: "第一課 新學年新希望",
    question: "「新學年新希望」這篇課文是什麼文體？",
    phonetic: "ㄨㄣˊ ㄊㄧˇ ㄅㄧㄢˋ ㄒㄧ",
    options: [
      { text: "記敘文（散文詩結構）", isCorrect: true, hitResult: "紮實擊中球心！二壘安打！" },
      { text: "說明文", isCorrect: false, hitResult: "界外高飛接殺！" },
      { text: "書信", isCorrect: false, hitResult: "內野滾地！" }
    ],
    hint: "這課以優美的散文詩形式，抒發對新學年的自我期許。"
  },
  {
    id: "chi_40",
    subject: "國語",
    unit: "第二課 一起做早餐",
    question: "課文中全家人一起動手做早餐，最能體會到什麼感覺？",
    phonetic: "ㄑㄧㄥˊ ㄍㄢˇ ㄊㄧˇ ㄧㄢˋ",
    options: [
      { text: "家庭分工合作的溫馨與動手樂趣", isCorrect: true, hitResult: "陽春砲直射看台！" },
      { text: "肚子很餓很生氣", isCorrect: false, hitResult: "揮空好球！" },
      { text: "做早餐非常無聊想睡覺", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "全家人分工合力做出造型早餐，充滿溫暖、生活美感與成就感！"
  },
  {
    id: "chi_41",
    subject: "國語",
    unit: "第四課 運動會",
    question: "課文中操場上飄著五彩旗幟，到處人聲鼎沸，可以用什麼成語形容？",
    phonetic: "ㄔㄥˊ ㄩˇ ㄩㄣˋ ㄩㄥˋ",
    options: [
      { text: "熱鬧非凡", isCorrect: true, hitResult: "轟出滿貫砲！" },
      { text: "冷冷清清", isCorrect: false, hitResult: "擊成軟弱滾地！" },
      { text: "心平氣和", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "熱鬧非凡形容場面極為熱鬧、氣氛活潑沸騰！"
  },
  {
    id: "chi_42",
    subject: "國語",
    unit: "第六課 小鎮的柿餅節",
    question: "成熟曬乾後的柿餅吃起來口感如何？",
    phonetic: "ㄎㄡˇ ㄍㄢˇ ㄇㄧㄠˊ ㄒㄧㄝˇ",
    options: [
      { text: "又香又甜、Ｑ彈爽口", isCorrect: true, hitResult: "超大號全壘打！" },
      { text: "又酸又辣", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "又苦又澀", isCorrect: false, hitResult: "擦棒出局！" }
    ],
    hint: "柿餅經過日光日曬與乾燥風吹拂，水分收乾，風味又香又甜！"
  },

  // --- 短語仿寫、詞性與量詞搭配 (43~50) ---
  {
    id: "chi_43",
    subject: "國語",
    unit: "短語仿寫",
    question: "仿寫練習：「（微風）（輕輕）的（吹）」，哪一個結構完全相同？",
    phonetic: "ㄇㄧㄥˊ ㄘˊ + ㄉㄧㄝˊ ㄗˋ + ㄉㄨㄥˋ ㄘˊ",
    options: [
      { text: "（小雨）（慢慢）的（落）", isCorrect: true, hitResult: "轟出右外野！全壘打！" },
      { text: "（蘋果）（紅紅）的（臉）", isCorrect: false, hitResult: "揮棒落空！最後一個詞「臉」是名詞。" },
      { text: "（大樹）（高大）的（站）", isCorrect: false, hitResult: "滾地球刺殺！「高大」不是疊字。" }
    ],
    hint: "結構必須是：名詞 ＋ 疊字副詞 ＋ 動詞，「落」是動詞！"
  },
  {
    id: "chi_44",
    subject: "國語",
    unit: "短語仿寫",
    question: "仿寫練習：「（高興）得（跳起來）」，哪一個配對最通順恰當？",
    phonetic: "ㄑㄧㄥˊ ㄊㄞˋ ㄅㄨˇ ㄩˇ",
    options: [
      { text: "（累）得（坐下來）", isCorrect: true, hitResult: "深遠安打！攻下致勝分！" },
      { text: "（熱）得（穿外套）", isCorrect: false, hitResult: "揮棒過早落空！語意不合邏輯。" },
      { text: "（快）得（跑不動）", isCorrect: false, hitResult: "界外球接殺！" }
    ],
    hint: "「形容詞 ＋ 得 ＋ 動作反應」，累得坐下來完全符合生活邏輯！"
  },
  {
    id: "chi_45",
    subject: "國語",
    unit: "量詞搭配",
    question: "選出正確的量詞：「秋天吹起了一[  ]涼風，樹上掉下了一[  ]柿子。」",
    phonetic: "ㄌㄧㄤˋ ㄘˊ ㄌㄧㄢˊ ㄒㄧˊ",
    options: [
      { text: "陣、顆", isCorrect: true, hitResult: "大號全壘打直擊看台！" },
      { text: "個、朵", isCorrect: false, hitResult: "擦棒被捕！" },
      { text: "條、張", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "風的量詞是一「陣」風；圓形果實是一「顆」柿子。"
  },
  {
    id: "chi_46",
    subject: "國語",
    unit: "量詞搭配",
    question: "選出正確的量詞：「一[  ]小巷、一[  ]竹籃船」。",
    phonetic: "ㄌㄧㄤˋ ㄘˊ ㄆㄟˋ ㄉㄨㄟˋ",
    options: [
      { text: "條、艘", isCorrect: true, hitResult: "陽春全壘打！" },
      { text: "張、隻", isCorrect: false, hitResult: "內野刺殺！" },
      { text: "座、架", isCorrect: false, hitResult: "揮棒太慢！" }
    ],
    hint: "細長巷弄用一「條」小巷；船隻用一「艘」竹籃船！"
  },
  {
    id: "chi_47",
    subject: "國語",
    unit: "詞語理解",
    question: "「大家分工合作」的「分工」是什麼意思？",
    phonetic: "ㄈㄣ ㄍㄨㄥ ㄏㄜˊ ㄗㄨㄛˋ",
    options: [
      { text: "每個人分擔不同的工作任務", isCorrect: true, hitResult: "平飛安打一壘有人！" },
      { text: "把工廠拆開來", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "大家都不做工只休息", isCorrect: false, hitResult: "好球三振！" }
    ],
    hint: "分工指大家依照專長分配不同的工作任務，一起合力完成！"
  },
  {
    id: "chi_48",
    subject: "國語",
    unit: "句子重組",
    question: "「①迎著微風 ②走在小巷 ③小貓」這三組詞重組成通順句子應是？",
    phonetic: "ㄐㄩˋ ˙ㄗ ㄓㄨㄥˋ ㄗㄨˇ",
    options: [
      { text: "③①②（小貓迎著微風走在小巷）", isCorrect: true, hitResult: "再添一支全壘打！" },
      { text: "①②③（迎著微風走在小巷小貓）", isCorrect: false, hitResult: "擊球落空！" },
      { text: "②③①（走在小巷小貓迎著微風）", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "主角（主詞小貓）＋ 動作情態（迎著微風）＋ 地點動作（走在小巷）。"
  },
  {
    id: "chi_49",
    subject: "國語",
    unit: "反義詞辨析",
    question: "「熱鬧」的相反詞是什麼？",
    phonetic: "ㄈㄢˇ ㄧˋ ㄘˊ",
    options: [
      { text: "安靜", isCorrect: true, hitResult: "三壘安打！跑者安全上壘！" },
      { text: "溫暖", isCorrect: false, hitResult: "揮棒過早！" },
      { text: "快樂", isCorrect: false, hitResult: "擦棒接殺！" }
    ],
    hint: "人聲鼎沸、活動很多是熱鬧，沒有聲音是安靜！"
  },
  {
    id: "chi_50",
    subject: "國語",
    unit: "統整活動一",
    question: "書寫橫式句子時，遇到說話內容「媽媽說：『早安！』」，上引號『 要放在？",
    phonetic: "ㄅㄧㄠ ㄉㄧㄢˇ ㄈㄨˊ ㄏㄠˋ",
    options: [
      { text: "字的左上方", isCorrect: true, hitResult: "再見滿貫砲！全場歡聲雷動！" },
      { text: "字的正中央", isCorrect: false, hitResult: "揮空三振！" },
      { text: "字的右下方", isCorrect: false, hitResult: "內野滾地！" }
    ],
    hint: "橫式書寫時，單引號的上引號『 置於說話內容第一個字的左上方！"
  }
];
