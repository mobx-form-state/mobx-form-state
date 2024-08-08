import { Field } from '@mobx-form-state/core';

export const hasError = <TValue, MValue, FValue>(field: Field<TValue, MValue, FValue>): boolean => {
  return (field.touched || field.form.submitFailed) && field.invalid;
};
