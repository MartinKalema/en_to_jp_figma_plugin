import React, { useState } from 'react';
import { ApiKeyInput } from '../ApiKeyInput';
import { TranslateButton } from '../TranslateButton';
import './styles.css';

export const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveApiKey = (apiKey: string) => {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'save-settings',
        apiKey 
      } 
    }, '*');
  };

  const handleTranslate = () => {
    setIsProcessing(true);
    parent.postMessage({ 
      pluginMessage: { 
        type: 'translate-selected' 
      } 
    }, '*');
  };

  const handleCancel = () => {
    parent.postMessage({ 
      pluginMessage: { 
        type: 'cancel' 
      } 
    }, '*');
  };

  React.useEffect(() => {
    // Listen for messages from the plugin code
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === 'translation-complete') {
        setIsProcessing(false);
      }
    };
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">GPT-4 English to Japanese Translator</h1>
      
      <ApiKeyInput onSave={handleSaveApiKey} />
      
      <TranslateButton 
        onClick={handleTranslate}
        disabled={isProcessing}
      />
      
      <button 
        className="cancel-button"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};
