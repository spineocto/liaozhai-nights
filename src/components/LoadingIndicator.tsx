/**
 * Loading Indicator Component
 * 載入指示器元件
 */

import './LoadingIndicator.css';

export function LoadingIndicator() {
  return (
    <div className="loading-container">
      <div className="candle-flame"></div>
      <p className="loading-text-zh">故事生成中...</p>
      <p className="loading-text-en">Generating story...</p>
    </div>
  );
}
