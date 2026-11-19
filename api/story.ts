/**
 * Story API Endpoint
 * 故事生成 API 端點
 * 
 * Generates narrative scenes and endings using Gemini AI
 * 使用 Gemini AI 生成敘事場景和結局
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { StoryRequest, StoryResponse } from '../src/types/api';
import type { Scene, SceneType } from '../src/types/story';
import { callGeminiForJSON } from './lib/gemini';

/**
 * 驗證請求格式
 */
function validateRequest(body: any): body is StoryRequest {
  if (!body) return false;
  if (!Array.isArray(body.choiceHistory)) return false;
  
  return true;
}

/**
 * 根據故事狀態構建 Gemini prompt
 */
function buildStoryPrompt(request: StoryRequest): string {
  const isFirstScene = !request.currentSceneId;
  
  if (isFirstScene) {
    // 開場場景
    return `You are a storyteller for "Liaozhai Nights" (聊齋夜話), an interactive Chinese ghost story inspired by Pu Songling's Strange Tales from a Chinese Studio.

Generate the opening scene where a young scholar is traveling to the imperial examination. The scene should:
- Be atmospheric and set in ancient China
- Hint at supernatural elements
- End with exactly 3 choices for the player
- Be written in narrative style suitable for a classical Chinese tale

Return your response as JSON with this structure:
{
  "id": "scene_1",
  "type": "narrative",
  "content": "The narrative text in Traditional Chinese",
  "choices": [
    { "id": "choice_1_1", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_2" },
    { "id": "choice_1_2", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_3" },
    { "id": "choice_1_3", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_4" }
  ]
}

Important: Return ONLY the JSON, no additional text.`;
  }
  
  // 後續場景
  const choiceCount = request.choiceHistory.length;
  const isNearEnding = choiceCount >= 4;
  
  if (isNearEnding) {
    // 生成結局
    const creatureType = request.creatureEncountered || 'fox-spirit';
    
    return `You are a storyteller for "Liaozhai Nights". Generate an ending for the story.

The scholar encountered a ${creatureType} during their journey. Create a classical Chinese-style ending tale (文言文).

Return your response as JSON with this structure:
{
  "id": "ending_${choiceCount}",
  "type": "ending",
  "content": "Brief summary in modern Chinese",
  "classicalText": "The ending tale written in classical Chinese style (文言文)",
  "modernChinese": "Modern Chinese translation of the classical text",
  "englishTranslation": "English translation of the story",
  "creatureType": "${creatureType}"
}

The classicalText should be 3-5 sentences in classical Chinese style, inspired by Pu Songling's work.
Important: Return ONLY the JSON, no additional text.`;
  }
  
  // 中間場景
  return `You are a storyteller for "Liaozhai Nights". Continue the story.

Previous choices made: ${request.choiceHistory.length}
${request.creatureEncountered ? `Creature encountered: ${request.creatureEncountered}` : 'No creature encountered yet (introduce one in this scene if appropriate)'}

Generate the next narrative scene with exactly 3 choices.

Return your response as JSON with this structure:
{
  "id": "scene_${choiceCount + 1}",
  "type": "narrative",
  "content": "The narrative text in Traditional Chinese",
  "choices": [
    { "id": "choice_${choiceCount + 1}_1", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_${choiceCount + 2}" },
    { "id": "choice_${choiceCount + 1}_2", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_${choiceCount + 3}" },
    { "id": "choice_${choiceCount + 1}_3", "text": "Choice text in Traditional Chinese", "nextSceneId": "scene_${choiceCount + 4}" }
  ]${!request.creatureEncountered ? ',\n  "creatureType": "fox-spirit" or "painted-skin" or "jiangshi" (pick one randomly)' : ''}
}

Important: Return ONLY the JSON, no additional text.`;
}

/**
 * 獲取備用場景（當 AI 失敗時）
 */
function getFallbackScene(request: StoryRequest): Scene {
  const isFirstScene = !request.currentSceneId;
  
  if (isFirstScene) {
    return {
      id: 'fallback_opening',
      type: 'narrative' as SceneType,
      content: '月色朦朧，秋風蕭瑟。你是一位趕考的書生，行走在荒涼的山道上。忽然間，前方傳來若有若無的歌聲...',
      choices: [
        { id: 'fallback_1_1', text: '循聲前往，一探究竟', nextSceneId: 'scene_2' },
        { id: 'fallback_1_2', text: '加快腳步，繼續趕路', nextSceneId: 'scene_3' },
        { id: 'fallback_1_3', text: '在原地休息片刻', nextSceneId: 'scene_4' },
      ],
    };
  }
  
  // 備用結局
  return {
    id: 'fallback_ending',
    type: 'ending' as SceneType,
    content: '故事在此告一段落...',
    classicalText: '書生遇異，驚懼而返。後科舉得中，常念此事，終生不敢夜行。異史氏曰：人鬼殊途，各安其命，此乃天理也。',
    modernChinese: '書生遇到了奇異的事情，驚恐地返回。後來科舉考試得中，常常想起這件事，一生都不敢夜間行走。評論者說：人和鬼是不同的道路，各自安於命運，這是天理。',
    englishTranslation: 'The scholar encountered something strange and returned in fear. Later, he passed the imperial examination, but often remembered this event and never dared to travel at night again. The chronicler says: humans and ghosts walk different paths, each content with their fate - this is the natural order.',
    creatureType: request.creatureEncountered,
  };
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
      error: 'Invalid request format. Required: { choiceHistory: string[] }' 
    } as StoryResponse);
    return;
  }
  
  const request: StoryRequest = req.body;
  
  try {
    // 構建 prompt 並呼叫 Gemini
    const prompt = buildStoryPrompt(request);
    const scene = await callGeminiForJSON<Scene>(prompt, {
      temperature: 0.8, // 較高的創意性
      maxOutputTokens: 1024,
    });
    
    // 驗證回應格式
    if (!scene.id || !scene.type || !scene.content) {
      throw new Error('Invalid scene format from Gemini');
    }
    
    // 成功回應
    const response: StoryResponse = {
      scene,
      success: true,
    };
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Story generation error:', error);
    
    // 使用備用場景
    const fallbackScene = getFallbackScene(request);
    
    const response: StoryResponse = {
      scene: fallbackScene,
      success: true,
      isFallback: true,
    };
    
    res.status(200).json(response);
  }
}
