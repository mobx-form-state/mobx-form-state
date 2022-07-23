/* eslint-disable @typescript-eslint/no-explicit-any */
import { autorun } from 'mobx';
import { Form } from '@mobx-form-state/core';
import { Values } from '@mobx-form-state/core/values';

import { UserFormModel } from './UserForm.model';

describe('simple example', () => {
  test('initialize from model', () => {
    const form = new Form(UserFormModel, {
      name: 'UserForm',
    });

    expect(form.values).toMatchSnapshot();
    expect(form.name).toBe('UserForm');
  });

  test('initialValues should override model default values', () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        login: 'Alex',
        password: 'Password',
        hobbies: [{ hobbyId: 1, hobbyName: 'Dev' }],
        emails: ['Olefirenk@gmail.com'],
      },
    });

    expect(form.values).toMatchSnapshot();
  });

  test('Field: onChange', () => {
    const form = new Form(UserFormModel);

    form.fields.login.onChange({ target: { value: 'test' } });

    expect(form.values.login).toBe('test');
    expect(form.fields.login.value).toBe('test');
  });

  test('FieldArray: validate', async () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        login: '',
        password: '',
        hobbies: [],
      },
    });

    form.fields.hobbies.push({ hobbyId: 0, hobbyName: '' });

    await form.validate();

    expect(form.errors).toEqual({
      hobbies: [{ hobbyId: 'Required', hobbyName: 'Required' }],
      login: 'Required',
      password: 'Required',
    });

    form.fields.hobbies.push({ hobbyId: 1, hobbyName: 'dev' });

    await form.validate();

    expect(form.errors).toEqual({
      hobbies: [{ hobbyId: 'Required', hobbyName: 'Required' }, {}],
      login: 'Required',
      password: 'Required',
    });
  });

  test('Field normalize', () => {
    const form = new Form(UserFormModel);

    form.fields.password.onChange({ target: { value: ' testvalue ' } });

    expect(form.fields.password.value).toBe('testvalue');
    expect(form.values.password).toBe('testvalue');
  });

  test('Form reset', () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        password: 'password',
      },
    });

    expect(form.pristine).toBe(true);

    form.fields.password.onChange('Password');

    expect(form.fields.password.value).toBe('Password');
    expect(form.values.password).toBe('Password');
    expect(form.pristine).toBe(false);

    form.reset();

    expect(form.fields.password.value).toBe('password');
    expect(form.values.password).toBe('password');

    expect(form.pristine).toBe(true);
  });

  test('Form submit', async () => {
    // without submit handlers

    const form = new Form(UserFormModel);

    await form.handleSubmit();

    expect(form.valid).toBe(true);
    expect(form.invalid).toBe(false);

    expect(form.submitted).toBe(false);
    expect(form.submitFailed).toBe(false);
    expect(form.submitting).toBe(false);
  });

  test('Form submit :: success', async () => {
    const onSubmit = jest.fn<Promise<any>, [Values.FromModel<UserFormModel>]>();
    const onSubmitSuccess = jest.fn<void, [any]>();

    const form = new Form(UserFormModel, {
      onSubmit,
      onSubmitSuccess,
      initialValues: {
        login: 'user',
        password: 'password',
      },
    });

    const preventDefault = jest.fn();

    await form.handleSubmit({ preventDefault });

    expect(preventDefault).toBeCalled();
    expect(form.valid).toBe(true);
    expect(form.invalid).toBe(false);
    expect(form.submitted).toBe(true);
    expect(form.submitFailed).toBe(false);
    expect(form.submitting).toBe(false);

    expect(onSubmit).toBeCalledWith(form.values, form);
    expect(onSubmitSuccess).toBeCalled();
  });

  test('Form submit :: success without handlers', async () => {
    const onSubmit = jest.fn<Promise<any>, [Values.FromModel<UserFormModel>]>();

    const form = new Form(UserFormModel, {
      onSubmit,
    });

    await form.handleSubmit();

    expect(onSubmit).toBeCalledWith(form.values, form);
  });

  test('Form submit :: validation errors', async () => {
    const onSubmit = jest.fn<Promise<any>, [Values.FromModel<UserFormModel>]>();
    const onSubmitFail = jest.fn<void, [any]>();

    const form = new Form(UserFormModel, {
      onSubmit,
      onSubmitFail,
      initialValues: {
        login: 'user',
        password: 'password',
      },
    });

    expect(form.pristine).toBe(true);
    expect(form.dirty).toBe(false);
    expect(form.valid).toBe(true);

    form.fields.login.onChange('');
    form.fields.password.onChange('');

    await form.validate();
    await form.handleSubmit();

    expect(form.pristine).toBe(false);
    expect(form.dirty).toBe(true);
    expect(form.valid).toBe(false);
    expect(form.invalid).toBe(true);
    expect(form.submitted).toBe(false);
    expect(form.submitFailed).toBe(true);
    expect(form.submitting).toBe(false);

    expect(onSubmit).not.toBeCalledWith(form);
    expect(onSubmitFail).toBeCalledWith(form.errors, form);

    expect(form.errors.login).toBe('Required');
    expect(form.errors.password).toBe('Required');
  });

  test('Form submit :: validation errors without handlers', async () => {
    const onSubmit = jest.fn<Promise<any>, [Values.FromModel<UserFormModel>]>();

    const form = new Form(UserFormModel, {
      onSubmit,
    });

    form.fields.login.onChange('');
    form.fields.password.onChange('');

    await form.handleSubmit();
  });

  test('Form submit :: submit errors', async () => {
    const onSubmit = (): Promise<any> => Promise.reject({ message: 'Wrong credentials' });
    const onSubmitFail = jest.fn();

    const form = new Form(UserFormModel, {
      onSubmit,
      onSubmitFail,
      initialValues: {
        login: 'wrong',
        password: 'password',
      },
    });

    await form.handleSubmit();

    expect(form.submitted).toBe(false);
    expect(form.submitFailed).toBe(true);
    expect(form.submitting).toBe(false);

    expect(onSubmitFail).toBeCalledWith({ message: 'Wrong credentials' }, form);
  });

  test('Form submit :: submit errors without handlers', async () => {
    const onSubmit = (): Promise<void> => Promise.reject({ message: 'Wrong credentials' });

    const form = new Form(UserFormModel, {
      onSubmit,
    });

    await form.handleSubmit();
  });

  test('Field input', () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        hobbies: [
          {
            hobbyId: 1,
            hobbyName: 'Dev',
          },
        ],
      },
    });

    const loginField = form.fields.login;

    expect(loginField.active).toBe(false);
    expect(loginField.valid).toBe(true);
    expect(loginField.invalid).toBe(false);
    expect(loginField.error).toBe(undefined);
    expect(loginField.touched).toBe(false);
    expect(loginField.visited).toBe(false);
    expect(loginField.dirty).toBe(false);
    expect(loginField.pristine).toBe(true);

    loginField.onFocus();

    expect(form.fields.login.active).toBe(true);
    expect(form.fields.login.visited).toBe(true);

    loginField.onChange({ target: { value: 'new value' } });

    expect(form.fields.login.pristine).toBe(false);
    expect(form.fields.login.dirty).toBe(true);

    expect(loginField.value).toBe('new value');

    loginField.onBlur();
    expect(form.fields.login.touched).toBe(true);
    expect(form.fields.login.active).toBe(false);
  });

  test('Field checkbox', () => {
    const form = new Form(UserFormModel);

    const employed = form.fields.employed;

    employed.onChange({ target: { type: 'checkbox', checked: false } });

    expect(employed.value).toBe(false);
    expect(form.fields.employed.active).toBe(false);
    expect(form.fields.employed.touched).toBe(true);
  });

  test('Field radio', () => {
    const form = new Form(UserFormModel);

    let mustardRadio = form.fields.sause.bind.radio('mustard');

    let ketchupRadio = form.fields.sause.bind.radio('ketchup');

    autorun(() => {
      mustardRadio = { ...form.fields.sause.bind.radio('mustard') };
    });

    autorun(() => {
      ketchupRadio = { ...form.fields.sause.bind.radio('ketchup') };
    });

    mustardRadio.onChange({ target: { type: 'text', value: 'mustard' } });
    expect(mustardRadio.checked).toBe(true);
    expect(ketchupRadio.checked).toBe(false);
    expect(form.fields.sause.value).toBe('mustard');

    expect(form.fields.sause.active).toBe(false);
    expect(form.fields.sause.touched).toBe(true);
  });

  test('Field select-multiple', () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        flavor: [],
      },
    });

    expect(form.fields.flavor.value).toEqual([]);

    form.fields.flavor.onChange({
      target: {
        options: [
          { selected: true, value: 'grapefruit' },
          { selected: false, value: 'lime' },
        ],
        type: 'select-multiple',
      },
    });

    expect(form.fields.flavor.value).toEqual(['grapefruit']);

    form.fields.flavor.onChange({
      target: {
        type: 'select-multiple',
      },
    });

    expect(form.fields.flavor.value).toEqual([]);
  });

  test('FieldArray values should be consitent', () => {
    const form = new Form(UserFormModel, {
      initialValues: {
        emails: ['olefirenk@gmail.com'],
        hobbies: [
          {
            hobbyId: 1,
            hobbyName: 'Dev',
          },
          {
            hobbyId: 2,
            hobbyName: 'Smth',
          },
        ],
      },
    });

    expect(form.values.hobbies).toEqual(form.initialValues.hobbies);
  });

  test('Form generic error', async () => {
    const handleSubmit = jest.fn(({ login }: Values.FromModel<UserFormModel>) => {
      if (login === 'Alex') return true;

      throw new Error('User not exist');
    });

    const form = new Form(UserFormModel, {
      initialValues: {
        login: 'nonExistLogin',
      },
      onSubmit: handleSubmit,
    });

    await form.handleSubmit();

    expect(form.submitFailed).toBeTruthy();
    expect(form.errorMessage).toBe('User not exist');
  });
});
