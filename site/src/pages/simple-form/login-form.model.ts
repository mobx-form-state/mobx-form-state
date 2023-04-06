import { field } from '@mobx-form-state/core';

import { maxLength, minLength, required, trim } from '../../utils';

export class LoginFormModel {
  @field({ validate: [required(), minLength(5), maxLength(12)], parse: [trim()] })
  name!: string;

  @field()
  hideName?: boolean = false;

  @field({ validate: [required(), minLength(5), maxLength(12)], parse: [trim()] })
  username!: string;

  @field({ parse: [trim()] })
  password!: string;

  @field()
  employed?: boolean = false;

  @field()
  gender?: Gender = Gender.Male;

  @field()
  sause!: string;
}

export enum Gender {
  Male,
  Female,
}
