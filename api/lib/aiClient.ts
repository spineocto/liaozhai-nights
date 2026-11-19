/**
 * AI Client - 統一的 AI 呼叫介面
 * 支援多個 AI 提供商：Gemini、OpenAI 格式
 */

import { getGeminiModel } from './geminiClient';

/**
 * AI 提供商類型
 */
export type AIProvider = 'gemini' | 'openai';

/**
 * AI 回應配置
 */
interface AIConfig {
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * 重試延遲（毫秒）
 */
const RETRY_DELAYS = [2000, 5000, 15000];

/**
 * 請求超時（毫秒）
 */
const REQUEST_TIMEOUT = 20000;

/**
 * 獲取當前使用的 AI 提供商
 */
function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'gemini';
  return provider as AIProvider;
}

/**
 * 呼叫 Gemini API
 */
async function callGemini(prompt: string, config?: AIConfig): Promise<string> {
  const model = getGeminiModel();
  
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: config?.temperature ?? 0.7,
      maxOutputTokens: config?.maxOutputTokens ?? 2048,
    },
  });

  const response = await result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }
  
  return text;
}

/**
 * 呼叫 OpenAI 格式的 API
 */
async function callOpenAI(prompt: string, config?: AIConfig): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: config?.temperature ?? 0.7,
      max_tokens: config?.maxOutputTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from OpenAI API');
  }

  return text;
}

/**
 * 統一的 AI 呼叫函式（帶重試邏輯）
 */
export async function callAI(
  prompt: string,
  config?: AIConfig
): Promise<string> {
  const provider = getAIProvider();
  let lastError: Error | null = null;

  console.log(`Using AI provider: ${provider}`);

  // 嘗試原始請求 + 最多 3 次重試
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      // 使用 Promise.race 實現超時
      const result = await Promise.race([
        provider === 'openai' 
          ? callOpenAI(prompt, config)
          : callGemini(prompt, config),
        // 超時 Promise
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`));
          }, REQUEST_TIMEOUT);
        }),
      ]);

      return result;
      
    } catch (error: any) {
      lastError = error;
      
      // 檢查是否為可重試的錯誤
      const isRetryableError = 
        error.message?.includes('timeout') ||
        error.message?.includes('429') ||
        error.message?.includes('500') ||
        error.message?.includes('502') ||
        error.message?.includes('503');
      
      // 如果不是可重試的錯誤，或已達最大重試次數，直接拋出
      if (!isRetryableError || attempt === RETRY_DELAYS.length) {
        throw lastError;
      }
      
      // 等待後重試
      const delay = RETRY_DELAYS[attempt];
      console.warn(
        `AI API call failed (attempt ${attempt + 1}/${RETRY_DELAYS.length + 1}). ` +
        `Retrying in ${delay}ms... Error: ${error.message}`
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('AI API call failed after all retries');
}

/**
 * 呼叫 AI 並解析 JSON 回應
 */
export async function callAIForJSON<T = any>(
  prompt: string,
  config?: AIConfig
): Promise<T> {
  const responseText = await callAI(prompt, config);
  
  try {
    // 嘗試找到 JSON 區塊
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                      responseText.match(/\{[\s\S]*\}/);
    
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    
    return JSON.parse(jsonText.trim());
  } catch (error) {
    throw new Error(
      `Failed to parse AI response as JSON. Response: ${responseText.substring(0, 200)}...`
    );
  }
}
