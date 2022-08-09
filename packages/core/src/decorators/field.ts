/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fields } from '../fields';

export const field =
  <MValue = any, K extends keyof MValue = any, DValue = MValue[K]>(
    config?: Omit<Fields.Config<MValue[K], MValue, any, DValue>, 'name'>
  ) =>
  (target: unknown, key: string): void => {
    if (!Fields.asModelMeta<MValue[K], MValue, any, DValue>(target)) return;

    if (!Object.prototype.hasOwnProperty.call(target, Fields.$)) {
      Object.defineProperty(target, Fields.$, {
        configurable: true,
        enumerable: true,
        writable: true,
      });

      const inheritedModel = Object.getPrototypeOf(target);

      target[Fields.$] = Object.prototype.hasOwnProperty.call(inheritedModel, Fields.$)
        ? inheritedModel[Fields.$].slice()
        : [];
    }

    target[Fields.$]?.push({
      name: key as keyof MValue,
      ...config,
    });
  };

export const fieldArray =
  <MValue = any>(type: Fields.ModelClass<MValue>, config: Omit<Fields.ArrayConfig<MValue>, 'name' | 'type'> = {}) =>
  (target: unknown, key: string): void => {
    if (!Fields.asModelMeta<MValue[keyof MValue], MValue, any>(target)) return;

    if (!target[Fields.$]) {
      Object.defineProperty(target, Fields.$, {
        configurable: true,
        enumerable: true,
        writable: true,
      });
      target[Fields.$] = [];
    }

    target[Fields.$]?.push({
      name: key as keyof MValue,
      ...config,
      type,
    });
  };
