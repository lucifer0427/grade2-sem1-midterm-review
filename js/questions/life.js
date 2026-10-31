/**
 * 生活課程（108 課綱跨版本二上 期中考四大主題）- 完整 50 題期中評量題庫
 * 涵蓋：
 * - 第 1 單元：秋天的觀察與季節變化 (life_01 ~ life_13)
 * - 第 2 單元：光與影子的遊戲 (life_14 ~ life_28)
 * - 第 3 單元：認識社區與鄰里生活 (life_29 ~ life_40)
 * - 第 4 單元：校園安全與日常自理 (life_41 ~ life_50)
 */

export const LIFE_QUESTIONS = [
  // --- 第 1 單元：秋天的觀察與季節變化 (1~13) ---
  {
    id: "life_01",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "當季節從夏天慢慢進入[秋天]時，白天的氣溫與天氣會有什麼變化？",
    phonetic: "季節交替的氣溫感受",
    options: [
      { text: "早晚漸漸變涼爽，空氣比較乾燥", isCorrect: true, hitResult: "全壘打！觀察入微！" },
      { text: "變得比夏天更悶熱，每天下暴風雪", isCorrect: false, hitResult: "揮棒落空！秋天平地不會下暴風雪喔！" },
      { text: "整天都是零下結冰的寒冬", isCorrect: false, hitResult: "界外球！那是極地或嚴冬喔！" }
    ],
    hint: "秋天來到時，早晚吹起涼風，天氣漸漸變涼爽，空氣也變得比較乾燥！"
  },
  {
    id: "life_02",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "秋天到了，校園裡的[楓葉]和[落羽松]葉子顏色會怎麼變化？",
    phonetic: "秋天植物葉片的變色現象",
    options: [
      { text: "由綠色慢慢轉成黃色、橘色或紅色", isCorrect: true, hitResult: "深遠二壘安打！得分！" },
      { text: "變成亮晶晶的藍色與紫色", isCorrect: false, hitResult: "看錯球路！樹葉不會變成藍色喔！" },
      { text: "全部變成透明看不見", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "秋天氣溫變涼，楓葉和落羽松會由綠色慢慢轉成黃色、橘色或紅色，接著飄落下來！"
  },
  {
    id: "life_03",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "新竹小鎮在秋天會吹起乾燥強勁的「[九降風]」，居民常利用這種風來曬什麼？",
    phonetic: "結合地方風物與季節氣候",
    options: [
      { text: "香甜的柿餅與米粉", isCorrect: true, hitResult: "超大號全壘打！直飛外野！" },
      { text: "堆雪人與做冰磚", isCorrect: false, hitResult: "內野滾地出局！九降風是乾燥的風不是雪！" },
      { text: "接雨水來游泳", isCorrect: false, hitResult: "揮棒太慢！九降風非常乾燥喔！" }
    ],
    hint: "新竹秋天的九降風乾燥又強勁，搭配溫暖陽光，最適合拿來風乾曬製香甜的柿餅與米粉！"
  },
  {
    id: "life_04",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "下面哪一種水果是[秋天]最常見、剛成熟上市的當季水果？",
    phonetic: "認識秋天的應景果實",
    options: [
      { text: "柿子與文旦（柚子）", isCorrect: true, hitResult: "平飛安打攻佔得點圈！" },
      { text: "夏天盛產的大西瓜與芒果", isCorrect: false, hitResult: "擦棒被捕！西瓜和芒果主要是夏天的水果喔！" },
      { text: "塑膠做的假水果", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "中秋節與秋天前後，正是柿子與文旦（柚子）成熟採收的季節！"
  },
  {
    id: "life_05",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "去校園進行[秋天大樹觀察]時，哪一種做法才是愛護自然的表現？",
    phonetic: "正確的戶外自然觀察禮儀",
    options: [
      { text: "撿地上掉下來的落葉做紀錄，不攀折樹枝", isCorrect: true, hitResult: "滿貫全壘打！愛護自然小尖兵！" },
      { text: "用力搖晃大樹，把綠葉全部扯下來", isCorrect: false, hitResult: "游擊滾地雙殺！這樣會傷害樹木喔！" },
      { text: "用美工刀在樹幹上刻自己的名字", isCorrect: false, hitResult: "三振出局！樹皮受傷會害大樹生病！" }
    ],
    hint: "愛護植物要做到「不動手攀折花木、不刻畫樹皮」，只撿地上掉落的枯葉與果實來觀察！"
  },
  {
    id: "life_06",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "想把大樹粗糙的[樹皮紋路]記錄在白紙上，可以用什麼美勞方法？",
    phonetic: "生活美勞：紋路拓印法",
    options: [
      { text: "把紙貼在樹幹上，用蠟筆或鉛筆輕輕拓印", isCorrect: true, hitResult: "強勁安打送回兩分！" },
      { text: "把樹皮整塊剝下來貼在簿子上", isCorrect: false, hitResult: "揮棒落空！剝樹皮會讓大樹枯死喔！" },
      { text: "往樹幹潑油漆", isCorrect: false, hitResult: "界外飛球出局！" }
    ],
    hint: "把白紙貼在樹幹表面，拿粉蠟筆平放輕輕塗抹，就能完成漂亮的「樹皮拓印」！"
  },
  {
    id: "life_07",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "台灣的街道與校園裡，[台灣欒樹]在秋天會先開滿什麼顏色的花？",
    phonetic: "認識校園常見行道樹",
    options: [
      { text: "金黃色的小花，接著結出紅褐色果實", isCorrect: true, hitResult: "陽春全壘打！觀察力滿分！" },
      { text: "黑色的花朵", isCorrect: false, hitResult: "揮棒太慢！" },
      { text: "不會開花只會長香菇", isCorrect: false, hitResult: "好球揮空！" }
    ],
    hint: "台灣欒樹又叫四色樹，秋天時樹梢會先開滿金黃色的小花，接著結出紅褐色的燈籠果實！"
  },
  {
    id: "life_08",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "收集來的[乾枯落葉]可以怎麼運用在生活美勞課？",
    phonetic: "自然媒材創作應用",
    options: [
      { text: "拼貼成可愛的落葉小動物畫作或做書籤", isCorrect: true, hitResult: "掃過外野草皮的二壘安打！" },
      { text: "拿去教室角落放火燒掉", isCorrect: false, hitResult: "危險動作三振出局！在教室生火非常危險！" },
      { text: "塞進排水孔裡堵住水管", isCorrect: false, hitResult: "內野滾地封殺！" }
    ],
    hint: "不同形狀和顏色的落葉，可以加上創意拼貼成落葉獅子、小魚畫作或護貝做成書籤！"
  },
  {
    id: "life_09",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "在草叢或樹下觀察[秋天的小昆蟲]時，怎麼做最安全又有禮貌？",
    phonetic: "戶外觀察安全規範",
    options: [
      { text: "保持安靜用放大鏡遠遠觀察，不隨便徒手抓", isCorrect: true, hitResult: "全壘打！安全第一！" },
      { text: "直接用手去抓毛毛蟲和蜜蜂", isCorrect: false, hitResult: "揮棒落空！可能會被螫傷或引起皮膚紅腫喔！" },
      { text: "拿石頭丟昆蟲的巢穴", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "觀察昆蟲時要保持安靜，不驚擾、不徒手觸碰毒蛾或蜜蜂，觀察完讓牠們留在原本的家！"
  },
  {
    id: "life_10",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "秋天早晚比較涼，中午卻可能還有點熱，上學怎麼[穿搭衣服]最聰明？",
    phonetic: "配合季節變化的生活自理",
    options: [
      { text: "穿短袖或薄長袖，外加一件好穿脫的薄外套", isCorrect: true, hitResult: "清壘三壘安打！" },
      { text: "穿三件厚羽絨大衣而且絕對不脫下來", isCorrect: false, hitResult: "中午會熱到中暑流大汗喔！" },
      { text: "只穿泳衣去上學", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "洋蔥式穿法最聰明：裡面穿吸汗的衣服，外面加一件方便穿脫的薄外套，冷了穿、熱了脫！"
  },
  {
    id: "life_11",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "在秋天慶祝的傳統節日「[中秋節]」，家家戶戶常做什麼應景活動？",
    phonetic: "秋天節慶與家庭文化",
    options: [
      { text: "全家人團聚賞月、吃月餅與文旦", isCorrect: true, hitResult: "轟出中外野全壘打！" },
      { text: "划龍舟、吃粽子、立雞蛋", isCorrect: false, hitResult: "這是夏天端午節的活動喔！" },
      { text: "貼春聯、領壓歲錢放鞭炮", isCorrect: false, hitResult: "這是農曆春節過年的活動喔！" }
    ],
    hint: "農曆八月十五日中秋節在秋天，月圓人團圓，大家會一起賞月、吃月餅和文旦！"
  },
  {
    id: "life_12",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "用五官觀察秋天的花園時，哪一個配對是[正確的感官運用]？",
    phonetic: "五官感覺：眼、耳、鼻、手",
    options: [
      { text: "用鼻子聞桂花香、用耳朵聽風吹落葉沙沙聲", isCorrect: true, hitResult: "平飛安打上壘！" },
      { text: "把路邊不認識的野果摘下來放進嘴巴吃", isCorrect: false, hitResult: "危險出局！路邊野果可能有毒絕對不能亂吃！" },
      { text: "用眼睛直視刺眼的太陽", isCorrect: false, hitResult: "會傷害眼睛視力喔！" }
    ],
    hint: "善用感官：用眼睛看色彩、用耳朵聽蟲鳴風聲、用鼻子聞桂花香，但未知的野果絕不放進口中！"
  },
  {
    id: "life_13",
    subject: "生活",
    unit: "第 1 單元 秋天的觀察",
    question: "秋天的傍晚跟夏天比起來，[天黑的時間]有什麼改變？",
    phonetic: "晝夜長短的季節變化",
    options: [
      { text: "太陽比較早下山，天黑得比夏天早", isCorrect: true, hitResult: "精準擊中球心！全壘打！" },
      { text: "晚上十點太陽還高掛在天空", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "整天二十四小時都不會天黑", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "進入秋冬季節後，白天變短、夜晚變長，所以傍晚天黑的時間會比夏天更早喔！"
  },

  // --- 第 2 單元：光與影子的遊戲 (14~28) ---
  {
    id: "life_14",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "想要在地上或牆上產生清楚的「[影子]」，必須同時具備哪三個條件？",
    phonetic: "影子形成的三要素",
    options: [
      { text: "光源（光）、不透明物體、承接影子的表面", isCorrect: true, hitResult: "滿貫全壘打！科學觀念一百分！" },
      { text: "只要有水、空氣和泥土就會有影子", isCorrect: false, hitResult: "沒有光就看不見影子喔！" },
      { text: "在全黑沒有任何燈光的房間裡閉上眼睛", isCorrect: false, hitResult: "全黑的地方沒有光，無法形成影子！" }
    ],
    hint: "影子三要素：一定要有「光（光源）」照在「不透明物體」上，把光擋住並在「地面或牆面」形成暗區！"
  },
  {
    id: "life_15",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "當太陽在你的[東邊（左邊）]發光照射時，你的影子會出現在哪個方向？",
    phonetic: "光源方向 vs. 影子方向",
    options: [
      { text: "相反的西邊（右邊）", isCorrect: true, hitResult: "超大號全壘打！掌握光影反方向祕訣！" },
      { text: "同一邊的東邊（左邊）", isCorrect: false, hitResult: "掉入陷阱！影子不會向著太陽喔！" },
      { text: "飛到天空中間", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "光走直線被身體擋住，所以影子永遠出現在光源的「相反方向」！太陽在東邊，影子就在西邊！"
  },
  {
    id: "life_16",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "用手電筒從玩偶的[正前方]照射，玩偶的影子會投射在哪裡？",
    phonetic: "手電筒光影實驗",
    options: [
      { text: "玩偶的正後方", isCorrect: true, hitResult: "強勁二壘安打！" },
      { text: "玩偶的正前方（手電筒鏡面上）", isCorrect: false, hitResult: "揮棒太慢！影子會在光的相反方向！" },
      { text: "玩偶裡面", isCorrect: false, hitResult: "界外球！" }
    ],
    hint: "影子永遠在光源的相反方向：光從正前方照過來，影子就會出現在玩偶的「正後方」！"
  },
  {
    id: "life_17",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "在晴朗的一天中，什麼時候站在操場上，我們身體的[影子會最短]？",
    phonetic: "太陽高度角與影長變化",
    options: [
      { text: "中午 12 點（太陽在頭頂正上方最高處）", isCorrect: true, hitResult: "轟破計分板！全壘打！" },
      { text: "早上剛升旗時（太陽斜斜照過來）", isCorrect: false, hitResult: "早上太陽位置低，影子會拖得很長喔！" },
      { text: "傍晚太陽快下山時", isCorrect: false, hitResult: "傍晚夕陽斜射，影子也是長長的喔！" }
    ],
    hint: "太陽位置越高，影子越短！中午 12 點太陽幾乎在頭頂正上方，所以影子最短！"
  },
  {
    id: "life_18",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "[清晨]或[傍晚]時，太陽的位置比較低（斜射），這時候地上的影子會怎樣？",
    phonetic: "早晚斜射的影子特徵",
    options: [
      { text: "影子會變得長長的", isCorrect: true, hitResult: "穿越安打！送回跑者！" },
      { text: "影子縮成小小一個點在腳底", isCorrect: false, hitResult: "那是中午太陽在頭頂時的影子喔！" },
      { text: "影子會變成彩色的", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "太陽位置越低（清晨剛日出或傍晚快日落），光線斜斜照過來，地上的影子就會被拉得「長長的」！"
  },
  {
    id: "life_19",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "玩手影遊戲時，手電筒不動，把[手越靠近手電筒]（光源），牆上的手影會怎麼變？",
    phonetic: "物體與光源距離 vs. 影子大小",
    options: [
      { text: "牆上的影子會變得越大", isCorrect: true, hitResult: "滿貫全壘打！光影魔術師！" },
      { text: "牆上的影子會縮得越小", isCorrect: false, hitResult: "相反囉！離手電筒越遠，影子才會變小！" },
      { text: "影子大小完全不會改變", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "物體離手電筒（光源）越近，擋住的光線範圍越多，投射在牆上的影子就會變得「越大」！"
  },
  {
    id: "life_20",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "用手電筒照射下面哪一種物品，光線會直接穿過去，最[不容易產生深色黑影]？",
    phonetic: "透明與不透明材質的透光實驗",
    options: [
      { text: "完全透明的乾淨玻璃片", isCorrect: true, hitResult: "紮實安打上二壘！" },
      { text: "厚厚的國語課本", isCorrect: false, hitResult: "課本不透光，會產生清楚的黑影喔！" },
      { text: "木頭做的鉛筆盒", isCorrect: false, hitResult: "木頭不透光，會擋住光線產生黑影！" }
    ],
    hint: "透明玻璃會讓大部分光線直接穿過去，擋不住光，因此最不容易產生深色黑影！"
  },
  {
    id: "life_21",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "操場上玩「[踩影子遊戲]」時，想讓自己的影子瞬間消失不被踩到，可以躲去哪裡？",
    phonetic: "生活情境：大樹陰影的應用",
    options: [
      { text: "躲進大樹下或走廊的陰影裡", isCorrect: true, hitResult: "全壘打！聰明的實戰技巧！" },
      { text: "跑到操場正中央太陽最亮的地方", isCorrect: false, hitResult: "陽光下影子超清楚，馬上就被踩到囉！" },
      { text: "原地跳起來大叫", isCorrect: false, hitResult: "跳起來在地上還是有影子喔！" }
    ],
    hint: "大樹或屋簷已經把太陽光擋住形成一大片陰影，躲進大樹陰影裡，自己的小影子就會融進去看不見了！"
  },
  {
    id: "life_22",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "如果把一個圓柱形的[保特瓶]直立放著，從側面照光和從正上方照光，影子形狀一樣嗎？",
    phonetic: "不同角度照射同一個物體",
    options: [
      { text: "不一樣，側面照像長方形，正上方照像圓形", isCorrect: true, hitResult: "深遠長打！立體空間感超棒！" },
      { text: "不管從哪個角度照，影子永遠是三角形", isCorrect: false, hitResult: "揮棒落空！" },
      { text: "不管怎麼照形狀都一模一樣", isCorrect: false, hitResult: "照射角度不同，擋光輪廓也會不同喔！" }
    ],
    hint: "同一個物體從不同方向照光，擋住光的輪廓不同：保特瓶從側面照是長方形，從正上方往下照則是圓形！"
  },
  {
    id: "life_23",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "傳統戲曲中的「[皮影戲]」，是利用什麼科學原理讓觀眾看到戲偶演戲的？",
    phonetic: "光與影的傳統文化藝術",
    options: [
      { text: "在白色布幕後面點燈，照射半透明皮偶產生彩影", isCorrect: true, hitResult: "陽春全壘打！" },
      { text: "把戲偶丟進水池裡游泳", isCorrect: false, hitResult: "三振出局！" },
      { text: "完全不開燈在黑暗中聽聲音", isCorrect: false, hitResult: "不開燈就看不到皮偶的影子囉！" }
    ],
    hint: "皮影戲是在白色布幕後方打光，操偶師傅揮動雕刻上色的皮偶，將影子投射在布幕上演出故事！"
  },
  {
    id: "life_24",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "早上升旗時，太陽從[東邊]升起，操場上升旗桿的影子會指向哪一邊？",
    phonetic: "早晨太陽方位與影向推論",
    options: [
      { text: "指向西邊，而且影子長長的", isCorrect: true, hitResult: "轟出右外野大牆！全壘打！" },
      { text: "指向東邊，而且沒有長度", isCorrect: false, hitResult: "掉入陷阱！影子永遠背對太陽指向西邊！" },
      { text: "指向天空上面", isCorrect: false, hitResult: "揮空！" }
    ],
    hint: "早上太陽在東邊且位置較低，所以升旗桿的影子會指向相反的「西邊」，而且影子長長的！"
  },
  {
    id: "life_25",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "傍晚放學時，太陽在[西邊]準備下山，這時你的影子會朝向哪一邊？",
    phonetic: "傍晚太陽方位與影向推論",
    options: [
      { text: "朝向相反的東邊", isCorrect: true, hitResult: "平飛安打攻下一分！" },
      { text: "朝向西邊追著太陽跑", isCorrect: false, hitResult: "影子不會朝向太陽那一邊喔！" },
      { text: "完全消失不見", isCorrect: false, hitResult: "只要太陽還沒下山有光就有影子喔！" }
    ],
    hint: "傍晚太陽在西邊，光源在西，影子就會朝向相反的「東邊」！"
  },
  {
    id: "life_26",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "下面哪一個物品屬於可以自己發光的「[光源]」？",
    phonetic: "分辨光源與不發光物體",
    options: [
      { text: "天上的太陽與點亮的手電筒", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "木頭課桌椅與橡皮擦", isCorrect: false, hitResult: "桌椅跟橡皮擦自己不會發光喔！" },
      { text: "地上的黑色影子", isCorrect: false, hitResult: "影子是光被擋住的暗區，不是光源！" }
    ],
    hint: "能夠自己發出光線照亮周圍的物體稱為「光源」，例如太陽、點亮的燈泡、手電筒與燭火！"
  },
  {
    id: "life_27",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "如果在厚紙板上剪一個[星星形狀的洞]，拿手電筒照過去，牆上會出現什麼？",
    phonetic: "光走直線的紙卡鏤空實驗",
    options: [
      { text: "紙板黑影中間有一個亮亮的星星光斑", isCorrect: true, hitResult: "滿貫砲！實驗推理王！" },
      { text: "整面牆都變成全黑沒有光", isCorrect: false, hitResult: "光會從星星洞口穿過去喔！" },
      { text: "牆上出現一隻會跑的小狗", isCorrect: false, hitResult: "揮空三振！" }
    ],
    hint: "厚紙板擋住光形成黑影，但中間挖空的星星洞口能讓光直線穿過，所以在黑影中會出現亮亮的星星形狀！"
  },
  {
    id: "life_28",
    subject: "生活",
    unit: "第 2 單元 光與影子",
    question: "關於我們身體影子的形狀與動作，下面哪一個說法是正確的？",
    phonetic: "影子與本體的同步關係",
    options: [
      { text: "我們舉右手跳躍，影子也會立刻跟著舉手跳躍", isCorrect: true, hitResult: "乾淨俐落的中外野安打！" },
      { text: "我們停下來不動時，影子會自己跑去玩溜滑梯", isCorrect: false, hitResult: "影子不會自己離開身體亂跑喔！" },
      { text: "影子上面可以看清楚我們衣服上的彩色圖案", isCorrect: false, hitResult: "影子是光被擋住的暗區，看不出衣服的花色！" }
    ],
    hint: "影子是身體擋住光線形成的暗影輪廓，只看得出外型並與我們的動作同步，看不出衣服五官的彩色細節！"
  },

  // --- 第 3 單元：認識社區與鄰里生活 (29~40) ---
  {
    id: "life_29",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "阿明寫了一封卡片想寄給住在遠方的外公，應該去社區的哪個機構？",
    phonetic: "認識社區公共服務機構",
    options: [
      { text: "郵局（請郵差幫忙投遞信件與包裹）", isCorrect: true, hitResult: "全壘打！生活常識滿分！" },
      { text: "消防隊", isCorrect: false, hitResult: "消防隊負責救火與緊急救護喔！" },
      { text: "麵包店", isCorrect: false, hitResult: "麵包店是賣餐點的地方喔！" }
    ],
    hint: "郵局提供寄信、寄包裹與儲蓄服務，綠衣郵差叔叔阿姨會幫我們把信送到收件人手中！"
  },
  {
    id: "life_30",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "社區裡如果發生火災或有人受困需要緊急救援，誰會開著紅色救災車出動？",
    phonetic: "認識社區守護英雄",
    options: [
      { text: "消防隊的消防員（撥打 119）", isCorrect: true, hitResult: "強勁安打得分！" },
      { text: "圖書館的管理員", isCorrect: false, hitResult: "圖書館負責借閱圖書喔！" },
      { text: "水果行的老闆", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "發生火災或緊急傷病救護時，要撥打 119，消防隊的消防員會立刻出動救火與救護！"
  },
  {
    id: "life_31",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "在社區巡邏維護治安、抓小偷、指揮交通並幫助迷路孩童的是哪一個單位？",
    phonetic: "人民保母與治安維護",
    options: [
      { text: "警察局／派出所的警察（撥打 110）", isCorrect: true, hitResult: "超前兩分全壘打！" },
      { text: "郵局的櫃台人員", isCorrect: false, hitResult: "郵局負責郵政與儲蓄喔！" },
      { text: "玩具店的店員", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "警察局（派出所）的警察叔叔阿姨負責維護社區安全與交通秩序，遇到壞人或危險可撥打 110！"
  },
  {
    id: "life_32",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "清晨或夜晚走過安靜的[社區小巷]時，我們應該怎麼做最有公德心？",
    phonetic: "配合國語第三課〈走過小巷〉",
    options: [
      { text: "放輕腳步、輕聲細語，不吵到鄰居休息", isCorrect: true, hitResult: "滿貫全壘打！好鄰居模範生！" },
      { text: "邊走邊拿哨子用力吹並大吼大叫", isCorrect: false, hitResult: "這樣會吵醒還在休息的鄰居喔！" },
      { text: "隨手按別人家門口的電鈴就跑", isCorrect: false, hitResult: "惡作劇是非常沒禮貌的行為！" }
    ],
    hint: "在社區小巷行走時，保持安靜、輕聲說話，尊重鄰居的安寧，才是受歡迎的好鄰居！"
  },
  {
    id: "life_33",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "帶家裡的小狗去[社區公園]散步時，主人一定要做到哪件事？",
    phonetic: "公共空間環境整潔維護",
    options: [
      { text: "幫狗狗繫好牽繩，並隨手清理狗狗的大小便", isCorrect: true, hitResult: "二壘安打！愛護社區環境！" },
      { text: "讓狗狗大便留在溜滑梯旁邊不管它", isCorrect: false, hitResult: "會害其他小朋友踩到並污染公園環境！" },
      { text: "把狗狗放開去追咬路人", isCorrect: false, hitResult: "不繫牽繩非常危險！" }
    ],
    hint: "溜狗時繫好牽繩保護大家安全，並準備撿便袋隨手清乾淨寵物糞便，共同維持社區公園整潔！"
  },
  {
    id: "life_34",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "想借故事書來看，又想在安靜舒適的環境閱讀，可以去社區的哪裡？",
    phonetic: "社區藝文與學習場所",
    options: [
      { text: "社區圖書館", isCorrect: true, hitResult: "平飛安打上壘！" },
      { text: "吵雜的魚市場", isCorrect: false, hitResult: "魚市場是買魚蝦的地方喔！" },
      { text: "馬路正中央", isCorrect: false, hitResult: "馬路中央非常危險！" }
    ],
    hint: "社區圖書館有豐富的繪本與故事書供居民免費借閱，在館內要保持安靜並愛惜書本！"
  },
  {
    id: "life_35",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "在社區電梯或巷口遇到隔壁的爺爺奶奶時，怎麼做最有禮貌？",
    phonetic: "敦親睦鄰與禮貌問候",
    options: [
      { text: "面帶微笑主動問好：「爺爺早！奶奶好！」", isCorrect: true, hitResult: "陽春全壘打！禮貌小天使！" },
      { text: "故意把電梯門關起來不讓他們進來", isCorrect: false, hitResult: "揮棒落空！要互相體諒幫忙喔！" },
      { text: "對長輩扮鬼臉吐舌頭", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "鄰居之間親切問候、互相幫忙，能讓整個社區像大家庭一樣溫暖友善！"
  },
  {
    id: "life_36",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "當聽到窗外傳來「給愛麗絲」或「少女的祈禱」音樂，清潔隊垃圾車開過來時，要怎麼做？",
    phonetic: "社區垃圾分類與資源回收",
    options: [
      { text: "做好一般垃圾、資源回收與廚餘分類再丟入對應車廂", isCorrect: true, hitResult: "轟出中外野全壘打！" },
      { text: "把玻璃瓶、電池和廚餘全部混在同一袋亂丟", isCorrect: false, hitResult: "未分類會造成危險並污染環境喔！" },
      { text: "直接把垃圾從樓上窗戶往下丟", isCorrect: false, hitResult: "高空丟物極度危險且違法！" }
    ],
    hint: "愛護社區與地球，倒垃圾時要確實將「一般垃圾、資源回收、廚餘」分開整理並交給清潔隊！"
  },
  {
    id: "life_37",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "去社區的[傳統菜市場]或[超市]買早餐食材時，自備什麼最環保？",
    phonetic: "減塑環保好習慣",
    options: [
      { text: "自己帶環保購物袋，減少使用一次性塑膠袋", isCorrect: true, hitResult: "長打直擊全壘打牆！" },
      { text: "每一根青菜都跟老闆多要五個塑膠袋", isCorrect: false, hitResult: "這樣會製造太多塑膠垃圾喔！" },
      { text: "把商品拆開來丟在地上", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "出門購物自備環保袋，能減少塑膠袋垃圾，是保護社區環境的環保小行動！"
  },
  {
    id: "life_38",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "如果在社區公園看到遊樂設施（如鞦韆鐵鍊）生鏽斷裂了，應該怎麼做？",
    phonetic: "社區安全危機處理",
    options: [
      { text: "不要靠近玩耍，並請大人通報里長或管理單位維修", isCorrect: true, hitResult: "滿貫全壘打！安全意識一級棒！" },
      { text: "不管它壞掉，硬爬上去搖晃", isCorrect: false, hitResult: "損壞的遊具非常容易造成跌落受傷！" },
      { text: "推同學去坐壞掉的鞦韆", isCorrect: false, hitResult: "危險行為出局！" }
    ],
    hint: "發現公園設施損壞時，第一步先遠離確保安全，再請家長或老師通知里長與公所派人修理！"
  },
  {
    id: "life_39",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "生病發燒或需要打預防針時，我們會去社區裡的哪個場所找醫生與護理師？",
    phonetic: "認識社區醫療保健機構",
    options: [
      { text: "診所、醫院或衛生所", isCorrect: true, hitResult: "平飛安打送回超前分！" },
      { text: "五金行", isCorrect: false, hitResult: "五金行是買工具零件的地方喔！" },
      { text: "洗車場", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "社區裡的診所與衛生所有專業的醫師與護理師，守護居民的身體健康！"
  },
  {
    id: "life_40",
    subject: "生活",
    unit: "第 3 單元 認識社區生活",
    question: "在社區馬路過街時，怎樣做才能保護自己的交通安全？",
    phonetic: "行人交通安全守則",
    options: [
      { text: "走斑馬線（行人穿越道），遵守綠燈行、紅燈停並左右察看", isCorrect: true, hitResult: "炸裂全壘打！" },
      { text: "紅燈時閉著眼睛直接衝過馬路", isCorrect: false, hitResult: "闖紅燈非常危險！" },
      { text: "在馬路中間玩滑板和踢足球", isCorrect: false, hitResult: "馬路如虎口，絕不可在車道玩耍！" }
    ],
    hint: "過馬路一定要走斑馬線，看清行人號誌「綠燈行、紅燈停」，並轉頭確認左右沒有來車再通行！"
  },

  // --- 第 4 單元：校園安全與日常自理 (41~50) ---
  {
    id: "life_41",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "下課鐘響了，經過教室外的[走廊與樓梯轉角]時，應該怎麼走才安全？",
    phonetic: "校園走廊防撞安全",
    options: [
      { text: "靠右慢慢走、不奔跑推擠，轉角處減速查看", isCorrect: true, hitResult: "滿貫全壘打！校園安全王！" },
      { text: "和同學閉著眼睛在走廊全速賽跑衝刺", isCorrect: false, hitResult: "走廊奔跑在轉角最容易相撞受傷！" },
      { text: "從樓梯扶手上面滑下來", isCorrect: false, hitResult: "極度危險！容易摔落骨折！" }
    ],
    hint: "教室走廊與樓梯間視線有死角，一定要遵守「不奔跑、不推擠、靠右慢行」，轉角處減速慢行！"
  },
  {
    id: "life_42",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "升上二年級後，每天的[書包與學用品]應該在什麼時候、由誰整理最恰當？",
    phonetic: "建立良好日常自理習慣",
    options: [
      { text: "每天晚上睡前，自己對照功課表與聯絡簿整理好", isCorrect: true, hitResult: "超大號全壘打！獨立自主好榜樣！" },
      { text: "全部丟給媽媽整理，沒帶課本就怪媽媽", isCorrect: false, hitResult: "二年級要學會為自己的學習負責任喔！" },
      { text: "完全不整理，把整個學期的書跟玩具全塞進書包", isCorrect: false, hitResult: "書包太重會影響脊椎發育喔！" }
    ],
    hint: "每天晚上睡前，自己對照聯絡簿與隔天功課表整理書包、削好鉛筆，早上才不會手忙腳亂！"
  },
  {
    id: "life_43",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "在運動會或體育課進行激烈跑步、拔河之前，一定要先做什麼事才不會拉傷肌肉？",
    phonetic: "運動安全與身體保護",
    options: [
      { text: "跟著老師認真做暖身操（伸展活動關節）", isCorrect: true, hitResult: "強勁二壘安打！" },
      { text: "先吃三大碗冰棒再馬上狂奔", isCorrect: false, hitResult: "肚子會痛喔！" },
      { text: "完全不暖身直接用力拉扯", isCorrect: false, hitResult: "沒暖身非常容易扭傷腳踝或拉傷肌肉！" }
    ],
    hint: "運動前做好充分的「暖身運動」，讓肌肉與關節靈活起來，才能預防運動傷害！"
  },
  {
    id: "life_44",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "體育課跑完步[滿頭大汗]時，怎樣照顧身體才不會著涼感冒？",
    phonetic: "運動後的健康自理",
    options: [
      { text: "先用毛巾把汗擦乾、喝溫開水補充水分", isCorrect: true, hitResult: "陽春全壘打！" },
      { text: "直接對著冷氣出風口猛吹冷風", isCorrect: false, hitResult: "滿身大汗吹冷風最容易著涼感冒囉！" },
      { text: "整天穿著濕答答的衣服不管它", isCorrect: false, hitResult: "揮棒落空！" }
    ],
    hint: "流汗後要先用乾毛巾把汗擦乾，換上乾爽衣物並小口補充溫開水，才不會吹風著涼！"
  },
  {
    id: "life_45",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "上課時如果想發表意見或回答老師的問題，應該怎麼做最守秩序？",
    phonetic: "教室學習常規與尊重他人",
    options: [
      { text: "先舉手，等老師請你發言時再站起來清楚回答", isCorrect: true, hitResult: "平飛安打得分！" },
      { text: "不管別人在講話，直接站在椅子上大喊答案", isCorrect: false, hitResult: "這樣會打斷別人且非常危險！" },
      { text: "生氣拍桌子", isCorrect: false, hitResult: "三振出局！" }
    ],
    hint: "遵守教室秩序：想發言先舉手，別人說話時專心傾聽不插嘴，才是互相尊重的表現！"
  },
  {
    id: "life_46",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "小組一起分工合作做生活美勞海報時，如果同學的意見跟你不一樣，怎麼做最好？",
    phonetic: "團隊合作與溝通禮儀",
    options: [
      { text: "溫和討論每個人的想法，互相配合找出好辦法", isCorrect: true, hitResult: "滿貫全壘打！最佳團隊精神！" },
      { text: "把海報撕破，哭著說不做了", isCorrect: false, hitResult: "揮棒落空！生氣撕海報無法解決問題喔！" },
      { text: "強迫所有人只能聽我一個人的話", isCorrect: false, hitResult: "團隊合作要尊重大家的意見！" }
    ],
    hint: "分工合作時難免有不同想法，先專心聽完同學的理由，再溫和溝通、投票或輪流負責，作品會更棒！"
  },
  {
    id: "life_47",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "在下雨天的校園裡，走廊地板濕滑，走路時要注意什麼？",
    phonetic: "雨天校園防滑安全",
    options: [
      { text: "把雨傘收好放進傘架不滴水，放慢腳步小心慢走", isCorrect: true, hitResult: "穿越安打上壘！" },
      { text: "在教室裡打開雨傘拿來當劍揮舞", isCorrect: false, hitResult: "傘尖非常容易刺傷同學的眼睛！" },
      { text: "故意在濕滑的水窪上溜冰奔跑", isCorrect: false, hitResult: "極容易滑倒摔傷後腦勺！" }
    ],
    hint: "雨天進走廊前先將雨傘收好放進傘桶，避免雨水滴滿地，走路放慢腳步防滑倒，且絕不拿雨傘嬉戲！"
  },
  {
    id: "life_48",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "每天早上上學前，吃一份[營養均衡的早餐]對我們有什麼幫助？",
    phonetic: "健康飲食與學習活力",
    options: [
      { text: "補充體力與能量，讓早上的課堂更有精神、更專心", isCorrect: true, hitResult: "轟出看台！活力全壘打！" },
      { text: "只吃五包糖果跟汽水當早餐最健康", isCorrect: false, hitResult: "太多糖分沒營養又容易蛀牙喔！" },
      { text: "每天都不吃早餐讓肚子咕嚕咕嚕叫", isCorrect: false, hitResult: "不吃早餐會沒力氣、上課頭昏眼花！" }
    ],
    hint: "營養均衡的早餐（如吐司、雞蛋、牛奶或豆漿蔬果）能提供大腦與身體能量，讓上課專心有活力！"
  },
  {
    id: "life_49",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "在學校吃營養午餐前，以及上完廁所後，一定要確實做好哪個衛生步驟？",
    phonetic: "個人衛生與疾病預防",
    options: [
      { text: "用肥皂按照「濕、搓、沖、捧、擦」洗淨雙手並擦乾", isCorrect: true, hitResult: "深遠二壘安打！健康小衛兵！" },
      { text: "把手在褲子上隨便抹兩下就好了", isCorrect: false, hitResult: "手上還是有很多細菌病毒喔！" },
      { text: "洗完手不擦乾，到處甩水噴同學", isCorrect: false, hitResult: "甩水會弄濕地板害人滑倒！" }
    ],
    hint: "飯前便後使用肥皂搓洗雙手至少 20 秒，並用手帕或擦手紙擦乾，才能趕走病菌不生病！"
  },
  {
    id: "life_50",
    subject: "生活",
    unit: "第 4 單元 校園安全與自理",
    question: "如果不小心在操場跌倒擦傷流血了，應該立刻去哪裡請誰幫忙處理傷口？",
    phonetic: "校園受傷應變流程",
    options: [
      { text: "告訴老師，並到「健康中心（保健室）」請護理師消毒包紮", isCorrect: true, hitResult: "再見滿貫全壘打！安全滿分！" },
      { text: "抓地上的泥土塗在流血的傷口上", isCorrect: false, hitResult: "泥土有大量細菌，會讓傷口發炎感染！" },
      { text: "忍痛不敢講，躲在廁所裡偷哭", isCorrect: false, hitResult: "受傷一定要立刻告訴師長處理喔！" }
    ],
    hint: "在校園受傷時不要慌張，立刻報告老師或請同學陪同前往「健康中心」，讓護理師清潔消毒傷口！"
  }
];
