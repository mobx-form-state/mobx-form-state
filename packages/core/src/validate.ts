/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field } from './field';
import { HashName } from './hash-name';
import { Callback, MaybeArray } from './types';

export type Validator<TValue = any, MValue = any, FValue = any> = (
  field: Field<TValue, MValue, FValue>
) => ValidatorResult | Promise<ValidatorResult>;

export type ValidatorResult = boolean | string | undefined;

export namespace Validate {
  export const run = async (validators: Map<HashName, Callback<Promise<ValidatorResult>>>): Promise<boolean> => {
    let valid = true;

    for (const validate of validators.values()) {
      const result = await validate();
      if (!result) {
        valid = false;
      }
    }

    return valid;
  };

  export const iterate = async <TValue, MValue, FValue>(
    validator: MaybeArray<Validator<TValue, MValue, FValue>> = [],
    field: Field<TValue, MValue, FValue>
  ): Promise<ValidatorResult> => {
    try {
      for (const validate of toCollection(validator)) {
        const result = await validate(field);

        if (result) return result;
      }
    } catch (_e: unknown) {
      return true;
    }

    return undefined;
  };

  export const toCollection = <T>(value: MaybeArray<T> = []): T[] => (Array.isArray(value) ? value : [value]);

  export const isError = (result: ValidatorResult): boolean => {
    if (typeof result === 'string' && result.length > 0) return true;
    if (typeof result === 'boolean') return !result;

    return false;
  };

  export const getMessage = (result: ValidatorResult): string | undefined => {
    if (isError(result)) {
      return typeof result === 'string' ? result : '';
    }

    return undefined;
  };
}
