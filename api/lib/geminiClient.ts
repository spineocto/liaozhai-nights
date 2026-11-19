/**
 * Gemini AI Client
 * Gemini AI 客戶端
 * 
 * This module provides a configured Gemini AI client for backend use only.
 * 此模組提供已設定的 Gemini AI 客戶端，僅供後端使用。
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { getGeminiApiKey, ensureServerSide } from './env'

/**
 * Initialize and return a configured Gemini AI client
 * 初始化並返回已設定的 Gemini AI 客戶端
 * 
 * @returns Configured GoogleGenerativeAI instance
 */
export function getGeminiClient(): GoogleGenerativeAI {
  ensureServerSide()
  const apiKey = getGeminiApiKey()
  return new GoogleGenerativeAI(apiKey)
}

/**
 * Get a specific Gemini model
 * 取得特定的 Gemini 模型
 * 
 * @param modelName - The model to use (default: gemini-3.5-flash-lite)
 * @returns Configured generative model instance
 */
export function getGeminiModel(modelName: string = 'gemini-3.5-flash-lite') {
  const genAI = getGeminiClient()
  return genAI.getGenerativeModel({ model: modelName })
}
