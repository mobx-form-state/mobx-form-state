/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Field, FormControl, Values } from '@mobx-form-state/core';
import { observer } from 'mobx-react-lite';
import { ComponentPropsWithRef, FunctionComponent, createElement, useEffect, useMemo } from 'react';

import { FieldContext } from './context';

export type FormElementProps<TValue = any> = {
  onChange?: (value?: Values.ChangeEvent<TValue>) => void;
  value?: TValue;
  helperText?: string;
  error?: boolean;
};

type ExtractByType<T, Value> = {
  [P in keyof T as P extends Value ? P : never]: T[P];
};

export type FormElement<Props = any> = FunctionComponent<Props> | 'input' | 'textarea' | 'select';

export type ControlProps<
  OfC extends FormElement,
  TValue = any,
  MValue = any,
  FValue = any
> = OfC extends FunctionComponent<infer OfCP>
  ? BaseControl<TValue, MValue, FValue, FunctionComponent<OfCP>> &
      Omit<OfCP, 'of' | 'field' | keyof FormElementProps> &
      Partial<ExtractByType<OfCP, keyof FormElementProps>>
  : BaseControl<TValue, MValue, FValue, OfC> & ComponentPropsWithRef<OfC>;

export type BaseControl<TValue, MValue, FValue, OfC> = FormControl.BindOptions<TValue, MValue, FValue> & {
  field: Field<TValue, MValue, FValue>;
  of: OfC;
  as?: 'input' | 'checkbox' | 'radio';
  omitProps?: string[];
};

export type BindAs = 'input' | 'checkbox' | 'radio';

const getBindings = <TValue, MValue, FValue>(
  field: Field,
  as: BindAs,
  options: FormControl.BindOptions<TValue, MValue, FValue>,
  value?: any
) => {
  switch (as) {
    case 'input':
      return field.bind(options);
    case 'checkbox':
      return field.bind.checkbox(options);
    case 'radio':
      return field.bind.radio(options, value);
  }
};

const $Control = <OfC extends FormElement, TValue, MValue, FValue>({
  field,
  of,
  as = 'input',
  omitProps,
  format,
  parse,
  validate,
  ...rest
}: ControlProps<OfC, TValue, MValue, FValue>) => {
  const isTag = typeof of === 'string';

  const bindOptions = useMemo(() => ({ format, parse, validate }), [format, parse, validate]);

  const bindings = getBindings(field as Field, as, bindOptions, rest.value);

  useEffect(() => {
    return () => bindings.unbind();
  }, []);

  const hasError = (field.touched || field.form.submitFailed) && field.invalid;

  const props = isTag
    ? bindings
    : {
        ...bindings,
        error: hasError,
        helperText: hasError ? field.error : undefined,
      };

  omitProps?.forEach((prop) => {
    if (prop in props) {
      delete props[prop as keyof typeof props];
    }
  });

  return (
    <FieldContext.Provider value={field as Field}>
      {createElement(of, {
        ...props,
        ...rest,
      })}
    </FieldContext.Provider>
  );
};

export const Control = observer($Control);
