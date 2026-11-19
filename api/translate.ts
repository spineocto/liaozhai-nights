/**
 * Translation API Endpoint
 * 翻譯 API 端點
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { TranslateRequest, TranslateResponse } from '../src/types/api';
import { callAIForJSON } from './lib/aiClient';

function validateRequest(body: any): body is TranslateRequest {
  if (!body) return false;
  if (typeof body.sentence !== 'string' || !body.sentence.trim()) return false;
  return true;
}

function buildTranslationPrompt(sentence: string, context?: string): string {
  return `Translate this classical Chinese sentence to modern Chinese and English.

Sentence: "${sentence}"
${context ? `Context: ${context}` : ''}

Return ONLY valid JSON:
{
  "original": "${sentence}",
  "modernChinese": "現代中文翻譯（繁體）",
  "english": "English translation"
}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  if (!validateRequest(req.body)) {
    res.status(400).json({ 
      success: false,
      error: 'Invalid request format' 
    } as TranslateResponse);
    return;
  }
  
  const request: TranslateRequest = req.body;
  
  try {
    const prompt = buildTranslationPrompt(request.sentence, request.context);
    const translation = await callAIForJSON<{
      original: string;
      modernChinese: string;
      english: string;
    }>(prompt, {
      temperature: 0.3,
      maxOutputTokens: 512,
    });
    
    if (!translation.modernChinese || !translation.english) {
      throw new Error('Invalid translation format from AI');
    }
    
    const response: TranslateResponse = {
      original: request.sentence,
      modernChinese: translation.modernChinese,
      english: translation.english,
      success: true,
    };
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Translation error:', error);
    
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
