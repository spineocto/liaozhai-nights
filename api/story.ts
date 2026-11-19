/**
 * Story API Endpoint
 * 故事生成 API 端點
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { StoryRequest, StoryResponse } from '../src/types/api';
import type { Scene, SceneType } from '../src/types/story';
import { callAIForJSON } from './lib/aiClient';

function validateRequest(body: any): body is StoryRequest {
  if (!body) return false;
  if (!Array.isArray(body.choiceHistory)) return false;
  return true;
}

function buildStoryPrompt(request: StoryRequest): string {
  const isFirstScene = !request.currentSceneId;
  
  if (isFirstScene) {
    return `You are a storyteller for "Liaozhai Nights" (聊齋夜話), an interactive Chinese ghost story.

Generate the opening scene where a young scholar travels to the imperial examination. Create an atmospheric, slightly eerie beginning.

Return ONLY valid JSON in this exact format:
{
  "id": "scene_1",
  "type": "narrative",
  "content": "場景描述（繁體中文，3-4 句話）",
  "choices": [
    { "id": "choice_1_1", "text": "選擇文字", "nextSceneId": "scene_2" },
    { "id": "choice_1_2", "text": "選擇文字", "nextSceneId": "scene_3" },
    { "id": "choice_1_3", "text": "選擇文字", "nextSceneId": "scene_4" }
  ]
}`;
  }
  
  const choiceCount = request.choiceHistory.length;
  const isNearEnding = choiceCount >= 4;
  
  if (isNearEnding) {
    const creatureType = request.creatureEncountered || 'fox-spirit';
    
    return `Generate an ending for the Liaozhai ghost story. The scholar encountered a ${creatureType}.

Write a classical Chinese-style ending tale (文言文).

Return ONLY valid JSON:
{
  "id": "ending_${choiceCount}",
  "type": "ending",
  "content": "簡短總結",
  "classicalText": "文言文結局故事（3-5 句）",
  "modernChinese": "現代中文翻譯",
  "englishTranslation": "English translation",
  "creatureType": "${creatureType}"
}`;
  }
  
  return `Continue the Liaozhai ghost story. Previous choices: ${choiceCount}
${request.creatureEncountered ? `Creature: ${request.creatureEncountered}` : 'Introduce a supernatural creature (fox-spirit, painted-skin, or jiangshi)'}

Return ONLY valid JSON:
{
  "id": "scene_${choiceCount + 1}",
  "type": "narrative",
  "content": "場景描述（繁體中文）",
  "choices": [
    { "id": "choice_${choiceCount + 1}_1", "text": "選擇文字", "nextSceneId": "scene_${choiceCount + 2}" },
    { "id": "choice_${choiceCount + 1}_2", "text": "選擇文字", "nextSceneId": "scene_${choiceCount + 3}" },
    { "id": "choice_${choiceCount + 1}_3", "text": "選擇文字", "nextSceneId": "scene_${choiceCount + 4}" }
  ]${!request.creatureEncountered ? ',\n  "creatureType": "fox-spirit" or "painted-skin" or "jiangshi"' : ''}
}`;
}

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
  
  return {
    id: 'fallback_ending',
    type: 'ending' as SceneType,
    content: '故事在此告一段落...',
    classicalText: '書生遇異，驚懼而返。後科舉得中，常念此事，終生不敢夜行。',
    modernChinese: '書生遇到了奇異的事情，驚恐地返回。後來科舉考試得中，常常想起這件事，一生都不敢夜間行走。',
    englishTranslation: 'The scholar encountered something strange and returned in fear. Later, he passed the examination, but never dared to travel at night again.',
    creatureType: request.creatureEncountered,
  };
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
    } as StoryResponse);
    return;
  }
  
  const request: StoryRequest = req.body;
  
  try {
    const prompt = buildStoryPrompt(request);
    const scene = await callAIForJSON<Scene>(prompt, {
      temperature: 0.8,
      maxOutputTokens: 1024,
    });
    
    if (!scene.id || !scene.type || !scene.content) {
      throw new Error('Invalid scene format from AI');
    }
    
    const response: StoryResponse = {
      scene,
      success: true,
    };
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Story generation error:', error);
    
    const fallbackScene = getFallbackScene(request);
    
    const response: StoryResponse = {
      scene: fallbackScene,
      success: true,
      isFallback: true,
    };
    
    res.status(200).json(response);
  }
}
