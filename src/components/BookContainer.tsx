/**
 * Book Container Component
 * 書本容器元件
 * 
 * Main container with rice paper texture and book aesthetics
 * 帶有宣紙紋理和書本美學的主容器
 */

import React from 'react';
import './BookContainer.css';

interface BookContainerProps {
  children: React.ReactNode;
}

export function BookContainer({ children }: BookContainerProps) {
  return (
    <div className="book-container">
      <div className="book-page">
        {children}
      </div>
    </div>
  );
}
