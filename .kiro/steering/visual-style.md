# Visual Style Guide - 聊齋夜話視覺風格指南

## 色彩系統 (Color System)

### 主色調
- **宣紙底色**：米白色、淡黃色（#F5F5DC, #FFF8E7）
- **墨色**：深灰黑（#2C2C2C, #1A1A1A）
- **朱砂紅點綴**：暗紅色（#8B0000, #A0522D）

### 禁止使用
- ❌ 漸層效果（gradients）
- ❌ 圓角卡片（rounded corners on cards）
- ❌ 鮮豔色彩
- ❌ 現代化配色

## 字體系統 (Typography)

### 中文字體
- **首選**：宋體（SimSun, STSong）
- **備選**：楷體（KaiTi, STKaiti）
- **標題**：可用較粗的楷體或仿宋

### 英文字體
- **首選**：襯線字體（Serif）如 Georgia, Times New Roman
- **避免**：無襯線字體（避免過於現代感）

### 文字風格
- 仿聊齋文言白話混合風格
- 句子短促
- 留白多
- 恐怖感靠暗示，不靠血腥描寫

## 視覺元素 (Visual Elements)

### 氛圍營造
- **時間**：夜晚場景
- **光源**：燭火搖曳效果
- **場景**：破廟、古宅
- **細節**：紙窗上的影子、木製門框、青磚牆面

### 裝飾元素
- 紅色紙符（talismans）
- 古書紋理
- 毛筆筆觸效果
- 墨跡、印章

### 佈局原則
- 大量留白（negative space）
- 垂直排版優先（traditional Chinese vertical text where appropriate）
- 避免擁擠的佈局
- 使用直線和直角（避免圓角）

## 雙語設計 (Bilingual Design)

### 語言策略
- **主要語言**：英文（English primary）
- **次要語言**：中文（Chinese secondary）
- **UI 介面**：英文
- **故事敘述**：英文

### 中文使用場景
- **標題**：書法風格的中文標題作為裝飾元素
- **關鍵對話**：重要台詞顯示中文書法字體
- **每個中文元素旁邊都要有英文翻譯**

### 語言切換
- 提供語言切換功能（EN/中）
- 切換按鈕設計要符合整體風格（避免現代化按鈕）
- 建議使用：「English / 中文」文字切換

## 動畫效果 (Animations)

### 允許的動畫
- 翻頁效果（page turn）
- 燭火搖曳（candlelight flicker）
- 淡入淡出（fade in/out）
- 墨跡暈染效果（ink diffusion）

### 動畫原則
- 緩慢、流暢
- 避免彈跳（bounce）或過於活潑的動畫
- 保持莊重、神秘的氛圍

## 響應式設計 (Responsive Design)

### 桌面版
- 書本攤開的雙頁效果（book spread layout）
- 寬鬆的留白

### 手機版
- 單頁顯示
- 保持垂直捲動
- 確保文字可讀性
- 保持相同的視覺風格

## 參考意象 (Visual References)

- 古籍善本
- 清代木刻版畫
- 傳統水墨畫
- 舊式線裝書
- 寺廟燭光
- 剪影藝術（silhouette art）

## 實作注意事項

### CSS 設計原則
```css
/* 使用直角，避免圓角 */
border-radius: 0;

/* 使用宣紙質感背景 */
background: url('/assets/paper-texture.jpg');

/* 墨色文字 */
color: #2C2C2C;

/* 朱砂紅點綴 */
accent-color: #8B0000;
```

### 圖片素材
- 使用高解析度的紙張紋理
- 墨跡筆刷素材
- 燭火動畫素材
- 陰影剪影素材

---

**重要**：所有 UI 元件和視覺效果都必須符合這份風格指南，保持整體的古典、神秘、莊重氛圍。
