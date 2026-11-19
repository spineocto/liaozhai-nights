/**
 * Story Engine
 * 故事引擎
 * 
 * Manages narrative state, choice logic, and story progression
 * 管理敘事狀態、選擇邏輯和故事進展
 */

import type { Scene, StoryState, CreatureType } from '../types/story';

/**
 * 故事引擎類別
 */
export class StoryEngine {
  private state: StoryState;
  private currentScene: Scene | null = null;

  constructor(initialState?: StoryState) {
    this.state = initialState || this.createInitialState();
  }

  /**
   * 建立初始故事狀態
   */
  private createInitialState(): StoryState {
    return {
      currentSceneId: 'opening',
      choiceHistory: [],
      isComplete: false,
      startTime: Date.now(),
    };
  }

  /**
   * 獲取當前狀態
   */
  getState(): StoryState {
    return { ...this.state };
  }

  /**
   * 設定當前場景
   */
  setCurrentScene(scene: Scene): void {
    this.currentScene = scene;
    this.state.currentSceneId = scene.id;

    // 如果場景包含生物類型，且尚未遭遇過生物，則設定
    if (scene.creatureType && !this.state.creatureEncountered) {
      this.state.creatureEncountered = scene.creatureType;
    }

    // 如果是結局場景，標記為完成
    if (scene.type === 'ending') {
      this.state.isComplete = true;
    }
  }

  /**
   * 獲取當前場景
   */
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * 處理玩家選擇
   * 
   * @param choiceId - 玩家選擇的 ID
   * @returns 選擇是否有效
   */
  handleChoice(choiceId: string): boolean {
    if (!this.currentScene) {
      console.error('No current scene');
      return false;
    }

    if (this.state.isComplete) {
      console.warn('Story is already complete');
      return false;
    }

    if (this.currentScene.type !== 'narrative') {
      console.error('Cannot make choices in non-narrative scenes');
      return false;
    }

    const choice = this.currentScene.choices?.find(c => c.id === choiceId);
    if (!choice) {
      console.error(`Choice ${choiceId} not found in current scene`);
      return false;
    }

    // 記錄選擇
    this.state.choiceHistory.push(choiceId);

    return true;
  }

  /**
   * 轉換到指定場景
   * 
   * @param scene - 目標場景
   */
  transitionToScene(scene: Scene): void {
    this.setCurrentScene(scene);
  }

  /**
   * 檢查遊戲是否完成
   */
  isGameComplete(): boolean {
    return this.state.isComplete;
  }

  /**
   * 獲取已遭遇的生物類型
   */
  getCreatureEncountered(): CreatureType | undefined {
    return this.state.creatureEncountered;
  }

  /**
   * 重置遊戲
   */
  reset(): void {
    this.state = this.createInitialState();
    this.currentScene = null;
  }

  /**
   * 從狀態物件恢復故事引擎
   * 
   * @param state - 要恢復的狀態
   * @param currentScene - 當前場景（可選）
   */
  static restore(state: StoryState, currentScene?: Scene): StoryEngine {
    const engine = new StoryEngine(state);
    if (currentScene) {
      engine.currentScene = currentScene;
    }
    return engine;
  }
}
