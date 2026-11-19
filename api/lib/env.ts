/**
 * Environment variable utilities
 * 環境變數工具函式
 * 
 * This module provides utilities for safely reading and validating
 * environment variables, particularly API keys.
 * 此模組提供安全讀取和驗證環境變數的工具，特別是 API 金鑰。
 */

/**
 * Get the Gemini API key from environment variables
 * 從環境變數取得 Gemini API 金鑰
 * 
 * @returns The API key string
 * @throws Error if the API key is not set or is invalid
 */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set in environment variables. ' +
      'Please set it in your Vercel project settings or .env file.'
    )
  }

  if (apiKey === 'your-gemini-api-key-here') {
    throw new Error(
      'GEMINI_API_KEY has not been replaced with a real API key. ' +
      'Please update your environment variables.'
    )
  }

  if (apiKey.length < 20) {
    throw new Error(
      'GEMINI_API_KEY appears to be invalid (too short). ' +
      'Please check your API key.'
    )
  }

  return apiKey
}

/**
 * Check if environment is properly configured
 * 檢查環境是否正確設定
 * 
 * @returns Object with configuration status
 */
export function checkEnvironment(): {
  isConfigured: boolean
  error?: string
} {
  try {
    getGeminiApiKey()
    return { isConfigured: true }
  } catch (error) {
    return {
      isConfigured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Validate that we're running in a server environment
 * 驗證我們正在伺服器環境中執行
 * 
 * This prevents API keys from being exposed in browser code
 * 這可以防止 API 金鑰在瀏覽器程式碼中暴露
 */
export function ensureServerSide(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'This code must only run on the server side. ' +
      'API keys should never be exposed to the browser.'
    )
  }
}
