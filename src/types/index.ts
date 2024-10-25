export interface TranslationSettings {
    apiKey: string;
  }
  
  export interface TranslationResponse {
    success: boolean;
    text: string;
    error?: string;
  }
  
  export interface MessageResponse {
    type: 'success' | 'error';
    message: string;
  }