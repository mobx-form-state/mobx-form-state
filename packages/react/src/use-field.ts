/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from '@mobx-form-state/core';
import { FormError } from '@mobx-form-state/core/utils/errors';
import { useContext } from 'react';

import { FieldContext } from './context';

export const useField = <TValue = any, MValue = any, FValue = any>(): Field<TValue, MValue, FValue> => {
  const field = useContext(FieldContext);

  if (!field) {
    throw new FormError("useField hook can't be used out of <Control />");
  }

  return field as Field<TValue, MValue, FValue>;
};
