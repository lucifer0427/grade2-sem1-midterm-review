# AGENTS.md

本文件規範 AI Agent 在本專案（`grade2-sem1-midterm-review`）中的角色定位、任務範疇、教材產出標準與開發協作準則。

---

## 1. 專案核心目標

- **專案名稱**：國小二年級上學期期中考複習（108 課綱 3D 實況棒球遊戲 ＆ 結構化紙本題庫）
- **核心目的**：結合「3D 互動棒球遊戲（含蘇格拉底引導教學）」與「結構化、易於複習與列印的期中考複習講義、練習單與模擬考卷」。
- **目標受眾**：國小二年級學童（7～8 歲）、陪讀家長與指導教師。

---

## 2. 涵蓋學科與教學標準（108 課綱 二上）

| 學科 | 教科書版本 | 期中考主要範疇 | 產出標準與注意事項 |
| :--- | :--- | :--- | :--- |
| **國語** | **康軒版** | 第 1 ~ 6 課、統整活動一與二（新學年新希望、一起做早餐、走過小巷、運動會、坐竹籃船、小鎮的柿餅節） | 生字需考慮注音排版；多音字辨析（得、假、教、空、轉、著、背）須遮罩目標讀音防洩題；短語仿寫符合小二理解程度；句子結構清晰。 |
| **數學** | **翰林版** | 第 1 ~ 5 單元（200以內的數、二位數的加減法、公分、加減應用兩步驟、直線與角/平面圖形） | 直式計算對齊與進退位符號；殘尺與非零起點測量陷阱（`終點 - 起點`）；兩步驟不併式分步計算；正方形與長方形幾何特徵。 |
| **生活** | 跨版本 | 季節變化（秋天觀察）、光與影子、社區生活、校園安全與日常自理 | 著重觀察力、情境判斷與生活應用，圖文對照更佳。 |

---

## 3. Agent 產出教材與內容規範

1. **文字與語言風格**：
   - 一律使用**繁體中文（台灣教育部標準用字與審定讀音）**。
   - 題目說明與引導文字應親切、簡潔、無歧義，符合 7~8 歲兒童的認知程度。
2. **格式與排版**：
   - **紙本教材**：重點歸納 $\rightarrow$ 觀念自我檢測 $\rightarrow$ 實戰練習題 $\rightarrow$ 解析與答案卷（支援 `print-exam.html` A4 列印）。
   - **互動遊戲**：遵循三階段引導式教學（迷思診斷 $\rightarrow$ 蘇格拉底提問 $\rightarrow$ 遮罩式小錦囊），不可在第一次答錯時直接洩漏答案。
3. **題型設計原則**：
   - 題目難度梯次分明（基礎題 60%、進階題 30%、素養應用題 10%）。
   - 附帶解析需指出「常見錯誤陷阱」與「家長/教師引導技巧」。

---

## 4. 專案目錄結構慣例

```text
grade2-sem1-midterm-review/
├── README.md
├── AGENTS.md
├── DEVELOPMENT_PLAN.md
├── MINECRAFT_PLAN.md           # 麥塊體素版架構與獨立紀錄規劃文件
├── ROBLOX_PLAN.md              # Roblox 跑酷版架構與獨立紀錄規劃文件
├── IMPROVEMENT_PLAN.md         # 專案工程改善與健全化維護計畫
├── index.html                  # [棒球版] 3D 實況棒球複習遊戲主頁面 (g2_baseball_*)
├── minecraft.html              # [麥塊版] 3D 麥塊體素複習遊戲主頁面 (g2_mc_*)
├── roblox.html                 # [Roblox版] 3D Roblox 跑酷複習遊戲主頁面 (g2_roblox_*)
├── print-exam.html             # A4 紙本考卷動態組卷、列印器與弱點單元雷達分析儀
├── manifest.json               # PWA 應用程式清單設定
├── sw.js                       # PWA Service Worker 離線快取腳本
├── css/
│   ├── style.css               # 棒球版遊戲與互動元件樣式
│   ├── minecraft.css           # 麥塊版像素 UI 與合成台元件樣式
│   └── roblox.css              # Roblox 版霓虹跑酷 UI 與 Checkpoint 進度條
├── js/
│   ├── game.js                 # [棒球版] 遊戲主迴圈與狀態管理
│   ├── baseballField.js        # [棒球版] Three.js 3D 棒球場與人物特效
│   ├── specialModes.js         # [棒球版] 斷尺量測台、兩步驟盜壘連鎖、光影實驗室、九宮格與球員卡匯出
│   ├── audio.js                # [棒球版] Web Audio 合成音效與語音朗讀
│   ├── minecraftGame.js        # [麥塊版] 遊戲主迴圈與獨立狀態管理
│   ├── minecraftWorld.js       # [麥塊版] Three.js 3D Voxel 引擎與三維度 Boss
│   ├── minecraftSpecialModes.js# [麥塊版] 紅石活塞斷尺、礦車連鎖、麥塊日晷光影台、3x3 合成台與英雄卡匯出
│   ├── minecraftAudio.js       # [麥塊版] 麥塊合成音效與語音朗讀
│   ├── robloxGame.js           # [Roblox版] 遊戲主迴圈與獨立狀態管理 (g2_roblox_*)
│   ├── robloxWorld.js          # [Roblox版] Three.js 3D 螺旋跑酷塔、積木人與彩帶粒子
│   ├── robloxSpecialModes.js   # [Roblox版] 雷射斷尺、雙重跳床、探照燈暗影台與 Bloxy 英雄卡
│   ├── robloxAudio.js          # [Roblox版] 經典 OOF!、Coil 彈簧跳、Checkpoint 與語音合成
│   ├── gameplayUpgrades.js     # [共用] 5.0 爽感升級模組 (揮棒/挖礦/彈簧QTE、肉鴿天賦、飛天靶心、3D盲盒與建築)
│   ├── curriculum.js           # [共用] 150 題題庫匯總、18 種單元篩選與未讀優先抽題
│   ├── guidedTeaching.js       # [共用] 蘇格拉底三階段引導式教學模組
│   └── questions/
│       ├── chinese.js          # 康軒國語 50 題題庫
│       ├── math.js             # 翰林數學 50 題題庫
│       └── life.js             # 生活課程 50 題題庫
├── chinese/                    # 國語科紙本複習資料與題庫
│   ├── vocab.md                # 生字、多音字、形近字與部首
│   ├── grammar.md              # 短語仿寫、句型、造句與標點
│   └── mock-tests/             # 國語期中模擬考卷
├── math/                       # 數學科紙本複習資料與題庫
│   ├── concepts.md             # 第 1~5 單元核心概念彙整
│   ├── worksheets/             # 計算題、斷尺與兩步驟應用題練習單
│   └── mock-tests/             # 數學期中模擬考卷
├── life/                       # 生活科複習資料、單元問答與期中模擬考卷
├── 考試範圍/                   # 課綱命題研究報告
└── scripts/
    └── validate-questions.mjs  # 150 題題庫品質與防洩題自動化檢測腳本
```

---

## 5. Agent 協作與工作流程

1. **增修原則**：
   - 修改既有題目時不可破壞題號與答案對應關係。
   - 新增或修改 `js/questions/` 題庫後，必須執行 `node scripts/validate-questions.mjs` 確保 100% 通過驗證。
2. **Git 提交規範**：
   - `feat`: 新增科目章節、單元複習單、遊戲機制或題庫
   - `fix`: 勘誤題目、字詞注音或數學解答
   - `docs`: 更新專案說明、索引或排版文件
   - `refactor`: 重整題型結構或版面配置
3. **自檢清單（每次產出前必檢）**：
   - [ ] 題意是否符合小二學生認知（無超綱括號併式）？
   - [ ] 數學計算結果與文字描述是否 100% 正確？
   - [ ] 答案卷題號與解答是否完全吻合？
   - [ ] `node scripts/validate-questions.mjs` 是否全數通過？
