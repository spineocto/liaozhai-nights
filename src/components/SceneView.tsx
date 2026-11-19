/**
 * Scene View Component
 * 場景檢視元件
 * 
 * Displays narrative scenes with choices
 * 顯示敘事場景與選擇
 */

import type { Scene } from '../types/story';
import './SceneView.css';

interface SceneViewProps {
  scene: Scene;
  onChoice: (choiceId: string) => void;
}

export function SceneView({ scene, onChoice }: SceneViewProps) {
  return (
    <div className="scene-view">
      {/* 敘事文字 */}
      <div className="narrative-text">
        {scene.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="narrative-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      {/* 選擇按鈕 */}
      {scene.choices && scene.choices.length > 0 && (
        <div className="choice-buttons">
          {scene.choices.map((choice, index) => (
            <button
              key={choice.id}
              className="choice-button"
              onClick={() => onChoice(choice.id)}
            >
              <span className="choice-number">{index + 1}.</span>
              <span className="choice-text">{choice.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
