import { action, computed, makeObservable, observable } from 'mobx';

import { Field } from './field';
import { Fields } from './fields';
import { Form } from './form';
import { HashName } from './hash-name';
import { Opaque } from './types';
import { assert } from './utils/assert';
import { Disposable } from './utils/disposable';
import { Values } from './values';

export type FieldArrayType<M> = Opaque<'fieldArray', M[]>;

export class FieldArray<TValue, FValue> extends Disposable {
  @observable.shallow
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
  public get fields(): readonly Fields.FromModel<TValue, FValue>[] {
    return this.value;
  }

  @computed
  private get errors(): Values.Errors<TValue>[] {
    return HashName.getContext(this.hashName, this.form.errors);
  }

  @computed
  private get values(): TValue[] {
    return HashName.getContext(this.hashName, this.form.values);
  }

  public get key(): keyof FValue {
    return HashName.getKey(this.hashName, this.hashNameContext);
  }

  @action
  public readonly push = (value: Partial<TValue>): void => {
    const hashName = HashName.create(this.value.length, this.hashName);

    HashName.getContext(hashName, this.form.errors);
    HashName.getContext(hashName, this.form.values);

    this.value.push(Fields.create(this.config.type, this.form, value, hashName));
  };

  @action
  public readonly remove = (index: number): void => {
    if (index in this.value) {
      const deleted = this.value.splice(index, 1);

      this.disposeFields(deleted);

      this.values.splice(index, 1);
      this.errors.splice(index, 1);

      this.value = this.value.map((fields, index) => this.restoreFields(fields, HashName.create(index, this.hashName)));
    }
  };

  private disposeFields = (fields: Fields.FromModel<TValue, FValue>[]): void => {
    fields.forEach((item) => {
      for (const field in item) {
        item[field].dispose();
      }
    });
  };

  private restoreFields = (
    fields: Fields.FromModel<TValue, FValue>,
    hashName: HashName
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Fields.FromModel<TValue, FValue> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const restored = {} as Fields.FromModel<any, FValue>;

    for (const fieldKey in fields) {
      const field = fields[fieldKey];

      this.form.removeValidator(field.hashName);

      if (Field.is(field)) {
        restored[fieldKey] = new Field<TValue, TValue, FValue>(
          field.config as Fields.Config<TValue, TValue, FValue>,
          this.form,
          hashName,
          {
            active: field.active,
            touched: field.touched,
            visited: field.visited,
            valid: field.valid,
            value: field.rawValue,
          }
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return restored as any;
  };

  private readonly createErrorContext = (): void => {
    HashName.getContext(this.hashName, this.form.errors);
  };

  private readonly createValuesContext = (): void => {
    HashName.getContext(this.hashName, this.form.values);
  };
}
