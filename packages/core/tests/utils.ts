import { Normalizer, Validator } from '@mobx-form-state/core';

export const required =
  (): Validator =>
  ({ value }) => {
    const errorMessage = 'Required';

    if (Array.isArray(value)) {
      return !value.length ? errorMessage : '';
    }

    return !value ? errorMessage : '';
  };

export const willThrowAnError = (): Validator => () => {
  return Promise.reject(new Error('Ooops'));
};

export const trim = (): Normalizer => {
  return (value) => (typeof value === 'string' ? value.trim() : value);
};

export const minLength = (length: number): Validator => {
  return ({ value }) => (String(value).length < length ? `Min length ${length}` : '');
};
