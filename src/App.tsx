/**
 * Main App Component
 * 主應用程式元件
 * 
 * Orchestrates the entire story experience
 * 協調整個故事體驗
 */

import { useState, useEffect } from 'react';
import type { Scene } from './types/story';
import type { ErrorState } from './types/api';
import { StoryEngine } from './services/StoryEngine';
import { fetchStory, createErrorState } from './services/ApiClient';
import { saveStoryState, loadStoryState, resetAllStorage } from './services/StorageService';
import { fallbackOpening, getFallbackEnding } from './data/fallbackScenes';
import { BookContainer } from './components/BookContainer';
import { SceneView } from './components/SceneView';
import { EndingView } from './components/EndingView';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import './App.css';

type AppState = 'loading' | 'playing' | 'ending' | 'error';

function App() {
  const [engine] = useState(() => new StoryEngine());
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [appState, setAppState] = useState<AppState>('loading');
  const [error, setError] = useState<ErrorState | null>(null);

  // 初始化遊戲
  useEffect(() => {
    initializeGame();
  }, []);

  // 初始化遊戲函式
  async function initializeGame() {
    setAppState('loading');
    setError(null);

    try {
      // 檢查是否有已儲存的狀態
      const savedState = loadStoryState();
      
      if (savedState && !savedState.isComplete) {
        // TODO: 實作從已儲存狀態恢復
        // 目前先開始新遊戲
        await startNewGame();
      } else {
        await startNewGame();
      }
    } catch (err: any) {
      console.error('Game initialization error:', err);
      setError(createErrorState(err));
      setAppState('error');
    }
  }

  // 開始新遊戲
  async function startNewGame() {
    setAppState('loading');
    setError(null);

    try {
      // 重置引擎
      engine.reset();

      // 請求開場場景
      const { scene, isFallback } = await fetchStory({
        choiceHistory: [],
      });

      if (isFallback) {
        console.warn('Using fallback opening scene');
      }

      engine.setCurrentScene(scene);
      setCurrentScene(scene);
      saveStoryState(engine.getState());
      
      setAppState(scene.type === 'ending' ? 'ending' : 'playing');
    } catch (err: any) {
      console.error('Failed to start game:', err);
      setError(createErrorState(err));
      setAppState('error');
    }
  }

  // 處理玩家選擇
  async function handleChoice(choiceId: string) {
    if (!currentScene) return;

    const success = engine.handleChoice(choiceId);
    if (!success) {
      console.error('Failed to handle choice');
      return;
    }

    setAppState('loading');
    setError(null);

    try {
      // 請求下一個場景
      const state = engine.getState();
      const { scene, isFallback } = await fetchStory({
        currentSceneId: currentScene.id,
        choiceId,
        creatureEncountered: state.creatureEncountered,
        choiceHistory: state.choiceHistory,
      });

      if (isFallback) {
        console.warn('Using fallback scene');
      }

      engine.setCurrentScene(scene);
      setCurrentScene(scene);
      saveStoryState(engine.getState());
      
      setAppState(scene.type === 'ending' ? 'ending' : 'playing');
    } catch (err: any) {
      console.error('Failed to fetch next scene:', err);
      setError(createErrorState(err));
      setAppState('error');
    }
  }

  // 重新開始遊戲
  function handleRestart() {
    resetAllStorage();
    startNewGame();
  }

  // 使用備用場景
  function handleUseFallback() {
    setError(null);
    
    const state = engine.getState();
    let scene: Scene;
    
    if (state.choiceHistory.length === 0) {
      // 開場
      scene = fallbackOpening;
    } else {
      // 結局
      scene = getFallbackEnding(state.creatureEncountered);
    }
    
    engine.setCurrentScene(scene);
    setCurrentScene(scene);
    saveStoryState(engine.getState());
    setAppState(scene.type === 'ending' ? 'ending' : 'playing');
  }

  return (
    <BookContainer>
      {appState === 'loading' && <LoadingIndicator />}
      
      {appState === 'error' && error && (
        <ErrorMessage
          error={error}
          onRetry={initializeGame}
          onUseFallback={handleUseFallback}
        />
      )}
      
      {appState === 'playing' && currentScene && (
        <SceneView scene={currentScene} onChoice={handleChoice} />
      )}
      
      {appState === 'ending' && currentScene && (
        <EndingView scene={currentScene} onRestart={handleRestart} />
      )}
    </BookContainer>
  );
}

export default App;
