import { TranslationError, APIError, ValidationError } from './error-classes';
import { BaseError } from './base';

export function isBaseError(error: unknown): error is BaseError {
  return error instanceof BaseError;
}

export function isTranslationError(error: unknown): error is TranslationError {
  return error instanceof TranslationError && error._tag === 'TranslationError';
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError && error._tag === 'APIError';
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError && error._tag === 'ValidationError';
}