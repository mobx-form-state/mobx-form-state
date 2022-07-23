/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from './field';
import { FieldArray, FieldArrayType } from './field-array';
import { Form } from './form';
import { HashName } from './hash-name';
import { Formatter, Parser } from './normalize';
import { Concrete, Maybe, MaybeArray } from './types';
import { FormError } from './utils/errors';
import { Validator } from './validate';

export namespace Fields {
  export const $ = Symbol('fields');

  export type ModelClass<MValue> = new () => MValue;

  export type OneOfConfig<TValue, MValue, FValue, DValue = any> =
    | Config<TValue, MValue, FValue, DValue>
    | ArrayConfig<MValue>;

  export type ModelMeta<TValue, MValue, FValue, DValue> = {
    [key: string]: any;
    [$]: OneOfConfig<TValue, MValue, FValue, DValue>[];
  };

  export type FromModel<MValue, FValue> = Concrete<{
    [P in keyof MValue]: MValue[P] extends Maybe<FieldArrayType<infer FAT>>
      ? FieldArray<FAT, FValue>
      : Field<MValue[P], MValue, FValue>;
  }>;

  export type Config<TValue = any, MValue = any, FValue = any, DValue = any> = {
    name: keyof MValue;
    parse?: MaybeArray<Parser<DValue, TValue, MValue, FValue>>;
    format?: MaybeArray<Formatter<DValue, TValue, MValue, FValue>>;
    validate?: MaybeArray<Validator<TValue, MValue, FValue>>;
    defaultValue?: TValue;
  };

  export type ArrayConfig<MValue = any> = {
    name: keyof MValue;
    type: ModelClass<MValue>;
    defaultValue?: MValue[];
  };

  export const create = <MValue, FValue>(
    Model: ModelClass<MValue>,
    form: Form<FValue>,
    initial?: Partial<MValue>,
    hashNameContext?: HashName
  ): FromModel<MValue, FValue> => {
    const model = new Model();

    if (!hasModelMeta<MValue[keyof MValue], MValue, FValue, unknown>(model)) {
      throw new FormError('Can not create a form instance with empty model');
    }

    const fields = {} as any;

    for (const fieldParams of model[$]) {
      const field = { ...fieldParams };

      if (typeof field.defaultValue === 'undefined') {
        field.defaultValue = model[field.name];
      }

      if (initial && field.name in initial) {
        field.defaultValue = initial[field.name] as MValue[keyof MValue];
      }

      if (typeof field.defaultValue === 'undefined') {
        field.defaultValue = createEmptyValue();
      }

      if (isArrayConfig<MValue>(field)) {
        if (!field.defaultValue) {
          field.defaultValue = [];
        }

        fields[field.name] = new FieldArray(field, form, hashNameContext);
      } else {
        fields[field.name] = new Field(field, form, hashNameContext);
      }
    }

    return fields;
  };

  export const hasModelMeta = <TValue, MValue, FValue, DValue>(
    x: unknown
  ): x is ModelMeta<TValue, MValue, FValue, DValue> => $ in (x as any);

  export const asModelMeta = <TValue, MValue, FValue, DValue = any>(
    x: unknown
  ): x is Partial<ModelMeta<TValue, MValue, FValue, DValue>> => typeof x === 'object';

  export const isArrayConfig = <MValue>(x: unknown): x is ArrayConfig<MValue> => isObject(x) && 'type' in x;

  export const isConfig = <TValue, MValue>(x: unknown): x is Config<TValue, MValue> =>
    isObject(x) && 'name' in x && !('type' in x);

  export const isObject = (x: unknown): x is Record<string, never> => typeof x === 'object';

  export const createEmptyValue = <T>(): T => '' as unknown as T;
}
