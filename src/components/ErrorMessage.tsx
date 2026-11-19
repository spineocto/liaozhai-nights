/**
 * Error Message Component
 * 錯誤訊息元件
 */

import type { ErrorState } from '../types/api';
import './ErrorMessage.css';

interface ErrorMessageProps {
  error: ErrorState;
  onRetry?: () => void;
  onUseFallback?: () => void;
}

export function ErrorMessage({ error, onRetry, onUseFallback }: ErrorMessageProps) {
  return (
    <div className="error-container">
      <div className="error-talisman">⚠️</div>
      
      <h3 className="error-title-zh">蠟燭搖曳，說書人需要片刻喘息...</h3>
      <p className="error-title-en">The candle flickers... the storyteller needs a breath.</p>
      
      <p className="error-message">{error.message}</p>
      
      <div className="error-actions">
        {error.retryable && onRetry && (
          <button className="error-button retry-button" onClick={onRetry}>
            <span className="button-text-zh">再試一次</span>
            <span className="button-text-en">Retry</span>
          </button>
        )}
        
        {onUseFallback && (
          <button className="error-button fallback-button" onClick={onUseFallback}>
            <span className="button-text-zh">載入備用故事</span>
            <span className="button-text-en">Load Fallback Story</span>
          </button>
        )}
      </div>
    </div>
  );
}
