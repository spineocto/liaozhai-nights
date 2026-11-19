# Requirements Document

## Introduction

聊齋夜話（Liaozhai Nights）是一個互動式中文鬼怪故事網頁應用程式，靈感來自蒲松齡的《聊齋誌異》（*Strange Tales from a Chinese Studio*）。應用程式呈現分支敘事體驗，玩家扮演一位前往參加科舉考試的年輕書生。AI 說書人（AI storyteller）會敘述場景並提供選擇，引導玩家遭遇超自然生物（狐仙、畫皮妖或殭屍），最終通往多種可能的結局。每個結局都以文言文（classical Chinese）風格的故事呈現，並附上現代中文和英文翻譯。應用程式具有古書美學（old book aesthetic），搭配傳統中式視覺元素，並提供點擊翻譯功能，幫助中文學習者理解文言文內容。

## Glossary

- **Story_Engine**：管理敘事狀態、選擇邏輯和故事進展的系統元件
- **AI_Narrator**：生成場景描述和敘事文字的 AI 服務
- **Translation_Service**：為文言文提供現代中文和英文翻譯的元件
- **UI_Renderer**：負責顯示書本風格介面和視覺效果的元件
- **Choice**：玩家從 3 個選項中選擇、影響故事進展的決策點
- **Ending**：以文言文故事及翻譯呈現的終點故事狀態
- **Scene**：包含描述文字、可能包含選擇的敘事內容單元
- **Classical_Text**：以文言文風格撰寫的文字（文言文）
- **Modern_Chinese**：當代簡體或繁體中文（現代漢語）
- **Translation_Overlay**：點擊文字時顯示翻譯的互動元素
- **Backend_API**：處理 AI 請求並保護 API 金鑰（API keys）的伺服器端元件

## Requirements

### 需求 1：故事進展與分支

**使用者故事：** 身為玩家，我想要做出影響故事結果的選擇，這樣我就能體驗不同的敘事路徑和結局。

#### 驗收標準

1. WHEN 應用程式啟動時，THE Story_Engine SHALL 以書生前往科舉考試的開場場景進行初始化
2. WHEN Scene 包含選擇時，THE UI_Renderer SHALL 顯示恰好 3 個選擇選項
3. WHEN 玩家選擇一個 Choice 時，THE Story_Engine SHALL 轉換到對應的下一個 Scene
4. THE Story_Engine SHALL 支援至少 3 個不同的 Endings
5. THE Story_Engine SHALL 確保每次遊玩都會遭遇恰好一種超自然生物類型（狐仙、畫皮妖或殭屍）
6. WHEN 到達 Ending 時，THE Story_Engine SHALL 將故事標記為完成並阻止進一步的選擇

### 需求 2：AI 生成的敘事內容

**使用者故事：** 身為玩家，我想要 AI 說書人來敘述場景，這樣我就能體驗動態且吸引人的故事內容。

#### 驗收標準

1. WHEN Scene 需要敘事文字時，THE AI_Narrator SHALL 生成符合情境的場景描述
2. WHEN 請求 AI 內容時，THE Backend_API SHALL 使用當前故事情境呼叫 AI 服務
3. THE Backend_API SHALL 保護 API 金鑰（API keys）不被瀏覽器程式碼暴露
4. WHEN AI 生成失敗時，THE Story_Engine SHALL 顯示備用錯誤訊息並允許玩家重試
5. THE AI_Narrator SHALL 生成符合故事設定的文言文風格內容

### 需求 3：文言文結局撰寫

**使用者故事：** 身為玩家，我想要結局以文言文故事呈現，這樣我就能體驗真實的傳統說書方式。

#### 驗收標準

1. WHEN 到達 Ending 時，THE UI_Renderer SHALL 以 Classical_Text 顯示結局
2. THE Ending SHALL 包含現代中文翻譯
3. THE Ending SHALL 包含英文翻譯
4. THE UI_Renderer SHALL 在視覺上區分 Classical_Text 與其翻譯
5. THE Classical_Text SHALL 遵循傳統敘事慣例（結構、詞彙和風格需符合蒲松齡作品）

### 需求 4：互動式翻譯功能

**使用者故事：** 身為中文學習者，我想要點擊任何句子來查看翻譯，這樣我就能理解文言文而不會迷失。

#### 驗收標準

1. WHEN 顯示 Classical_Text 時，THE UI_Renderer SHALL 讓每個句子都能互動
2. WHEN 玩家點擊一個句子時，THE Translation_Overlay SHALL 顯示現代中文翻譯
3. THE Translation_Overlay SHALL 顯示英文翻譯
4. WHEN 玩家點擊 Translation_Overlay 外部時，THE UI_Renderer SHALL 隱藏覆蓋層
5. THE Translation_Service SHALL 提供準確的句子級翻譯，保留原文意義
6. WHEN 某個句子已經顯示翻譯，且玩家再次點擊它時，THE UI_Renderer SHALL 隱藏 Translation_Overlay

### 需求 5：傳統書本美學

**使用者故事：** 身為玩家，我想要美麗的古書介面搭配傳統中式視覺元素，這樣我就能沉浸在古典氛圍中。

#### 驗收標準

1. THE UI_Renderer SHALL 以宣紙紋理背景顯示內容
2. THE UI_Renderer SHALL 使用水墨筆刷風格字體顯示中文文字
3. THE UI_Renderer SHALL 在場景切換時展示翻頁動畫
4. THE UI_Renderer SHALL 顯示燭光閃爍效果
5. THE UI_Renderer SHALL 融入紅紙符咒（符咒）視覺元素
6. THE UI_Renderer SHALL 維持「詭異但美麗」美學的視覺一致性
7. THE UI_Renderer SHALL 在桌面和行動裝置上都以適當效能渲染所有視覺元素

### 需求 6：響應式多裝置支援

**使用者故事：** 身為玩家，我想要應用程式在手機和電腦上都能正常運作，這樣我就能隨時隨地遊玩。

#### 驗收標準

1. WHEN 在桌面裝置上存取時，THE UI_Renderer SHALL 顯示針對大螢幕最佳化的介面
2. WHEN 在行動裝置上存取時，THE UI_Renderer SHALL 顯示針對小螢幕最佳化的介面
3. THE UI_Renderer SHALL 在所有裝置尺寸上維持可讀的文字大小
4. THE UI_Renderer SHALL 確保互動元素（點擊目標）在行動裝置上的觸控輸入有適當尺寸
5. WHEN 裝置方向改變時，THE UI_Renderer SHALL 適當地調整版面配置

### 需求 7：簡單的部署架構

**使用者故事：** 身為初學者開發者，我想要一個簡單的架構，可以免費部署，這樣我就能分享我的專案而不需要複雜的基礎設施。

#### 驗收標準

1. THE 應用程式 SHALL 能夠作為單一網頁應用程式部署
2. THE 應用程式 SHALL 與免費託管平台（Vercel 或 Netlify）相容
3. THE Backend_API SHALL 以與所選託管平台相容的 serverless functions（無伺服器函式）運行
4. THE 應用程式 SHALL 核心功能不需要獨立的資料庫伺服器
5. THE 應用程式部署流程 SHALL 只需要基本設定（API 金鑰的環境變數）

### 需求 8：安全性與 API 金鑰保護

**使用者故事：** 身為開發者，我想要 API 金鑰受到保護不被瀏覽器暴露，這樣我的 API 憑證就能保持安全。

#### 驗收標準

1. THE Backend_API SHALL 將 API 金鑰儲存在環境變數中
2. THE 應用程式 SHALL NOT 在瀏覽器可存取的程式碼或設定檔中包含 API 金鑰
3. WHEN 瀏覽器請求 AI 生成的內容時，THE Backend_API SHALL 作為外部 AI 服務的代理（proxy）
4. THE Backend_API SHALL 在轉發到 AI 服務之前驗證傳入請求
5. WHEN API 金鑰遺失或無效時，THE Backend_API SHALL 回傳錯誤回應而不暴露憑證細節

### 需求 9：開源與儲存庫結構

**使用者故事：** 身為貢獻者或評審，我想要專案公開可用並具有適當授權，這樣程式碼就能被分享和評估。

#### 驗收標準

1. THE 儲存庫 SHALL 可公開存取
2. THE 儲存庫 SHALL 包含 MIT 授權檔案
3. THE 儲存庫 SHALL 包含 .kiro 資料夾及其所有規格和設定檔案
4. THE 儲存庫 SHALL 包含說明專案以及如何使用 Kiro 建構的 README
5. THE .gitignore SHALL 排除敏感檔案（API 金鑰、環境變數），同時保留 .kiro 內容

### 需求 10：故事狀態管理

**使用者故事：** 身為玩家，我想要在我的會話期間維持故事進度，這樣如果我不小心離開頁面，就能從原處繼續。

#### 驗收標準

1. WHEN Scene 改變時，THE Story_Engine SHALL 持久化當前故事狀態
2. WHEN 應用程式在同一個瀏覽器會話內重新載入時，THE Story_Engine SHALL 恢復先前的故事狀態
3. THE Story_Engine SHALL 追蹤當前遊玩中已做出的選擇
4. WHEN 到達 Ending 時，THE Story_Engine SHALL 持久化完成狀態
5. THE Story_Engine SHALL 提供從頭開始重新開始故事的機制

### 需求 11：效能與載入體驗

**使用者故事：** 身為玩家，我想要快速載入和流暢的互動，這樣我就能保持沉浸在故事中。

#### 驗收標準

1. WHEN 應用程式首次載入時，THE UI_Renderer SHALL 在典型寬頻連線上於 3 秒內顯示初始內容
2. WHEN 請求 AI 生成內容時，THE UI_Renderer SHALL 顯示載入指示器
3. THE UI_Renderer SHALL 在 1 秒內完成翻頁動畫
4. THE Translation_Overlay SHALL 在點擊後 200 毫秒內出現
5. WHEN AI 內容正在生成時，THE UI_Renderer SHALL 提供視覺回饋指示系統正在運作

### 需求 12：錯誤處理與使用者回饋

**使用者故事：** 身為玩家，我想要在出錯時得到清楚的回饋，這樣我就能理解發生了什麼事以及該怎麼做。

#### 驗收標準

1. WHEN Backend_API 無法生成內容時，THE UI_Renderer SHALL 顯示中英文雙語錯誤訊息
2. WHEN 發生網路錯誤時，THE UI_Renderer SHALL 顯示重試選項
3. WHEN Translation_Service 無法載入翻譯時，THE UI_Renderer SHALL 顯示原始 Classical_Text 並附上翻譯無法使用的註記
4. THE 錯誤訊息 SHALL 符合應用程式美學（設計成傳統告示或警示符咒的樣式）
5. WHEN 錯誤可復原時，THE UI_Renderer SHALL 提供清楚的動作來重試或繼續
