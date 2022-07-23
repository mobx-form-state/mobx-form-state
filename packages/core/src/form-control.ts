import { Field } from './field';
import { Callback } from './types';
import { Values } from './values';

export namespace FormControl {
  export type OneOf<TValue> = Input<TValue> | Checkbox<TValue> | Radio<TValue>;

  export type Input<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    value: TValue;
  };

  export type Checkbox<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    checked: TValue;
  };

  export type Radio<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    checked: boolean;
    value: TValue;
  };

  export type Variants<TValue> = (() => Input<TValue>) & {
    checkbox: () => Checkbox<TValue>;
    radio: (value: TValue) => Radio<TValue>;
  };

  export const create = <TValue, MValue, FValue>(field: Field<TValue, MValue, FValue>): Variants<TValue> => {
    const bind: Variants<TValue> = (): Input<TValue> => ({
      onChange: field.onChange,
      onFocus: field.onFocus,
      onBlur: field.onBlur,
      value: field.value,
    });

    bind.checkbox = (): Checkbox<TValue> => ({
      onChange: field.onChange,
      onFocus: field.onFocus,
      onBlur: field.onBlur,
      checked: field.value,
    });

    bind.radio = (value: TValue): Radio<TValue> => ({
      onChange: field.onChange,
      onFocus: field.onFocus,
      onBlur: field.onBlur,
      checked: field.value === value,
      value,
    });

    return bind;
  };
}
