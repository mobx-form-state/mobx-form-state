/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Field, FormControl, Values } from '@mobx-form-state/core';
import { observer } from 'mobx-react-lite';
import { ComponentPropsWithRef, FunctionComponent, useEffect, useMemo } from 'react';

import { FieldContext } from './context';
import { hasError } from './has-error';

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
  omitProps?: string[] | boolean /* @deprecated */;
};

export type BindAs = 'input' | 'checkbox' | 'radio';

const getBindings = <TValue, MValue, FValue>(
  field: Field<TValue, MValue, FValue>,
  as: BindAs,
  options: FormControl.BindOptions<TValue, MValue, FValue>,
  value?: any
): FormControl.OneOf<TValue> => {
  switch (as) {
    case 'input':
      return field.bind(options);
    case 'checkbox':
      return field.bind.checkbox(options);
    case 'radio':
      return field.bind.radio(value, options);
  }
};

const $Control = <OfC extends FormElement, TValue, MValue, FValue>({
  field,
  of: Component,
  as = 'input',
  format,
  parse,
  validate,
  omitProps,
  value,
  ...rest
}: ControlProps<OfC, TValue, MValue, FValue>) => {
  const bindOptions = useMemo(() => ({ format, parse, validate }), [format, parse, validate]);

  const { unbind, ...bindings } = getBindings(field, as, bindOptions, value);

  useEffect(() => {
    return () => unbind();
  }, [unbind]);

  let renderProps = {
    ...bindings,
    ...rest,
  };

  // TODO: to be removed in the next major release
  const isCustomComponent = typeof Component !== 'string';

  if (isCustomComponent && !omitProps) {
    const error = hasError(field);

    const customProps: { error: boolean; helperText?: string } = {
      error,
    };

    if (error) {
      customProps.helperText = field.error;
    }

    renderProps = {
      ...renderProps,
      ...customProps,
    };
  }

  return (
    <FieldContext.Provider value={field as Field}>
      <Component {...renderProps} />
    </FieldContext.Provider>
  );
};

export const Control = observer($Control);
