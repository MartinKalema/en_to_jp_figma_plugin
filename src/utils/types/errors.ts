export type ErrorTag = 'TranslationError' | 'APIError' | 'ValidationError';

export type ErrorHandlerOptions = {
  showNotification?: boolean;
  logToConsole?: boolean;
};
