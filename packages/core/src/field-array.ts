import { action, computed, makeObservable, observable } from 'mobx';

import { Fields } from './fields';
import { Form } from './form';
import { HashName } from './hash-name';
import { Opaque } from './types';
import { assert } from './utils/assert';
import { Disposable } from './utils/disposable';

export type FieldArrayType<M> = Opaque<'fieldArray', M[]>;

export class FieldArray<TValue, FValue> extends Disposable {
  @observable
  private value: Fields.FromModel<TValue, FValue>[] = [];

  public readonly hashName: HashName;

  constructor(
    private readonly config: Fields.ArrayConfig<TValue>,
    public readonly form: Form<FValue>,
    private readonly hashNameContext: HashName = HashName.createEmpty()
  ) {
    super();
    makeObservable(this);
    this.hashName = HashName.create(config, hashNameContext);

    assert.exists(config.defaultValue, 'default value is not defined');
    this.createErrorContext();
    this.createValuesContext();

    this.value = config.defaultValue.map((item, index) =>
      Fields.create(config.type, form, item, HashName.create(index, this.hashName))
    );

    this.autoDispose(() => this.disposeFields(this.value));
  }

  @computed
  private get values(): FValue {
    return HashName.getContext<FValue, FValue>(this.hashName, this.form.values as FValue);
  }

  public get key(): keyof FValue {
    return HashName.getKey(this.hashName, this.hashNameContext);
  }

  public get fields(): readonly Fields.FromModel<TValue, FValue>[] {
    return this.value;
  }

  @action
  public readonly push = (value: Partial<TValue>): void => {
    this.value.push(
      Fields.create(this.config.type, this.form, value, HashName.create(this.value.length, this.hashName))
    );
  };

  @action
  public readonly remove = (index: number): void => {
    const deleted = this.value.splice(index, 1);

    this.disposeFields(deleted);
  };

  @action
  public readonly updateValue = (value: TValue[]): void => {
    (this.values[this.key] as unknown as TValue[]) = value as unknown as TValue[];
  };

  private disposeFields = (fields: Fields.FromModel<TValue, FValue>[]): void => {
    fields.forEach((item) => {
      for (const field in item) {
        item[field].dispose();
      }
    });
  };

  private readonly createErrorContext = (): void => {
    HashName.getContext(this.hashName, this.form.errors);
  };

  private readonly createValuesContext = (): void => {
    HashName.getContext(this.hashName, this.form.values);
  };
}
