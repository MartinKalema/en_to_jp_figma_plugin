import { ErrorTag } from '../types/errors';

export abstract class BaseError extends Error {
  abstract readonly _tag: ErrorTag;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, this.constructor.prototype);
  }
}