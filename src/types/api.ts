/**
 * API 請求與回應型別定義
 * API request and response type definitions
 */

import type { Scene, CreatureType } from './story';

/**
 * 故事 API 請求
 * Request to generate a new scene or continuation
 */
export interface StoryRequest {
  currentSceneId?: string; // 當前場景 ID（首次請求時為 undefined）
  choiceId?: string; // 玩家選擇的 ID（首次請求時為 undefined）
  creatureEncountered?: CreatureType; // 已遭遇的生物類型（確保一致性）
  choiceHistory: string[]; // 選擇歷史記錄
}

/**
 * 故事 API 回應
 * Response containing the next scene
 */
export interface StoryResponse {
  scene: Scene; // 下一個場景
  success: boolean; // 請求是否成功
  error?: string; // 錯誤訊息（如果有）
  isFallback?: boolean; // 是否為備用場景（當 AI 失敗時）
}

/**
 * 翻譯 API 請求
 * Request to translate a sentence
 */
export interface TranslateRequest {
  sentence: string; // 要翻譯的文言文句子
  context?: string; // 上下文（可選，幫助提供更準確的翻譯）
}

/**
 * 翻譯 API 回應
 * Response containing translations
 */
export interface TranslateResponse {
  original: string; // 原始文言文句子
  modernChinese: string; // 現代中文翻譯
  english: string; // 英文翻譯
  success: boolean; // 請求是否成功
  error?: string; // 錯誤訊息（如果有）
}

/**
 * 錯誤狀態型別
 * Error state for UI display
 */
export interface ErrorState {
  message: string; // 錯誤訊息
  type: 'network' | 'api' | 'validation' | 'quota' | 'unknown'; // 錯誤類型
  retryable: boolean; // 是否可以重試
  timestamp: number; // 錯誤發生時間
}
