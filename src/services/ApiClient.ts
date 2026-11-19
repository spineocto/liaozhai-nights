/**
 * API Client Service
 * API 客戶端服務
 * 
 * Handles API calls to backend serverless functions
 * 處理對後端 serverless functions 的 API 呼叫
 */

import type { StoryRequest, StoryResponse, ErrorState } from '../types/api';
import type { Scene } from '../types/story';

/**
 * 重試延遲（毫秒）
 */
const RETRY_DELAYS = [1000, 2000, 5000];

/**
 * 請求超時（毫秒）
 */
const REQUEST_TIMEOUT = 30000; // 30 秒

/**
 * 呼叫故事 API
 * 
 * @param request - 故事請求
 * @returns 場景資料
 */
export async function fetchStory(request: StoryRequest): Promise<{
  scene: Scene;
  isFallback?: boolean;
  error?: ErrorState;
}> {
  let lastError: Error | null = null;

  // 嘗試原始請求 + 最多 3 次重試
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: StoryResponse = await response.json();

      if (!data.success && !data.isFallback) {
        throw new Error(data.error || 'Story generation failed');
      }

      return {
        scene: data.scene,
        isFallback: data.isFallback,
      };
    } catch (error: any) {
      lastError = error;

      // 檢查是否為可重試的錯誤
      const isRetryableError =
        error.name === 'AbortError' || // 超時
        error.message?.includes('network') ||
        error.message?.includes('fetch');

      // 如果不可重試或已達最大重試次數
      if (!isRetryableError || attempt === RETRY_DELAYS.length) {
        break;
      }

      // 等待後重試
      const delay = RETRY_DELAYS[attempt];
      console.warn(
        `Story API call failed (attempt ${attempt + 1}/${RETRY_DELAYS.length + 1}). ` +
          `Retrying in ${delay}ms... Error: ${error.message}`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // 所有重試都失敗，返回錯誤
  const errorState: ErrorState = {
    message: lastError?.message || 'Failed to fetch story',
    type: lastError?.name === 'AbortError' ? 'network' : 'api',
    retryable: true,
    timestamp: Date.now(),
  };

  throw errorState;
}

/**
 * 建立錯誤狀態物件
 * 
 * @param error - 錯誤物件
 * @returns 錯誤狀態
 */
export function createErrorState(error: any): ErrorState {
  if (error.type && error.message && error.timestamp) {
    return error as ErrorState;
  }

  return {
    message: error?.message || 'An unknown error occurred',
    type: 'unknown',
    retryable: true,
    timestamp: Date.now(),
  };
}
