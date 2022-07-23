import { logger } from './logger';

export class FormError extends Error {
  constructor(message: string) {
    super(logger.wrap(message));
  }
}

export const isError = (e: unknown): e is Error => typeof e === 'object' && e !== null && 'message' in e;
