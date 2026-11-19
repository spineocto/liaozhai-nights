/**
 * Ending View Component
 * 結局檢視元件
 * 
 * Displays classical Chinese ending with translations
 * 顯示文言文結局與翻譯
 */

import { useState } from 'react';
import type { Scene } from '../types/story';
import { splitIntoSentences } from '../services/TranslationService';
import './EndingView.css';

interface EndingViewProps {
  scene: Scene;
  onRestart: () => void;
}

export function EndingView({ scene, onRestart }: EndingViewProps) {
  const [selectedSentence, setSelectedSentence] = useState<string | null>(null);

  if (!scene.classicalText) {
    return null;
  }

  const sentences = splitIntoSentences(scene.classicalText);

  const handleSentenceClick = (sentence: string) => {
    if (selectedSentence === sentence) {
      setSelectedSentence(null);
    } else {
      setSelectedSentence(sentence);
    }
  };

  return (
    <div className="ending-view">
      <h2 className="ending-title">
        <span className="ending-title-zh">結局</span>
        <span className="ending-title-en">Ending</span>
      </h2>

      {/* 文言文文字 */}
      <div className="classical-text">
        {sentences.map((sentence, index) => (
          <span
            key={index}
            className={`classical-sentence ${selectedSentence === sentence ? 'selected' : ''}`}
            onClick={() => handleSentenceClick(sentence)}
          >
            {sentence}
          </span>
        ))}
        
        <p className="tap-hint">（點擊句子查看翻譯 / Tap sentences for translation）</p>
      </div>

      {/* 翻譯覆蓋層 */}
      {selectedSentence && (
        <div className="translation-overlay">
          <div className="translation-content">
            <button
              className="close-button"
              onClick={() => setSelectedSentence(null)}
            >
              ✕
            </button>
            
            <div className="translation-section">
              <h4 className="translation-label">現代中文</h4>
              <p className="translation-text">{scene.modernChinese}</p>
            </div>
            
            <div className="translation-section">
              <h4 className="translation-label">English</h4>
              <p className="translation-text">{scene.englishTranslation}</p>
            </div>
          </div>
        </div>
      )}

      {/* 完整翻譯（始終可見） */}
      <div className="full-translations">
        <div className="translation-block">
          <h3 className="translation-heading">現代中文 Modern Chinese</h3>
          <p className="translation-body">{scene.modernChinese}</p>
        </div>
        
        <div className="translation-block">
          <h3 className="translation-heading">English Translation</h3>
          <p className="translation-body">{scene.englishTranslation}</p>
        </div>
      </div>

      {/* 重新開始按鈕 */}
      <div className="restart-container">
        <button className="restart-button" onClick={onRestart}>
          <span className="button-text-zh">重新開始</span>
          <span className="button-text-en">Start New Story</span>
        </button>
      </div>
    </div>
  );
}
