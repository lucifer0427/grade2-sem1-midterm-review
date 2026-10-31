# 改善計畫（IMPROVEMENT_PLAN）

> 本文件依據 2026-10-31 的專案檢視結果撰寫，對應 `AGENTS.md` 的產出標準與自檢清單。
> 目的：在不改變現有教學內容與遊戲體驗的前提下，補齊「可驗證性、可維護性、可安裝性」三塊缺口。

---

## 1. 現況基準（Baseline）

| 檢查項目 | 目前結果 | 說明 |
| :--- | :--- | :--- |
| `node scripts/validate-questions.mjs` | ✅ 6/6 通過 | 題數、ID 唯一、單一正解、遮罩率 150/150、18 種篩選器、16 場 144 題不重複 |
| 數學算式正確性 | ✅ 37 條抽查全對 | **但這是本次臨時腳本所驗，未納入版控** |
| DOM 參照完整性 | ✅ 無空指標 | 所有 `getElementById` / `querySelector('#id')` 皆存在或由同模組動態建立 |
| 殘留除錯碼 | ✅ 無 | 無 `console.log` / `debugger` / TODO |
| Git 狀態 | ⚠️ 落後 1 個 commit | `main` 領先 `origin/main` 1 個 commit 未推送 |
| 文件與程式一致性 | ⚠️ 已漂移 | 版本號 3.0 / 4.0 / 5.0 並存；目錄樹漏列 `js/gameplayUpgrades.js` |

---

## 2. 改善項目總表

| 編號 | 優先 | 項目 | 主要檔案 | 預估 |
| :--- | :--- | :--- | :--- | :--- |
| P0-1 | 高 | CI 加入題庫驗證閘門 | `.github/workflows/deploy.yml` | 0.5 小時 |
| P0-2 | 高 | 補齊 PWA icons 與 scope | `manifest.json`、`index.html`、`minecraft.html` | 1 小時 |
| P1-1 | 中 | 統一版本號 | `README.md`、`index.html`、`js/game.js`、`js/minecraftGame.js` | 0.5 小時 |
| P1-2 | 中 | 補齊文件目錄樹 | `README.md`、`AGENTS.md` | 0.5 小時 |
| P1-3 | 中 | 題庫數值驗證自動化 | `scripts/validate-questions.mjs` | 3 小時 |
| P1-4 | 中 | 抽離可測試的純邏輯 | 新增 `js/gameLogic.js`、`js/game.js` | 4 小時 |
| P1-5 | 中 | 修正列印配分不等於 100 | `print-exam.html` | 0.5 小時 |
| P1-6 | 中 | 移除縮放鎖定（無障礙） | `index.html`、`minecraft.html`、`print-exam.html` | 0.2 小時 |
| P2-1 | 低 | 統一 HTML 轉義 | `js/specialModes.js`、`js/game.js` | 1 小時 |
| P2-2 | 低 | 抽題函式副作用收斂 | `js/curriculum.js` | 1 小時 |
| P2-3 | 低 | 裝置像素比與靜音狀態 | `js/game.js`、`js/minecraftGame.js` | 1 小時 |
| P2-4 | 低 | 分支與部署環境整理 | Git 遠端分支 | 0.3 小時 |

---

## 3. 詳細工作項

### P0-1　CI 加入題庫驗證閘門

**問題**：`deploy.yml` 只有 checkout → upload → deploy，壞題、遮罩失效、ID 重複都能直接上 GitHub Pages。

**作法**：
1. 在 `deploy` job 的 checkout 之後、upload 之前加入：
   - `actions/setup-node@v4`（Node 20）
   - `run: node scripts/validate-questions.mjs`
2. 驗證失敗即中止，不進 upload 步驟。

**驗收標準**：
- 故意把任一題的 `isCorrect` 改成兩個 `true`，push 後 job 必須紅燈且不部署。
- 正常狀態下 job 綠燈，GitHub Pages 內容更新。

---

### P0-2　補齊 PWA icons 與 scope

**問題**：`manifest.json` 沒有 `icons` 與 `scope`，Chrome 判定不可安裝，「加到主畫面」不會出現。
另外 `sw.js` 的 `install` 只預快取本地檔，`three@0.170.0`、`canvas-confetti` 首次載入仍需網路，README 的「無網路也能遊玩」只在第二次之後成立。

**作法**：
1. 產生 `icons/icon-192.png`、`icons/icon-512.png`（可用專案現有 pixel/棒球配色，或先用 canvas 產生再存檔）。
2. `manifest.json` 增加 `icons`、`scope: "./"`、`start_url: "./index.html"`，並補 `apple-touch-icon` link。
3. 於 `README.md` 明確標註：「首次載入需網路（CDN 套件），之後可離線」。

**驗收標準**：
- Chrome DevTools → Application → Manifest 無錯誤，出現「Install」提示。
- 飛航模式下重新整理 `index.html`、`minecraft.html`、`print-exam.html` 皆可開啟。

---

### P1-1　統一版本號

**問題**：`index.html` 標題 4.0、`README.md` 4.0、`js/game.js` 檔頭 3.0、程式內註解與 commit 是 5.0、`sw.js` 快取 v5。

**作法**：
1. 決議單一版號（建議沿用最新的 **5.0**）。
2. 更新：`index.html` `<title>`、`README.md` 標題與功能段、`js/game.js` 檔頭註解、`minecraft.html` 標題（若含版本）。
3. `sw.js` 的 `CACHE_NAME` 與版號同步（`g2-midterm-3d-v5` 維持）。

**驗收標準**：`grep` 專案內不再出現 3.0 / 4.0 的產品版號字樣（教材內的單元數字不算）。

---

### P1-2　補齊文件目錄樹

**問題**：`js/gameplayUpgrades.js`（708 行，被 `game.js` import、`sw.js` 預快取）在 README 與 AGENTS.md 的目錄結構都沒列。

**作法**：
1. `README.md` 目錄樹 `js/` 段補上 `gameplayUpgrades.js` 說明。
2. `AGENTS.md` 第 4 節目錄結構同步補上。
3. 順手確認 `MINECRAFT_PLAN.md`、`DEVELOPMENT_PLAN.md` 是否也需補。

**驗收標準**：目錄樹列出的檔案與 `git ls-files` 完全一致（可用小腳本比對）。

---

### P1-3　題庫數值驗證自動化

**問題**：現有驗證只檢查結構與遮罩，不檢查答案內容。AGENTS.md 自檢卻要求「數學計算結果 100% 正確」。本次是以臨時腳本抽 37 條算式驗證，未納入版控。

**作法**：
1. 在 `scripts/validate-questions.mjs` 新增第 7 段：
   - 從 `question` 與 `hint` 擷取 `a ± b = c` 算式，逐條計算比對。
   - 檢查每題正解中的關鍵數字是否出現在 `hint`（容許明確的「範圍型」例外，如 `math_34`，以白名單登記）。
   - 檢查選項 `isCorrect` 與 `hitResult` 語意不衝突（例如正解選項的 `hitResult` 不得含「揮棒落空」）。
2. 國語題目新增「注音欄位不得洩漏正解」的既有檢查已有，維持。

**驗收標準**：
- 故意把 `math_02` 正解改成 135，腳本必須失敗並指出題號。
- 正常狀態下新增檢查全數通過。

---

### P1-4　抽離可測試的純邏輯

**問題**：`advanceRunners()`、`evaluateHitBases()`、金幣加成規則都綁在 `GameEngine` 內並依賴 DOM，無法單元測試；兩版又各自實作一份。

**作法**：
1. 新增 `js/gameLogic.js`，匯出純函式：
   - `advanceRunners(bases, hitBases)` → `{ bases, runsScored }`
   - `calculateCoins({ isHR, basesLoaded, bonuses, multiplier })`
   - `resolveHitBases({ powerPos, combo, bat, pet, buffs, qte })`
2. `game.js` 與 `minecraftGame.js` 改為呼叫共用函式（麥塊版以參數切換獎勵名稱）。
3. 在 `validate-questions.mjs` 或新增 `scripts/test-game-logic.mjs` 加入案例：
   - 滿壘全壘打 = 4 分、二壘打推進、三出局清空壘包。
   - 金幣倍率疊加（球棒 × 事件 × 天賦）。

**驗收標準**：
- 抽出的函式覆蓋率達主要分支，且棒球版、麥塊版行為與修改前一致（手動比對金額與比分）。

> 註：此項會動到核心流程，建議在 P0、P1-1～P1-3 完成後獨立一個 commit。

---

### P1-5　修正列印配分

**問題**：`print-exam.html:444` `Math.round(100 / currentPaper.length)`，題庫不足時總分 ≠ 100（`math_u5` 只有 6 題 → 17×6 = 102）。

**作法**：
1. 先算 `total = 100`，`base = Math.floor(100 / n)`，餘數 `100 - base*n` 分配給前幾題（每題 +1）。
2. 或直接顯示「本卷共 n 題，每題 x 分，總分 y 分」，不以 100 分為前提。

**驗收標準**：
- `math_u5` 選 10 題（實際 6 題）時，卷面分數加總恰為 100。

---

### P1-6　移除縮放鎖定

**問題**：`index.html:5`、`minecraft.html:5` 使用 `maximum-scale=1.0, user-scalable=no`；`print-exam.html` 無 viewport。

**作法**：
1. 改為 `<meta name="viewport" content="width=device-width, initial-scale=1.0">`。
2. `print-exam.html` 補上相同 viewport。

**驗收標準**：手機可雙指放大，版面不出現橫向溢出。

---

### P2-1　統一 HTML 轉義

**問題**：`js/specialModes.js` 的 `renderStrikeZoneGrid` 直接將選項文字塞入 `innerHTML`；`game.js` 的 `renderActiveBuffsBar` 未轉義 `petObj.name`。

**作法**：將 `escapeHTML` 抽到共用模組（例如 `js/utils.js`），所有 `innerHTML` 插值統一呼叫。

**驗收標準**：把任一選項文字暫時改成 `<b>test</b>`，畫面應顯示字面文字而非粗體。

---

### P2-2　抽題函式副作用收斂

**問題**：`js/curriculum.js` 的 `getGameQuestions()` 會就地修改傳入的 `seenIds`，同時回傳題目；驗證腳本正是依賴此副作用。

**作法**：改為回傳 `{ questions, seenIds }`（或接收回呼），呼叫端明確更新狀態；驗證腳本同步調整。

**驗收標準**：連續 16 場仍覆蓋 144 題不重複，且呼叫端不再需要知道函式會改狀態。

---

### P2-3　裝置像素比與靜音狀態

- `onResize()` 補 `setPixelRatio(Math.min(devicePixelRatio, 2))`（`game.js:220`、`minecraftGame.js:197`）。
- 靜音狀態寫入 localStorage（`g2_baseball_muted` / `g2_mc_muted`），重載後保持一致。

---

### P2-4　分支與部署環境整理

- 刪除或封存遠端 `origin/gh-pages`（已改由 Actions Pages artifact 部署）。
- 確認 GitHub Pages 來源設定為「GitHub Actions」而非 branch。
- 推送目前落後的 1 個 commit。

---

## 4. 執行順序（里程碑）

| 里程碑 | 內容 | 完成定義 |
| :--- | :--- | :--- |
| M1（0.5 天） | P0-1、P0-2 | CI 會擋壞題；Chrome 可安裝 PWA |
| M2（1 天） | P1-1、P1-2、P1-5、P1-6 | 版號與文件一致；列印總分正確；可縮放 |
| M3（1 天） | P1-3 | 題庫內容正確性納入自動驗證 |
| M4（1～2 天） | P1-4 | 核心規則可單元測試，雙版共用 |
| M5（0.5 天） | P2-1～P2-4 | 一致性與環境收尾 |

---

## 5. 明確不做（Scope Control）

為避免範圍膨脹，本計畫**不包含**：

- 專案框架化（Vite / React / TypeScript 遷移）。
- 後端、帳號、雲端同步錯題本。
- 題庫擴充或重新命題（除非驗證發現錯誤）。
- 美術與 3D 資產翻新。
- 將兩版遊戲合併為單一入口。

---

## 6. 每次提交前自檢（沿用 AGENTS.md）

- [ ] 題意符合小二認知（無超綱括號併式）？
- [ ] 數學結果與文字描述 100% 正確？
- [ ] 答案卷題號與解答完全吻合？
- [ ] `node scripts/validate-questions.mjs` 全數通過？
- [ ] 修改到的頁面在桌機與手機各開一次，確認無 console 錯誤？
- [ ] commit 訊息符合 `feat` / `fix` / `docs` / `refactor` 規範？

---

## 7. 風險與注意事項

| 風險 | 影響 | 緩解 |
| :--- | :--- | :--- |
| 抽離共用邏輯（P1-4）改變遊戲平衡 | 金幣與得分與舊版不同 | 先在 `gameLogic.js` 寫死既有公式與測試，再逐步替換 |
| 版本號變更導致 Service Worker 舊快取殘留 | 使用者看到舊頁面 | 同步 bump `CACHE_NAME`，`activate` 已會刪除舊快取 |
| CI 加入驗證後既有題庫不通過 | 無法部署 | 先在本地跑腳本確認 6/6，再啟用閘門 |
| 文件補齊後再次漂移 | 同樣問題重演 | 可用小腳本比對「目錄樹 vs `git ls-files`」納入 CI |
