import { Normalizer, Validator } from '@mobx-form-state/core';

export const required =
  <TValue, MValue, FValue>(): Validator<TValue, MValue, FValue> =>
  ({ value }) => {
    const errorMessage = 'Required';

    if (Array.isArray(value)) {
      return !value.length ? errorMessage : '';
    }

    return !value ? errorMessage : '';
  };

export const trim = (): Normalizer => {
  return (value) => (typeof value === 'string' ? value.trim() : value);
};

export const minLength = <TValue, MValue, FValue>(length: number): Validator<TValue, MValue, FValue> => {
  return ({ value }) => (String(value).length < length ? `Min length ${length}` : '');
};

export const maxLength = <TValue, MValue, FValue>(length: number): Validator<TValue, MValue, FValue> => {
  return ({ value }) => (String(value).length > length ? `Max length ${length}` : '');
};
