import { ErrorHandlerOptions } from '../types/errors';
import { BaseError } from './base';
import { isAPIError, isTranslationError, isValidationError } from './guards';

export function handleError(error: unknown, options: ErrorHandlerOptions = {
  showNotification: true,
  logToConsole: true
}) {
  const { showNotification = true, logToConsole = true } = options;

  if (!(error instanceof BaseError)) {
    if (showNotification) {
      figma.notify('An unexpected error occurred', { error: true });
    }
    if (logToConsole) {
      console.error('Unexpected error:', error);
    }
    return;
  }

  if (isAPIError(error)) {
    if (showNotification) {
      figma.notify(`API Error: ${error.message}${error.statusCode ? ` (Status: ${error.statusCode})` : ''}`, { error: true });
    }
    if (logToConsole) {
      console.error('API Error:', error);
    }
  } else if (isValidationError(error)) {
    if (showNotification) {
      figma.notify(`Validation Error: ${error.message}`, { error: true });
    }
    if (logToConsole) {
      console.error('Validation Error:', error);
    }
  } else if (isTranslationError(error)) {
    if (showNotification) {
      figma.notify(`Translation Error: ${error.message}`, { error: true });
    }
    if (logToConsole) {
      console.error('Translation Error:', error, error.cause);
    }
  }
}