# Implementation Plan: 聊齋夜話 (Liaozhai Nights)

## Overview

本實作計劃將聊齋夜話專案分解為離散的開發任務。專案採用 React + TypeScript 前端，Vercel Serverless Functions 後端，整合 Google Gemini AI 作為故事引擎。每個任務都建立在前一個任務的基礎上，最終形成完整的互動式中文鬼怪故事應用程式。

## Tasks

- [-] 1. 專案初始化與基礎設定
  - [ ] 1.1 建立 React + TypeScript + Vite 專案結構
    - 使用 `npm create vite@latest . -- --template react-ts` 初始化專案
    - 安裝核心依賴：React 18+, TypeScript, Vite
    - 設定 `tsconfig.json` 以啟用嚴格型別檢查
    - _Requirements: 7.1_
  
  - [ ] 1.2 設定測試框架與工具
    - 安裝 Vitest、fast-check、@testing-library/react
    - 建立 `vitest.config.ts` 設定檔
    - 設定測試覆蓋率目標 (80%+)
    - 建立測試資料生成器 (arbitraries) 基礎結構
    - _Requirements: Testing Strategy_
  
  - [ ] 1.3 建立專案目錄結構與基礎設定檔
    - 建立目錄：`/src/components`, `/src/services`, `/src/types`, `/api`, `/public/assets`
    - 建立 `.env.example` 檔案（包含 `GEMINI_API_KEY` 佔位符）
    - 設定 `.gitignore`（排除 `.env` 但保留 `.kiro` 資料夾）
    - 建立 `vercel.json` 部署設定檔
    - _Requirements: 7.3, 8.1, 9.5_
  
  - [ ] 1.4 安裝與設定 Gemini AI SDK
    - 安裝 `@google/generative-ai` 套件
    - 建立環境變數檢查工具函式
    - 設定 API 金鑰讀取機制（僅後端）
    - _Requirements: 2.2, 8.1_

- [ ] 2. 核心型別定義與介面
  - [ ] 2.1 定義故事引擎核心型別
    - 建立 `/src/types/story.ts`
    - 定義 `Scene`, `Choice`, `StoryState`, `Translation` 介面
    - 定義生物類型 (`CreatureType`) 與場景類型 (`SceneType`) 列舉
    - _Requirements: 1.1, 1.5_
  
  - [ ] 2.2 定義 API 請求與回應型別
    - 建立 `/src/types/api.ts`
    - 定義 `StoryRequest`, `StoryResponse`, `TranslateRequest`, `TranslateResponse` 介面
    - 定義錯誤狀態型別 (`ErrorState`)
    - _Requirements: 2.1, 2.2, 12.1_

- [ ] 3. 後端 API 實作
  - [ ] 3.1 實作 Gemini AI 呼叫包裝函式
    - 建立 `/api/lib/gemini.ts`
    - 實作 `callGeminiWithRetry` 函式（含重試邏輯：2s, 5s, 15s）
    - 實作請求超時處理（20 秒）
    - 處理 HTTP 429 與 5xx 錯誤
    - _Requirements: 2.2, 2.4_
  
  - [ ]* 3.2 撰寫 Gemini API 整合測試
    - 測試重試邏輯行為（使用 mock）
    - 測試超時處理
    - 測試錯誤碼處理（429, 5xx）
    - _Requirements: 2.4_
  
  - [ ] 3.3 實作 `/api/story` 端點
    - 建立 `/api/story.ts` serverless function
    - 驗證傳入請求格式（使用 **Property 12**）
    - 根據故事狀態構建 Gemini prompt
    - 解析 AI 回應為 `Scene` 物件
    - 實作備用場景機制（當 AI 失敗時）
    - _Requirements: 2.1, 2.2, 8.4_
  
  - [ ]* 3.4 撰寫 `/api/story` 整合測試
    - 測試有效請求回應
    - 測試無效請求回傳 HTTP 400
    - 測試備用場景機制
    - _Requirements: 2.2, 8.4_
  
  - [ ] 3.5 實作 `/api/translate` 端點
    - 建立 `/api/translate.ts` serverless function
    - 驗證傳入請求（句子與上下文）
    - 呼叫 Gemini 生成現代中文與英文翻譯
    - 回傳結構化翻譯資料
    - _Requirements: 4.5_
  
  - [ ]* 3.6 撰寫 `/api/translate` 整合測試
    - 測試翻譯請求與回應
    - 測試錯誤處理
    - _Requirements: 4.5_

- [ ] 4. 檢查點 - 後端 API 功能驗證
  - 確保所有測試通過
  - 手動測試 API 端點（使用 curl 或 Postman）
  - 確認 API 金鑰保護機制運作正常
  - 如有問題請詢問使用者

- [ ] 5. 故事引擎實作
  - [ ] 5.1 實作故事狀態管理 (StoryEngine)
    - 建立 `/src/services/StoryEngine.ts`
    - 實作場景轉換邏輯 (`transitionToScene`)
    - 實作選擇處理 (`handleChoice`)
    - 實作生物類型追蹤（確保每次遊戲只遇到一種妖怪）
    - 實作遊戲完成檢查
    - _Requirements: 1.1, 1.3, 1.5, 1.6_
  
  - [ ]* 5.2 撰寫屬性測試 - Property 2: 選擇驅動的狀態轉換
    - **Property 2: 對於任何有效的場景和選擇組合，Story_Engine 處理該選擇後應該轉換到 nextSceneId 指定的場景**
    - **Validates: Requirements 1.3**
    - 使用 `narrativeSceneArbitrary` 與 `choiceArbitrary` 生成測試資料
    - 驗證 `handleChoice` 正確轉換到 `nextSceneId`
  
  - [ ]* 5.3 撰寫屬性測試 - Property 3: 生物類型唯一性不變量
    - **Property 3: 對於任何遊戲過程，creatureEncountered 欄位只能被設定一次，且保持不變**
    - **Validates: Requirements 1.5**
    - 生成隨機選擇序列測試資料
    - 驗證 `creatureEncountered` 不會被多次設定
  
  - [ ]* 5.4 撰寫屬性測試 - Property 4: 結局完成狀態不變量
    - **Property 4: 對於任何 ending 類型場景，isComplete 必須為 true 且 choices 為空**
    - **Validates: Requirements 1.6**
    - 使用 `endingSceneArbitrary` 生成測試資料
    - 驗證結局場景的完成狀態與選擇欄位
  
  - [ ] 5.5 實作 SessionStorage 持久化服務
    - 建立 `/src/services/StorageService.ts`
    - 實作 `saveStoryState`, `loadStoryState`, `clearStoryState` 函式
    - 實作 QuotaExceededError 錯誤處理
    - 實作遊戲重置功能
    - _Requirements: 10.1, 10.2, 10.4, 10.5_
  
  - [ ]* 5.6 撰寫屬性測試 - Property 13: 狀態變化持久化
    - **Property 13: 對於任何故事狀態變化，變化後的狀態應該立即寫入 sessionStorage**
    - **Validates: Requirements 10.1, 10.4**
    - 使用 `storyStateArbitrary` 生成測試資料
    - 驗證 `saveStoryState` 正確寫入 sessionStorage
  
  - [ ]* 5.7 撰寫屬性測試 - Property 14: 選擇歷史追蹤
    - **Property 14: 對於任何玩家選擇序列，choiceHistory 陣列應該按順序包含所有選擇 ID**
    - **Validates: Requirements 10.3**
    - 生成隨機選擇序列
    - 驗證 `choiceHistory` 正確追蹤所有選擇

- [ ] 6. 翻譯服務實作
  - [ ] 6.1 實作翻譯快取管理 (TranslationService)
    - 建立 `/src/services/TranslationService.ts`
    - 實作 `getTranslation` 函式（先檢查快取，未命中則呼叫 API）
    - 實作 `cacheTranslation` 函式（寫入 sessionStorage）
    - 實作快取清除邏輯（當儲存空間不足時）
    - _Requirements: 4.5_
  
  - [ ]* 6.2 撰寫翻譯服務單元測試
    - 測試快取命中與未命中情況
    - 測試 API 呼叫邏輯
    - 測試快取清除機制
    - _Requirements: 4.5_

- [ ] 7. 基礎 UI 元件實作
  - [ ] 7.1 建立 BookContainer 元件（書本容器）
    - 建立 `/src/components/BookContainer.tsx`
    - 實作宣紙紋理背景樣式
    - 實作書本邊框與陰影效果
    - 實作響應式容器尺寸
    - _Requirements: 5.1, 6.1, 6.2_
  
  - [ ] 7.2 建立 PageWrapper 元件（頁面包裝器）
    - 建立 `/src/components/PageWrapper.tsx`
    - 實作頁面版面配置
    - 整合 CandleEffect 與 TalismanDecoration 子元件
    - _Requirements: 5.1, 5.6_
  
  - [ ] 7.3 建立 CandleEffect 元件（燭光效果）
    - 建立 `/src/components/CandleEffect.tsx`
    - 使用 CSS 動畫實作閃爍效果
    - 實作半透明光暈效果
    - _Requirements: 5.4_
  
  - [ ] 7.4 建立 TalismanDecoration 元件（符咒裝飾）
    - 建立 `/src/components/TalismanDecoration.tsx`
    - 設計紅紙符咒 SVG 圖案
    - 實作角落或邊框符咒配置
    - _Requirements: 5.5_

- [ ] 8. 場景顯示元件實作
  - [ ] 8.1 建立 NarrativeText 元件（敘事文字）
    - 建立 `/src/components/NarrativeText.tsx`
    - 使用水墨筆刷風格字體（Google Fonts: Noto Serif TC 或 Ma Shan Zheng）
    - 實作文字淡入動畫
    - 適應桌面與行動裝置字體大小
    - _Requirements: 5.2, 6.3_
  
  - [ ]* 8.2 撰寫屬性測試 - Property 10: 響應式文字可讀性
    - **Property 10: 對於任何視口寬度，所有文字元素的字體大小必須 >= 14px**
    - **Validates: Requirements 6.3**
    - 使用 `viewportSizeArbitrary` 生成測試資料
    - 驗證所有文字元素的計算字體大小
  
  - [ ] 8.3 建立 ChoiceButtons 元件（選擇按鈕）
    - 建立 `/src/components/ChoiceButtons.tsx`
    - 顯示恰好 3 個按鈕（垂直排列）
    - 實作懸停與點擊動畫效果
    - 實作行動裝置觸控友善尺寸（>= 44x44px）
    - _Requirements: 1.2, 6.4_
  
  - [ ]* 8.4 撰寫屬性測試 - Property 1: 場景選擇數量一致性
    - **Property 1: 對於任何 narrative 類型場景，渲染後的 UI 應該顯示恰好 3 個可點擊的選擇按鈕**
    - **Validates: Requirements 1.2**
    - 使用 `narrativeSceneArbitrary` 生成測試資料
    - 驗證渲染的按鈕數量為 3
  
  - [ ]* 8.5 撰寫屬性測試 - Property 11: 觸控目標尺寸
    - **Property 11: 對於任何可點擊元素，在行動裝置視口下尺寸必須 >= 44x44px**
    - **Validates: Requirements 6.4**
    - 使用行動裝置視口尺寸測試資料（寬度 < 768px）
    - 驗證所有互動元素的尺寸
  
  - [ ] 8.6 建立 SceneView 元件（場景檢視）
    - 建立 `/src/components/SceneView.tsx`
    - 整合 NarrativeText 與 ChoiceButtons
    - 實作場景切換時的淡入淡出效果
    - 處理選擇點擊事件
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 9. 結局顯示與翻譯互動元件
  - [ ] 9.1 建立 InteractiveSentence 元件（可點擊句子）
    - 建立 `/src/components/InteractiveSentence.tsx`
    - 實作句子分割邏輯（按句號、驚嘆號、問號分割）
    - 為每個句子添加點擊事件處理器
    - 實作懸停提示效果（視覺回饋）
    - _Requirements: 4.1_
  
  - [ ]* 9.2 撰寫屬性測試 - Property 7: 句子互動性
    - **Property 7: 對於任何顯示的文言文段落，每個句子元素都應該具有點擊事件處理器**
    - **Validates: Requirements 4.1**
    - 使用文言文文字資料生成器
    - 驗證所有句子元素都有 onClick 處理器
  
  - [ ] 9.3 建立 TranslationOverlay 元件（翻譯覆蓋層）
    - 建立 `/src/components/TranslationOverlay.tsx`
    - 實作浮動覆蓋層樣式（宣紙背景）
    - 同時顯示現代中文與英文翻譯
    - 實作點擊外部關閉功能
    - 實作再次點擊相同句子時切換顯示/隱藏
    - _Requirements: 4.2, 4.3, 4.4, 4.6_
  
  - [ ]* 9.4 撰寫屬性測試 - Property 8: 翻譯覆蓋層雙語顯示
    - **Property 8: 對於任何翻譯覆蓋層，必須同時包含現代中文與英文翻譯**
    - **Validates: Requirements 4.2, 4.3**
    - 使用翻譯資料生成器
    - 驗證覆蓋層包含兩種語言的翻譯
  
  - [ ]* 9.5 撰寫屬性測試 - Property 9: 翻譯覆蓋層切換行為
    - **Property 9: 對於任何已顯示翻譯覆蓋層的句子，再次點擊應該隱藏覆蓋層**
    - **Validates: Requirements 4.6**
    - 模擬點擊事件序列
    - 驗證覆蓋層的顯示/隱藏狀態切換
  
  - [ ] 9.6 建立 ClassicalText 元件（文言文文字）
    - 建立 `/src/components/ClassicalText.tsx`
    - 整合 InteractiveSentence 元件
    - 實作古典字體樣式
    - 實作與 TranslationOverlay 的互動
    - _Requirements: 3.1, 4.1_
  
  - [ ] 9.7 建立 EndingView 元件（結局檢視）
    - 建立 `/src/components/EndingView.tsx`
    - 顯示文言文結局（使用 ClassicalText）
    - 顯示現代中文與英文翻譯（視覺區分）
    - 實作「重新開始」按鈕
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 9.8 撰寫屬性測試 - Property 5: 結局文言文顯示
    - **Property 5: 對於任何 ending 類型場景，UI 渲染結果必須包含該場景的 classicalText 內容**
    - **Validates: Requirements 3.1**
    - 使用 `endingSceneArbitrary` 生成測試資料
    - 驗證渲染結果包含 classicalText
  
  - [ ]* 9.9 撰寫屬性測試 - Property 6: 結局翻譯完整性
    - **Property 6: 對於任何 ending 類型場景，必須同時存在非空的 modernChinese 和 englishTranslation 欄位**
    - **Validates: Requirements 3.2, 3.3**
    - 使用 `endingSceneArbitrary` 生成測試資料
    - 驗證翻譯欄位存在且非空

- [ ] 10. 檢查點 - 核心 UI 元件驗證
  - 確保所有測試通過（含屬性測試）
  - 使用 Storybook 或手動測試驗證元件視覺效果
  - 測試響應式佈局（桌面與行動裝置）
  - 測試翻譯互動功能
  - 如有問題請詢問使用者

- [ ] 11. 動畫與視覺效果實作
  - [ ] 11.1 實作 PageTurnAnimation 元件（翻頁動畫）
    - 建立 `/src/components/PageTurnAnimation.tsx`
    - 使用 CSS transforms 實作 3D 翻頁效果
    - 動畫持續時間 <= 1 秒
    - 實作淡入淡出效果配合翻頁
    - _Requirements: 5.3, 11.3_
  
  - [ ]* 11.2 撰寫翻頁動畫效能測試
    - 驗證動畫完成時間 <= 1 秒
    - 測試多次連續翻頁效能
    - _Requirements: 11.3_

- [ ] 12. 載入與錯誤處理 UI
  - [ ] 12.1 建立 LoadingIndicator 元件（載入指示器）
    - 建立 `/src/components/LoadingIndicator.tsx`
    - 設計古風載入動畫（例如：旋轉的八卦圖或蠟燭閃爍）
    - 顯示雙語載入文字（「故事生成中... / Generating story...」）
    - 實作平滑淡入淡出
    - _Requirements: 11.2, 11.5_
  
  - [ ] 12.2 建立 ErrorMessage 元件（錯誤訊息）
    - 建立 `/src/components/ErrorMessage.tsx`
    - 實作「符咒警示」風格設計（紅色或淡黃宣紙背景、符咒邊框）
    - 顯示雙語錯誤訊息
    - 實作重試按鈕（當錯誤可復原時）
    - 實作「載入備用故事」按鈕
    - _Requirements: 12.1, 12.2, 12.4, 12.5_
  
  - [ ]* 12.3 撰寫錯誤處理流程測試
    - 測試不同錯誤類型的顯示
    - 測試重試按鈕功能
    - 測試備用場景載入
    - _Requirements: 12.1, 12.2, 12.5_

- [ ] 13. 主應用程式整合
  - [ ] 13.1 實作主 App 元件
    - 建立 `/src/App.tsx`
    - 整合所有子元件（BookContainer, PageWrapper, SceneView, EndingView, LoadingIndicator, ErrorMessage）
    - 實作應用程式狀態管理（使用 React hooks）
    - 實作場景切換邏輯
    - 處理 API 呼叫與錯誤
    - _Requirements: 1.1, 1.3, 2.1, 2.4_
  
  - [ ] 13.2 實作 API 客戶端服務
    - 建立 `/src/services/ApiClient.ts`
    - 實作 `fetchStory` 函式（呼叫 `/api/story`）
    - 實作 `fetchTranslation` 函式（呼叫 `/api/translate`）
    - 實作網路錯誤處理與重試
    - _Requirements: 2.1, 4.5, 12.2_
  
  - [ ]* 13.3 撰寫屬性測試 - Property 12: API 請求驗證
    - **Property 12: 對於任何無效請求，後端應該回傳 HTTP 400 錯誤而不呼叫 Gemini API**
    - **Validates: Requirements 8.4**
    - 生成無效請求資料（缺少欄位、型別錯誤）
    - 驗證後端回傳 400 且不呼叫 AI 服務
  
  - [ ] 13.4 實作備用場景資料
    - 建立 `/src/data/fallbackScenes.ts`
    - 撰寫至少 1 個開場場景
    - 撰寫至少 3 個結局場景（每種生物類型一個）
    - 包含完整的文言文、現代中文、英文翻譯
    - _Requirements: 2.4_
  
  - [ ] 13.5 實作遊戲初始化與重置邏輯
    - 實作應用程式啟動時載入儲存的狀態
    - 實作「重新開始」功能（清除狀態並回到開場）
    - 實作結局後的遊戲重置選項
    - _Requirements: 1.1, 10.2, 10.5_

- [ ] 14. 檢查點 - 完整應用程式功能驗證
  - 確保所有測試通過（單元測試、屬性測試、整合測試）
  - 執行完整的遊戲流程測試（從開場到結局）
  - 測試三種生物類型的故事路徑
  - 測試翻譯功能在所有結局中運作
  - 測試狀態持久化與恢復
  - 測試錯誤處理與備用場景
  - 如有問題請詢問使用者

- [ ] 15. 視覺美學與響應式優化
  - [ ] 15.1 實作全域樣式與主題
    - 建立 `/src/styles/theme.ts`（或 CSS 變數）
    - 定義色彩配置（宣紙米色、墨黑、符咒紅）
    - 定義字體家族（中文：Noto Serif TC；英文：Crimson Text 或 Cinzel）
    - 定義間距與斷點（breakpoints）
    - _Requirements: 5.1, 5.2, 5.6_
  
  - [ ] 15.2 實作響應式佈局調整
    - 桌面版（>= 1024px）：置中書本容器，最大寬度 800px
    - 平板版（768px - 1023px）：稍小書本容器，邊距適中
    - 行動版（< 768px）：全螢幕書本容器，較大字體
    - 實作方向變化處理（直向/橫向）
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [ ] 15.3 視覺細節與動畫優化
    - 微調燭光閃爍效果（更自然的動畫曲線）
    - 添加符咒裝飾的細微動畫（懸停時輕微發光）
    - 優化翻頁動畫的時間曲線（ease-in-out）
    - 實作載入指示器的平滑過渡
    - _Requirements: 5.3, 5.4, 5.5, 5.7_
  
  - [ ]* 15.4 撰寫視覺迴歸測試
    - 使用 Storybook + Chromatic（或手動截圖比對）
    - 測試所有主要元件的視覺輸出
    - 測試不同視口尺寸的佈局
    - 測試動畫關鍵幀
    - _Requirements: 5.7, 6.1, 6.2_

- [ ] 16. 效能優化
  - [ ] 16.1 實作翻譯快取優化
    - 確保 sessionStorage 快取正確運作
    - 實作快取大小限制（自動清除舊條目）
    - 預載入常見句子的翻譯
    - _Requirements: 11.1_
  
  - [ ] 16.2 實作程式碼分割與懶載入
    - 使用 React.lazy 延遲載入 EndingView 元件
    - 使用動態 import 載入大型資產（字體、圖片）
    - 優化 bundle 大小（檢查重複依賴）
    - _Requirements: 11.1_
  
  - [ ]* 16.3 撰寫效能測試
    - 測試初始載入時間（目標 < 3 秒）
    - 測試翻譯覆蓋層出現時間（目標 < 200ms）
    - 測試翻頁動畫完成時間（目標 <= 1 秒）
    - _Requirements: 11.1, 11.3, 11.4_

- [ ] 17. 部署設定與安全性
  - [ ] 17.1 設定 Vercel 部署配置
    - 確認 `vercel.json` 正確設定 serverless functions
    - 設定環境變數（GEMINI_API_KEY）在 Vercel 控制台
    - 設定建置命令（`npm run build`）
    - 設定輸出目錄（`dist`）
    - _Requirements: 7.2, 7.3, 7.5_
  
  - [ ] 17.2 實作安全性檢查
    - 執行前端程式碼掃描（確保無 API 金鑰洩漏）
    - 檢查 `.gitignore` 排除 `.env` 檔案
    - 驗證後端 API 請求驗證邏輯
    - 實作 CORS 設定（僅允許自己的網域）
    - _Requirements: 8.1, 8.2, 8.3, 8.5, 9.5_
  
  - [ ]* 17.3 撰寫煙霧測試（安全性與設定）
    - 驗證 `.kiro` 資料夾存在於儲存庫中
    - 驗證 LICENSE 檔案存在
    - 驗證 `.env` 被 `.gitignore` 排除
    - 驗證前端程式碼中無硬編碼的 API 金鑰
    - _Requirements: 8.1, 8.2, 9.1, 9.2, 9.3, 9.5_

- [ ] 18. 文件撰寫與儲存庫整理
  - [ ] 18.1 撰寫 README.md
    - 專案概述（繁體中文與英文）
    - 使用 Kiro 建構的說明
    - 本地開發設定指引（安裝依賴、設定 API 金鑰、執行開發伺服器）
    - 部署指引（Vercel）
    - 技術棧說明
    - 授權資訊（MIT）
    - _Requirements: 9.4_
  
  - [ ] 18.2 完善 `.env.example` 檔案
    - 添加所有必要環境變數的佔位符
    - 添加註解說明每個變數的用途
    - 添加取得 Gemini API 金鑰的指引連結
    - _Requirements: 8.1, 9.4_
  
  - [ ] 18.3 確認 .kiro 資料夾完整性
    - 驗證 `/specs/liaozhai-nights/requirements.md` 存在
    - 驗證 `/specs/liaozhai-nights/design.md` 存在
    - 驗證 `/specs/liaozhai-nights/tasks.md` 存在（本檔案）
    - 驗證 `/specs/liaozhai-nights/.config.kiro` 存在
    - _Requirements: 9.3_

- [ ] 19. 最終測試與驗證
  - [ ] 19.1 執行完整測試套件
    - 執行所有單元測試（`npm run test`）
    - 執行所有屬性測試（14 個屬性全部通過）
    - 執行所有整合測試
    - 驗證測試覆蓋率 >= 80%
    - _Requirements: Testing Strategy_
  
  - [ ]* 19.2 執行端到端測試
    - 測試完整遊戲流程（三種生物類型）
    - 測試所有結局路徑可達
    - 測試翻譯功能在所有結局中運作
    - 測試狀態持久化與恢復
    - 測試錯誤處理與備用場景
    - 測試行動裝置與桌面裝置體驗
  
  - [ ] 19.3 部署到 Vercel
    - 連接 GitHub 儲存庫到 Vercel
    - 設定環境變數
    - 執行首次部署
    - 驗證生產環境功能正常
    - _Requirements: 7.1, 7.2_
  
  - [ ] 19.4 驗證所有需求達成
    - 逐一檢查 requirements.md 中的 12 個需求
    - 確認所有驗收標準已實作
    - 測試所有使用者故事場景
    - 記錄任何已知問題或未來改進項目

- [ ] 20. 最終檢查點 - 專案完成
  - 確保所有測試通過
  - 確保應用程式已成功部署
  - 確保文件完整且準確
  - 確保儲存庫結構符合要求
  - 專案完成！

## Notes

- **測試標記說明**：標記 `*` 的子任務為可選測試任務，可跳過以加速 MVP 開發，但建議完成以確保程式碼品質
- **屬性測試**：共 14 個屬性測試，每個都對應設計文件中的 Correctness Properties，確保核心邏輯正確性
- **檢查點任務**：在關鍵階段設置檢查點，確保增量驗證與及時發現問題
- **需求追溯性**：每個任務都標註對應的需求編號，確保完整覆蓋所有需求
- **程式碼提交**：建議每完成 2-3 個任務就提交一次程式碼，使用繁體中文撰寫 commit 訊息
- **備用場景**：當 Gemini API 配額用盡時，系統會自動切換到預寫的備用場景，確保 Demo 可持續運作
- **雙語支援**：所有使用者可見的文字都需要繁體中文與英文雙語版本
- **響應式設計**：所有 UI 元件都需要在桌面（>= 1024px）、平板（768-1023px）、行動裝置（< 768px）上正常運作
- **無障礙考量**：觸控目標尺寸 >= 44x44px，文字大小 >= 14px，色彩對比符合 WCAG 標準

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.3", "1.4", "2.1", "2.2"] },
    { "id": 1, "tasks": ["1.2", "3.1", "13.4"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.5"] },
    { "id": 3, "tasks": ["3.4", "3.6", "5.1", "6.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4", "5.5", "6.2", "7.1", "7.2", "7.3", "7.4"] },
    { "id": 5, "tasks": ["5.6", "5.7", "8.1", "8.3"] },
    { "id": 6, "tasks": ["8.2", "8.4", "8.5", "8.6", "9.1", "11.1"] },
    { "id": 7, "tasks": ["9.2", "9.3", "9.6", "11.2", "12.1", "12.2"] },
    { "id": 8, "tasks": ["9.4", "9.5", "9.7", "12.3", "13.2"] },
    { "id": 9, "tasks": ["9.8", "9.9", "13.1", "13.3", "13.5"] },
    { "id": 10, "tasks": ["15.1", "15.2", "16.1", "16.2"] },
    { "id": 11, "tasks": ["15.3", "15.4", "16.3", "17.1", "17.2"] },
    { "id": 12, "tasks": ["17.3", "18.1", "18.2", "18.3"] },
    { "id": 13, "tasks": ["19.1", "19.2", "19.3"] },
    { "id": 14, "tasks": ["19.4"] }
  ]
}
```
