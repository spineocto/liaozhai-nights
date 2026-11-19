/**
 * Main App Component - Fallback Mode
 * 主應用程式元件 - 備用模式（無需 API）
 */

import { useState, useEffect } from 'react';
import type { Scene } from './types/story';
import { StoryEngine } from './services/StoryEngine';
import { saveStoryState, loadStoryState, resetAllStorage } from './services/StorageService';
import { fallbackOpening, getFallbackEnding } from './data/fallbackScenes';
import { BookContainer } from './components/BookContainer';
import { SceneView } from './components/SceneView';
import { EndingView } from './components/EndingView';
import { LoadingIndicator } from './components/LoadingIndicator';
import './App.css';

type AppState = 'loading' | 'playing' | 'ending';

function App() {
  const [engine] = useState(() => new StoryEngine());
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    initializeGame();
  }, []);

  async function initializeGame() {
    setAppState('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const savedState = loadStoryState();
    
    if (savedState && !savedState.isComplete) {
      // TODO: 恢復已儲存狀態
      startNewGame();
    } else {
      startNewGame();
    }
  }

  function startNewGame() {
    engine.reset();
    const scene = fallbackOpening;
    engine.setCurrentScene(scene);
    setCurrentScene(scene);
    saveStoryState(engine.getState());
    setAppState('playing');
  }

  async function handleChoice(choiceId: string) {
    if (!currentScene) return;

    const success = engine.handleChoice(choiceId);
    if (!success) return;

    setAppState('loading');
    await new Promise(resolve => setTimeout(resolve, 800));

    const state = engine.getState();

    // 4 次選擇後顯示結局
    if (state.choiceHistory.length >= 4) {
      const scene = getFallbackEnding(state.creatureEncountered);
      engine.setCurrentScene(scene);
      setCurrentScene(scene);
      saveStoryState(engine.getState());
      setAppState('ending');
    } else {
      // 繼續顯示開場（簡化版 demo）
      const scene = fallbackOpening;
      engine.setCurrentScene(scene);
      setCurrentScene(scene);
      saveStoryState(engine.getState());
      setAppState('playing');
    }
  }

  function handleRestart() {
    resetAllStorage();
    startNewGame();
  }

  return (
    <BookContainer>
      {appState === 'loading' && <LoadingIndicator />}
      
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
