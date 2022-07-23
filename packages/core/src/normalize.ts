/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field } from './field';

export type Normalizer<TValue = any, MValue = any, FValue = any> = (
  value: TValue,
  field: Field<TValue, MValue, FValue>
) => TValue;

export type Formatter<DValue = any, TValue = any, MValue = any, FValue = any> = (
  value: TValue,
  field: Field<TValue, MValue, FValue>
) => DValue;

export type Parser<DValue = any, TValue = any, MValue = any, FValue = any> = (
  value: DValue,
  field: Field<TValue, MValue, FValue>
) => TValue | DValue;
