import { field, fieldArray } from '../src/decorators';
import { FieldArrayType } from '../src/field-array';
import { EmailsModel } from './Emails.model';
import { Hobby } from './Hobby.model';
import { minLength, required, trim, willThrowAnError } from './utils';

export class UserFormModel extends EmailsModel {
  @field({ validate: [required(), minLength(3)] })
  login = 'login';

  @field({ validate: [required(), minLength(8)], parse: [trim()] })
  password = 'password';

  @fieldArray(Hobby)
  hobbies?: FieldArrayType<Hobby>;

  @field({ validate: willThrowAnError() })
  employed = false;

  @field()
  sause = '';

  @field()
  flavor?: string[] = [];
}
