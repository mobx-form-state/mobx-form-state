/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Field, Values } from '@mobx-form-state/core';
import { observer } from 'mobx-react-lite';
import { ComponentPropsWithRef, FunctionComponent, createElement } from 'react';

import { FieldContext } from './context';

export type FormElementProps<TValue = any> = {
  onChange?: (value?: Values.ChangeEvent<TValue>) => void;
  value?: TValue;
  helperText?: string;
  error?: boolean;
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
      FormElementProps<TValue>
  : BaseControl<TValue, MValue, FValue, OfC> & ComponentPropsWithRef<OfC>;

export type BaseControl<TValue, MValue, FValue, OfC> = {
  field: Field<TValue, MValue, FValue>;
  of: OfC;
  as?: 'input' | 'checkbox' | 'radio';
  omitProps?: string[];
};

export type BindAs = 'input' | 'checkbox' | 'radio';

const getBindings = (field: Field, as: BindAs, value?: any) => {
  switch (as) {
    case 'input':
      return field.bind();
    case 'checkbox':
      return field.bind.checkbox();
    case 'radio':
      return field.bind.radio(value);
  }
};

const FormControl = <OfC extends FormElement, TValue, MValue, FValue>({
  field,
  of,
  as = 'input',
  omitProps,
  ...rest
}: ControlProps<OfC, TValue, MValue, FValue>) => {
  const isTag = typeof of === 'string';

  const bindings = getBindings(field as Field, as, rest.value);

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

export const Control = observer(FormControl);
