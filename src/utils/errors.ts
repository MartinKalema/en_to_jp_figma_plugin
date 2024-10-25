export class TranslationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'TranslationError';
      Object.setPrototypeOf(this, TranslationError.prototype);
    }
  }
  
  export function isTranslationError(error: unknown): error is TranslationError {
    return error instanceof TranslationError;
  }