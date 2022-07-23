import { Fields } from './fields';
import { Opaque } from './types';
import { Values } from './values';

export type HashName = Opaque<'hashName', string>;

export namespace HashName {
  export const create = <TValue, MValue, FValue>(
    value: Fields.OneOfConfig<TValue, MValue, FValue> | string | number,
    context?: HashName
  ): HashName => {
    let result = context ? context + '/' : '#';

    if (Fields.isArrayConfig(value)) {
      return (result += value.name + '[]') as HashName;
    }

    if (Fields.isConfig(value)) {
      return (result += value.name) as HashName;
    }

    result += value;

    return result as HashName;
  };

  export const createEmpty = (): HashName => '' as HashName;

  export type HashIterator<T> = {
    type: 'object' | 'array' | 'array-item';
    name: T;
  };

  export const iterate = <Key>(hashName: HashName): HashIterator<Key>[] =>
    hashName
      .slice(1)
      .split('/')
      .filter((item) => item !== '')
      .map((item, index, arr) => {
        const isArray = isArrayLike(item) && 'array';
        const isArrayItem = isArrayLike(arr[index - 1]) && 'array-item';

        return {
          type: isArray || isArrayItem || 'object',
          name: (isArray ? item.slice(0, -2) : item) as unknown as Key,
        };
      });

  export const getContext = <TValue, MValue>(hashName: HashName, values: MValue): TValue => {
    const iterableHash = iterate<keyof MValue>(hashName);

    return Values.getIn<TValue, MValue>(iterableHash, values);
  };

  export const isArrayLike = (value?: string): boolean => typeof value === 'string' && value.endsWith('[]');

  export const getName = (hashNameContext: HashName, hashName: HashName): string =>
    hashName.slice(hashNameContext.length);

  export const getKey = <T>(hashName: HashName, context: HashName): T => {
    const result = hashName.slice(context.length + 1);

    return (isArrayLike(result) ? result.slice(0, -2) : result) as unknown as T;
  };
}
