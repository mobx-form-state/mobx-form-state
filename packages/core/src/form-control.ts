import { Formatter, Parser, Validator } from '.';
import { Field } from './field';
import { Callback, MaybeArray } from './types';
import { Values } from './values';

export namespace FormControl {
  export type OneOf<TValue> = Input<TValue> | Checkbox<TValue> | Radio<TValue>;

  export type Input<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    value: TValue;
    unbind: Callback<void>;
  };

  export type Checkbox<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    checked: TValue;
    unbind: Callback<void>;
  };

  export type Radio<TValue> = {
    onChange: (value: Values.ChangeEvent<TValue>) => void;
    onFocus: Callback;
    onBlur: Callback;
    checked: boolean;
    value: TValue;
    unbind: Callback<void>;
  };

  export type Variants<TValue, MValue, FValue> = ((
    bindOptions?: BindOptions<TValue, MValue, FValue>
  ) => Input<TValue>) & {
    checkbox: (bindOptions?: BindOptions<TValue, MValue, FValue>) => Checkbox<TValue>;
    radio: (value: TValue, bindOptions?: BindOptions<TValue, MValue, FValue>) => Radio<TValue>;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type BindOptions<TValue, MValue, FValue> = {
    parse?: MaybeArray<Parser<TValue, TValue, MValue, FValue>>;
    format?: MaybeArray<Formatter<TValue, TValue, MValue, FValue>>;
    validate?: MaybeArray<Validator<TValue, MValue, FValue>>;
  };

  type CreateOptions<TValue, MValue, FValue> = {
    onBind: (options?: BindOptions<TValue, MValue, FValue>) => void;
    onUnbind: Callback;
  };

  export const create = <TValue, MValue, FValue>(
    field: Field<TValue, MValue, FValue>,
    options: CreateOptions<TValue, MValue, FValue>
  ): Variants<TValue, MValue, FValue> => {
    const bind: Variants<TValue, MValue, FValue> = (
      bindOptions?: BindOptions<TValue, MValue, FValue>
    ): Input<TValue> => {
      options.onBind(bindOptions);

      return {
        onChange: field.onChange,
        onFocus: field.onFocus,
        onBlur: field.onBlur,
        value: field.value,
        unbind: options.onUnbind,
      };
    };

    bind.checkbox = (bindOptions?: BindOptions<TValue, MValue, FValue>): Checkbox<TValue> => {
      options.onBind(bindOptions);

      return {
        onChange: field.onChange,
        onFocus: field.onFocus,
        onBlur: field.onBlur,
        checked: field.value,
        unbind: options.onUnbind,
      };
    };

    bind.radio = (value: TValue, bindOptions?: BindOptions<TValue, MValue, FValue>): Radio<TValue> => {
      options.onBind(bindOptions);

      return {
        onChange: field.onChange,
        onFocus: field.onFocus,
        onBlur: field.onBlur,
        checked: field.value === value,
        value,
        unbind: options.onUnbind,
      };
    };

    return bind;
  };
}
