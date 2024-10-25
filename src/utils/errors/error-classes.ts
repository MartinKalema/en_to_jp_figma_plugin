import { BaseError } from './base';

export class TranslationError extends BaseError {
  readonly _tag: 'TranslationError' = 'TranslationError';
  
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export class APIError extends BaseError {
  readonly _tag: 'APIError' = 'APIError';
  
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
  }
}

export class ValidationError extends BaseError {
  readonly _tag: 'ValidationError' = 'ValidationError';
  
  constructor(message: string) {
    super(message);
  }
}