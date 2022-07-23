import { type FieldArrayType, field, fieldArray } from '@mobx-form-state/core';

import { required } from '../../utils';

export class CustomerModel {
  @field({ validate: required() })
  firstName!: string;

  @field({ validate: required() })
  lastName!: string;
}

export class CompanyModel {
  @field({ validate: required() })
  name!: string;

  @fieldArray(CustomerModel)
  customers!: FieldArrayType<CustomerModel>;
}
