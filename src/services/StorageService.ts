/**
 * Storage Service
 * 儲存服務
 * 
 * Manages story state persistence using sessionStorage
 * 使用 sessionStorage 管理故事狀態持久化
 */

import type { StoryState } from '../types/story';
import type { Translation } from '../types/story';

const STORY_STATE_KEY = 'liaozhai_story_state';
const TRANSLATION_CACHE_KEY = 'liaozhai_translation_cache';

/**
 * 翻譯快取型別
 */
type TranslationCache = Record<string, Translation>;

/**
 * 儲存故事狀態到 sessionStorage
 * 
 * @param state - 要儲存的故事狀態
 */
export function saveStoryState(state: StoryState): boolean {
  try {
    const json = JSON.stringify(state);
    sessionStorage.setItem(STORY_STATE_KEY, json);
    return true;
  } catch (error: any) {
    // 處理 QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      console.error('SessionStorage quota exceeded');
      // 嘗試清除翻譯快取後再試一次
      clearTranslationCache();
      try {
        const json = JSON.stringify(state);
        sessionStorage.setItem(STORY_STATE_KEY, json);
        return true;
      } catch (retryError) {
        console.error('Failed to save story state after clearing cache:', retryError);
        return false;
      }
    }
    console.error('Failed to save story state:', error);
    return false;
  }
}

/**
 * 從 sessionStorage 載入故事狀態
 * 
 * @returns 儲存的故事狀態，如果不存在則返回 null
 */
export function loadStoryState(): StoryState | null {
  try {
    const json = sessionStorage.getItem(STORY_STATE_KEY);
    if (!json) {
      return null;
    }
    return JSON.parse(json) as StoryState;
  } catch (error) {
    console.error('Failed to load story state:', error);
    return null;
  }
}

/**
 * 清除儲存的故事狀態
 */
export function clearStoryState(): void {
  try {
    sessionStorage.removeItem(STORY_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear story state:', error);
  }
}

/**
 * 儲存翻譯到快取
 * 
 * @param sentence - 原始句子
 * @param translation - 翻譯內容
 */
export function cacheTranslation(sentence: string, translation: Translation): boolean {
  try {
    const cache = loadTranslationCache();
    cache[sentence] = translation;
    
    const json = JSON.stringify(cache);
    sessionStorage.setItem(TRANSLATION_CACHE_KEY, json);
    return true;
  } catch (error: any) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Translation cache quota exceeded, clearing old entries');
      // 清除快取並只保存這一個翻譯
      const newCache: TranslationCache = { [sentence]: translation };
      try {
        sessionStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(newCache));
        return true;
      } catch {
        return false;
      }
    }
    console.error('Failed to cache translation:', error);
    return false;
  }
}

/**
 * 從快取獲取翻譯
 * 
 * @param sentence - 原始句子
 * @returns 快取的翻譯，如果不存在則返回 null
 */
export function getCachedTranslation(sentence: string): Translation | null {
  const cache = loadTranslationCache();
  return cache[sentence] || null;
}

/**
 * 載入翻譯快取
 */
function loadTranslationCache(): TranslationCache {
  try {
    const json = sessionStorage.getItem(TRANSLATION_CACHE_KEY);
    if (!json) {
      return {};
    }
    return JSON.parse(json) as TranslationCache;
  } catch (error) {
    console.error('Failed to load translation cache:', error);
    return {};
  }
}

/**
 * 清除翻譯快取
 */
export function clearTranslationCache(): void {
  try {
    sessionStorage.removeItem(TRANSLATION_CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear translation cache:', error);
  }
}

/**
 * 重置所有儲存（用於遊戲重置）
 */
export function resetAllStorage(): void {
  clearStoryState();
  clearTranslationCache();
}
