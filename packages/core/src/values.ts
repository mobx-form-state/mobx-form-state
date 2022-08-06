/* eslint-disable @typescript-eslint/no-explicit-any */
import { runInAction } from 'mobx';

import { FieldArrayType } from './field-array';
import { HashName } from './hash-name';
import { Callback, Maybe } from './types';

export namespace Values {
  export type ChangeEvent<TValue> =
    | TValue
    | {
        target: {
          value?: TValue;
          checked?: TValue;
          options?: { selected: boolean; value: TValue extends any[] ? TValue[number] : TValue }[];
          type?: 'checkbox' | 'select-multiple' | 'text';
        };
      };

  export type SubmitEvent = {
    preventDefault?: Callback;
  };

  export const createEmpty = <MValue>(): MValue => {
    return {} as MValue;
  };

  export const getIn = <TValue, MValue>(
    iterableHash: HashName.HashIterator<keyof MValue>[],
    values: MValue
  ): TValue => {
    return runInAction(
      () =>
        iterableHash.reduce((acc: unknown, item) => {
          if (isValues<MValue>(acc)) {
            switch (item.type) {
              case 'array-item': {
                if ((acc as unknown as []).length <= Number(item.name)) {
                  (acc as unknown as []).push({} as never);
                }

                return acc[item.name];
              }

              case 'object': {
                if (!(item.name in acc)) {
                  acc[item.name] = {} as MValue[keyof MValue];
                }

                return acc[item.name];
              }

              case 'array':
                if (!(item.name in acc)) {
                  acc[item.name] = [] as unknown as MValue[keyof MValue];
                }

                return acc[item.name];
            }
          }

          return acc;
        }, values) as TValue
    );
  };

  export const isValues = <MValue>(x: unknown): x is MValue => typeof x === 'object';

  export type Errors<MValue> = {
    [P in keyof MValue]?: MValue[P] extends Maybe<FieldArrayType<infer FAT>> ? Errors<FAT>[] : string;
  };

  export type FromModel<MValue> = {
    [P in keyof MValue]: MValue[P] extends Maybe<FieldArrayType<infer FAT>> ? FromModel<FAT>[] : MValue[P];
  };

  export const fromEvent = <TValue>(e: ChangeEvent<TValue>): TValue => {
    if (typeof e === 'object' && e !== null && 'target' in e) {
      switch (e.target.type) {
        case 'checkbox':
          return e.target.checked as TValue;
        case 'select-multiple': {
          const value = [];

          if (e.target.options) {
            for (const option of e.target.options) {
              if (option.selected) {
                value.push(option.value);
              }
            }
          }

          return value as unknown as TValue;
        }

        default:
          return e.target.value as TValue;
      }
    }

    return e as unknown as TValue;
  };
}
