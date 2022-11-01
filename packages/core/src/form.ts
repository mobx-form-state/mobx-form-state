/* eslint-disable @typescript-eslint/no-explicit-any */
import equal from 'fast-deep-equal';
import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';

import { Fields } from './fields';
import { HashName } from './hash-name';
import { Callback, Concrete } from './types';
import { Disposable } from './utils/disposable';
import { isError } from './utils/errors';
import { Validate, ValidatorResult } from './validate';
import { Values } from './values';

export type FormConfig<MValue, Result = any> = {
  onSubmit?: (values: Concrete<Values.FromModel<MValue>>, form: Form<MValue>) => Promise<Result> | Result;
  onSubmitSuccess?: (result: Result, form: Form<MValue>) => void;
  onSubmitFail?: (errors: Values.Errors<MValue> | Error, form: Form<MValue>) => void;
  initialValues?: Partial<Values.FromModel<MValue>>;
  name?: string;
};

export class Form<MValue> extends Disposable {
  @observable
  public touched = false;

  @observable
  public valid = true;

  @observable
  public values = Values.createEmpty<Concrete<Values.FromModel<MValue>>>();

  @observable
  public errors = Values.createEmpty<Values.Errors<MValue>>();

  @observable
  public error?: Error = undefined;

  @observable
  public submitFailed = false;

  @observable
  public submitted = false;

  @observable
  public submitting = false;

  @observable.ref
  public fields: Fields.FromModel<MValue, MValue>;

  public initialValues = Values.createEmpty<Partial<Values.FromModel<MValue>>>();

  private validators: Map<HashName, Callback<Promise<ValidatorResult>>> = new Map();

  constructor(private readonly model: Fields.ModelClass<MValue>, private readonly config?: FormConfig<MValue>) {
    super();
    makeObservable(this);

    this.fields = Fields.create(model, this, this.config?.initialValues as MValue);
    this.initialValues = toJS(this.values);
    this.autoDispose(this.disposeFields);
  }

  @computed
  public get invalid(): boolean {
    return !this.valid;
  }

  @computed
  public get errorMessage(): string | undefined {
    return this.error?.message;
  }

  @computed
  public get pristine(): boolean {
    return equal(this.initialValues, this.values);
  }

  @computed
  public get dirty(): boolean {
    return !this.pristine;
  }

  public get name(): string {
    return this.config?.name || this.model.name;
  }

  @action
  public reset = (initialValues = this.initialValues): void => {
    this.disposeFields();
    this.validators.clear();

    this.values = Values.createEmpty();
    this.errors = Values.createEmpty();

    this.valid = true;
    this.submitFailed = false;
    this.submitted = false;
    this.submitting = false;
    this.touched = false;
    this.error = undefined;

    this.fields = Fields.create(this.model, this, initialValues as MValue);
  };

  @action
  public setError = (error?: Error): void => {
    this.error = error;
  };

  @action
  private setValid = (value: boolean): void => {
    this.valid = value;
  };

  public preSubmitCheck = async (): Promise<boolean> => {
    if (!this.config) return false;

    const { onSubmitFail } = this.config;

    await this.validate();

    runInAction(() => {
      this.touched = true;
    });

    if (!this.valid) {
      runInAction(() => {
        this.submitFailed = true;
      });

      if (onSubmitFail) onSubmitFail(this.errors, this);
      return false;
    }

    return this.valid;
  };

  public handleSubmit = async (e?: Values.SubmitEvent): Promise<void> => {
    if (e?.preventDefault) {
      e.preventDefault();
    }

    if (!this.config) return;

    const { onSubmit, onSubmitSuccess, onSubmitFail } = this.config;

    if (!onSubmit) return;

    try {
      const valid = await this.preSubmitCheck();

      if (!valid) return;

      runInAction(() => {
        this.submitting = true;
      });

      const result = await onSubmit(this.values, this);

      runInAction(() => {
        this.submitting = false;
        this.submitted = true;
        this.submitFailed = false;
        this.error = undefined;
      });

      if (onSubmitSuccess) onSubmitSuccess(result, this);
    } catch (e) {
      runInAction(() => {
        this.submitting = false;
        this.submitted = false;
        this.submitFailed = true;
        if (!onSubmitFail && isError(e)) {
          this.error = e;
        }
      });
      if (onSubmitFail) {
        onSubmitFail(e as Error, this);
        if (!this.error && isError(e)) {
          const error = e;

          runInAction(() => {
            this.error = error;
          });
        }
      }
    }
  };

  public registerValidator = (validator: Callback<Promise<ValidatorResult>>, hashName: HashName): Callback => {
    this.validators.set(hashName, validator);

    return (): void => {
      this.validators.delete(hashName);
    };
  };

  public removeValidator = (hashName: HashName): void => {
    this.validators.delete(hashName);
  };

  public validate = async (): Promise<void> => {
    this.setValid(await Validate.run(this.validators));
  };

  private disposeFields = (): void => {
    Object.keys(this.fields).forEach((key) => this.fields[key as keyof MValue].dispose());
  };
}
