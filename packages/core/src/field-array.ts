import { action, computed, makeObservable, observable } from 'mobx';

import { Fields } from './fields';
import { Form } from './form';
import { HashName } from './hash-name';
import { Opaque } from './types';
import { assert } from './utils/assert';
import { Disposable } from './utils/disposable';

export type FieldArrayType<M> = Opaque<'fieldArray', M[]>;

export class FieldArray<TValue, FValue> extends Disposable {
  @observable.ref
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

  public get key(): keyof FValue {
    return HashName.getKey(this.hashName, this.hashNameContext);
  }

  @action
  public readonly push = (value: Partial<TValue>): void => {
    const hashName = HashName.create(this.value.length, this.hashName);

    HashName.getContext(hashName, this.form.errors);
    HashName.getContext(hashName, this.form.values);

    this.value = this.value.concat(Fields.create(this.config.type, this.form, value, hashName));
  };

  @action
  public readonly remove = (index: number): void => {
    if (index in this.value) {
      const deleted = this.value[index];
      const nextValue = this.value.slice();

      delete nextValue[index];

      this.value = nextValue;

      this.disposeFields([deleted]);
    }
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
