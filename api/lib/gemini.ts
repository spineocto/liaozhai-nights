/**
 * Gemini API 呼叫包裝函式
 * Gemini API call wrapper with retry logic
 */

import { getGeminiModel } from './geminiClient';

/**
 * 重試延遲時間（毫秒）
 * Retry delays in milliseconds: 2s, 5s, 15s
 */
const RETRY_DELAYS = [2000, 5000, 15000];

/**
 * 請求超時時間（20 秒）
 * Request timeout in milliseconds
 */
const REQUEST_TIMEOUT = 20000;

/**
 * Gemini API 錯誤類型
 */
export interface GeminiError extends Error {
  status?: number;
  statusText?: string;
}

/**
 * 帶重試邏輯的 Gemini API 呼叫
 * Call Gemini API with retry logic for 429 and 5xx errors
 * 
 * @param prompt - 要發送給 Gemini 的 prompt
 * @param config - 可選的生成設定
 * @returns Gemini 的回應文字
 */
export async function callGeminiWithRetry(
  prompt: string,
  config?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string> {
  const model = getGeminiModel();
  
  let lastError: GeminiError | null = null;
  
  // 嘗試原始請求 + 最多 3 次重試
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      // 使用 Promise.race 實現超時
      const result = await Promise.race([
        model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: config?.temperature ?? 0.7,
            maxOutputTokens: config?.maxOutputTokens ?? 2048,
          },
        }),
        // 超時 Promise
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`));
          }, REQUEST_TIMEOUT);
        }),
      ]);

      // 成功獲取回應
      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }
      
      return text;
      
    } catch (error: any) {
      lastError = error as GeminiError;
      
      // 檢查是否為可重試的錯誤
      const isRetryableError = 
        error.message?.includes('timeout') ||
        error.status === 429 || // Too Many Requests
        (error.status && error.status >= 500 && error.status < 600); // 5xx errors
      
      // 如果不是可重試的錯誤，或已達最大重試次數，直接拋出
      if (!isRetryableError || attempt === RETRY_DELAYS.length) {
        throw lastError;
      }
      
      // 等待後重試
      const delay = RETRY_DELAYS[attempt];
      console.warn(
        `Gemini API call failed (attempt ${attempt + 1}/${RETRY_DELAYS.length + 1}). ` +
        `Retrying in ${delay}ms... Error: ${error.message}`
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // 理論上不會到這裡，但為了型別安全
  throw lastError || new Error('Gemini API call failed after all retries');
}

/**
 * 呼叫 Gemini 並解析 JSON 回應
 * Call Gemini and parse JSON response
 * 
 * @param prompt - 要發送給 Gemini 的 prompt
 * @param config - 可選的生成設定
 * @returns 解析後的 JSON 物件
 */
export async function callGeminiForJSON<T = any>(
  prompt: string,
  config?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<T> {
  const responseText = await callGeminiWithRetry(prompt, config);
  
  try {
    // 嘗試找到 JSON 區塊（有時 Gemini 會在 ```json 標記中返回）
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                      responseText.match(/\{[\s\S]*\}/);
    
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    
    return JSON.parse(jsonText.trim());
  } catch (error) {
    throw new Error(
      `Failed to parse Gemini response as JSON. Response: ${responseText.substring(0, 200)}...`
    );
  }
}
