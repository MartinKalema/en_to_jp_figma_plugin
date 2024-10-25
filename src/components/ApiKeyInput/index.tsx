import React, { useState } from 'react';
import './styles.css';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
      setApiKey('');
    }
  };

  return (
    <div className="input-group">
      <label className="input-label" htmlFor="apiKey">
        OpenAI API Key
      </label>
      <input
        id="apiKey"
        type="password"
        className="input-field"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="sk-..."
      />
      <button className="save-button" onClick={handleSave}>
        Save API Key
      </button>
    </div>
  );
};