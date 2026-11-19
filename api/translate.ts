/**
 * Translation API Endpoint
 * 翻譯 API 端點
 * 
 * Translates classical Chinese sentences to modern Chinese and English
 * 將文言文句子翻譯成現代中文和英文
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { TranslateRequest, TranslateResponse } from '../src/types/api';
import { callGeminiForJSON } from './lib/gemini';

/**
 * 驗證請求格式
 */
function validateRequest(body: any): body is TranslateRequest {
  if (!body) return false;
  if (typeof body.sentence !== 'string' || !body.sentence.trim()) return false;
  
  return true;
}

/**
 * 構建翻譯 prompt
 */
function buildTranslationPrompt(sentence: string, context?: string): string {
  return `You are a translator for classical Chinese (文言文) to modern Chinese and English.

Translate the following classical Chinese sentence:
"${sentence}"

${context ? `Context: ${context}\n` : ''}

Return your response as JSON with this structure:
{
  "original": "${sentence}",
  "modernChinese": "Modern Chinese (現代中文) translation",
  "english": "English translation"
}

Guidelines:
- Keep the translation accurate and natural
- Preserve the original meaning and tone
- For modern Chinese, use Traditional Chinese (繁體中文)
- For English, use clear and literary language

Important: Return ONLY the JSON, no additional text.`;
}

/**
 * 主要處理函式
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // 只接受 POST 請求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  // 驗證請求格式
  if (!validateRequest(req.body)) {
    res.status(400).json({ 
      success: false,
      error: 'Invalid request format. Required: { sentence: string, context?: string }' 
    } as TranslateResponse);
    return;
  }
  
  const request: TranslateRequest = req.body;
  
  try {
    // 構建 prompt 並呼叫 Gemini
    const prompt = buildTranslationPrompt(request.sentence, request.context);
    const translation = await callGeminiForJSON<{
      original: string;
      modernChinese: string;
      english: string;
    }>(prompt, {
      temperature: 0.3, // 較低溫度以確保翻譯準確性
      maxOutputTokens: 512,
    });
    
    // 驗證回應格式
    if (!translation.modernChinese || !translation.english) {
      throw new Error('Invalid translation format from Gemini');
    }
    
    // 成功回應
    const response: TranslateResponse = {
      original: request.sentence,
      modernChinese: translation.modernChinese,
      english: translation.english,
      success: true,
    };
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Translation error:', error);
    
    // 錯誤回應
    const response: TranslateResponse = {
      original: request.sentence,
      modernChinese: '',
      english: '',
      success: false,
      error: error.message || 'Translation failed',
    };
    
    res.status(500).json(response);
  }
}
