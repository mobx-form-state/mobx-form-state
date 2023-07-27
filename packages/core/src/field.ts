/* eslint-disable @typescript-eslint/no-explicit-any */
import equal from 'fast-deep-equal';
import { action, computed, makeObservable, observable } from 'mobx';

import { Fields } from './fields';
import { Form } from './form';
import { FormControl } from './form-control';
import { HashName } from './hash-name';
import { Disposable } from './utils/disposable';
import { Validate } from './validate';
import { Values } from './values';

/**
 * DValue - type of the display value (used for formatting and parsing)
 * TValue - type of the field value
 * MValue - type of the model value
 * FValue - type of the form value
 **/

export class Field<TValue = any, MValue = any, FValue = any> extends Disposable {
  @observable
  public active = this.defaultState.active ?? false;

  @observable
  public touched = this.defaultState.touched ?? false;

  @observable
  public visited = this.defaultState.visited ?? false;

  @observable
  public valid = this.defaultState.valid ?? true;

  @observable
  public isBound = false;

  public bind: FormControl.Variants<TValue, MValue, FValue>;

  public hashName: HashName;

  private bindOptions?: FormControl.BindOptions<TValue, MValue, FValue>;

  constructor(
    public readonly config: Fields.Config<TValue, MValue, FValue>,
    public readonly form: Form<FValue>,
    private readonly hashNameContext: HashName = HashName.createEmpty(),
    private readonly defaultState: Partial<Fields.FieldState<TValue>> = {}
  ) {
    super();
    makeObservable(this);

    this.bind = FormControl.create(this, {
      onBind: this.onBind,
      onUnbind: this.onUnbind,
    });

    this.hashName = HashName.create(config, hashNameContext);

    HashName.getContext(this.hashNameContext, this.form.errors);
    this.updateValue(typeof defaultState.value !== 'undefined' ? defaultState.value : config.defaultValue);
    this.autoDispose(this.form.registerValidator(this.validate, this.hashName));
    this.autoDispose(this.cleanup);
  }

  @computed
  public get dirty(): boolean {
    return !this.pristine;
  }

  @computed
  public get pristine(): boolean {
    return equal(this.values[this.key], this.config.defaultValue);
  }

  @computed
  public get invalid(): boolean {
    return !this.valid;
  }

  @computed
  public get error(): string | undefined {
    return this.errors[this.key] as string;
  }

  @computed
  public get value(): TValue {
    return this.format(this.rawValue);
  }

  @computed
  public get rawValue(): TValue {
    return this.values[this.key] as unknown as TValue;
  }

  @computed
  private get errors(): Values.Errors<MValue> {
    return HashName.getContext(this.hashNameContext, this.form.errors);
  }

  @computed
  private get values(): MValue {
    return HashName.getContext(this.hashNameContext, this.form.values);
  }

  private get key(): keyof MValue {
    return HashName.getKey(this.hashName, this.hashNameContext);
  }

  public static is = (x: unknown): x is Field => x instanceof Field;

  @action
  public onChange = (value: Values.ChangeEvent<TValue>): void => {
    if (!this.active) {
      this.touched = true;
    }

    this.updateValue(this.parse(Values.fromEvent(value)));
    this.form.validate();
  };

  @action
  public onBlur = (): void => {
    this.touched = true;
    this.form.touched = true;
    this.active = false;
    this.form.validate();
  };

  @action
  public onFocus = (): void => {
    this.active = true;
    this.visited = true;
  };

  @action
  private updateValue = (value?: TValue): void => {
    this.values[this.key] = value as unknown as MValue[keyof MValue];
  };

  @action
  private updateError = (message: string | undefined, valid: boolean): void => {
    this.valid = valid;

    if (this.valid) {
      delete this.errors[this.key];
    } else {
      this.errors[this.key] = message as typeof this.errors[keyof typeof this.errors];
    }
  };

  @action
  private onBind = (options?: FormControl.BindOptions<TValue, MValue, FValue>): void => {
    this.isBound = true;
    this.bindOptions = options;
  };

  @action
  private onUnbind = (): void => {
    this.isBound = false;
    delete this.bindOptions;
  };

  @action
  private cleanup = (): void => {
    delete this.values[this.key];
    delete this.errors[this.key];
  };

  private validate = async (): Promise<boolean> => {
    if (this.touched || this.visited || this.isBound) {
      const result = await Validate.iterate(this.bindOptions?.validate || this.config.validate, this);

      const valid = !Validate.isError(result);
      const message = Validate.getMessage(result);

      this.updateError(message, valid);

      return valid;
    }

    return true;
  };

  private parse = (value: any): TValue =>
    Validate.toCollection(this.bindOptions?.parse || this.config.parse).reduce((acc, item) => item(acc, this), value);

  private format = (value: TValue): any =>
    Validate.toCollection(this.bindOptions?.format || this.config.format).reduce((acc, item) => item(acc, this), value);
}
