/**
 * Translation Service
 * 翻譯服務
 * 
 * Manages translation requests and caching
 * 管理翻譯請求與快取
 */

import type { Translation } from '../types/story';
import type { TranslateRequest, TranslateResponse } from '../types/api';
import { getCachedTranslation, cacheTranslation } from './StorageService';

/**
 * 獲取句子的翻譯（優先使用快取）
 * 
 * @param sentence - 要翻譯的句子
 * @param context - 上下文（可選）
 * @returns 翻譯結果
 */
export async function getTranslation(
  sentence: string,
  context?: string
): Promise<Translation | null> {
  // 先檢查快取
  const cached = getCachedTranslation(sentence);
  if (cached) {
    console.log('Translation cache hit:', sentence);
    return cached;
  }

  // 快取未命中，呼叫 API
  console.log('Translation cache miss, calling API:', sentence);
  
  try {
    const request: TranslateRequest = {
      sentence,
      context,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: TranslateResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Translation failed');
    }

    // 儲存到快取
    const translation: Translation = {
      original: data.original,
      modernChinese: data.modernChinese,
      english: data.english,
    };

    cacheTranslation(sentence, translation);

    return translation;
  } catch (error: any) {
    console.error('Translation error:', error);
    return null;
  }
}

/**
 * 分割文言文為句子
 * 
 * @param text - 文言文文字
 * @returns 句子陣列
 */
export function splitIntoSentences(text: string): string[] {
  // 按句號、問號、驚嘆號分割
  const sentences = text
    .split(/([。！？])/)
    .reduce((acc: string[], part, index, array) => {
      // 將標點符號附加到前一個句子
      if (index % 2 === 0 && part.trim()) {
        const punctuation = array[index + 1] || '';
        acc.push(part + punctuation);
      }
      return acc;
    }, [])
    .filter(s => s.trim().length > 0);

  return sentences;
}
