import React from 'react';
import './styles.css';

interface TranslateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <div>
      <p className="info-text">
        Select elements to create a translated copy of your diagram. Uses GPT-4 for
        high-quality translation with technical context awareness.
      </p>
      <button
        className="translate-button"
        onClick={onClick}
        disabled={disabled}
      >
        Create Translated Copy
      </button>
    </div>
  );
}