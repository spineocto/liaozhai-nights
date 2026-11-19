/**
 * 故事引擎核心型別定義
 * Core type definitions for the story engine
 */

/**
 * 生物類型列舉
 * Creature types that can be encountered in the story
 */
export enum CreatureType {
  FOX_SPIRIT = 'fox-spirit',
  PAINTED_SKIN = 'painted-skin',
  JIANGSHI = 'jiangshi',
}

/**
 * 場景類型列舉
 * Scene types in the narrative
 */
export enum SceneType {
  NARRATIVE = 'narrative', // 敘事場景，包含選擇
  ENDING = 'ending', // 結局場景，包含文言文
}

/**
 * 選擇選項介面
 * Player choice option
 */
export interface Choice {
  id: string;
  text: string; // 選擇的文字描述
  nextSceneId: string; // 選擇後進入的場景 ID
}

/**
 * 翻譯介面
 * Translation for a sentence or text segment
 */
export interface Translation {
  original: string; // 原始文言文句子
  modernChinese: string; // 現代中文翻譯
  english: string; // 英文翻譯
}

/**
 * 場景介面
 * Represents a single scene in the story
 */
export interface Scene {
  id: string;
  type: SceneType;
  content: string; // 敘事文字（用於 narrative 類型）

  // Narrative 場景欄位
  choices?: Choice[]; // 恰好 3 個選擇（僅用於 narrative 類型）

  // Ending 場景欄位
  classicalText?: string; // 文言文結局故事（僅用於 ending 類型）
  modernChinese?: string; // 現代中文翻譯（僅用於 ending 類型）
  englishTranslation?: string; // 英文翻譯（僅用於 ending 類型）

  // 遭遇的生物類型（可選）
  creatureType?: CreatureType;
}

/**
 * 故事狀態介面
 * Represents the current state of the story
 */
export interface StoryState {
  currentSceneId: string; // 當前場景 ID
  choiceHistory: string[]; // 已做出的選擇 ID 歷史記錄
  creatureEncountered?: CreatureType; // 本次遊玩遭遇的生物類型（只能設定一次）
  isComplete: boolean; // 故事是否已完成（到達結局）
  startTime: number; // 遊戲開始時間（timestamp）
}
