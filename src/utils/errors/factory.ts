import { TranslationError, APIError, ValidationError } from './error-classes';

export const Errors = {
  translation: (message: string, cause?: unknown) => new TranslationError(message, cause),
  api: (message: string, statusCode?: number) => new APIError(message, statusCode),
  validation: (message: string) => new ValidationError(message)
};