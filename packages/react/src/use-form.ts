import { Fields, Form, FormConfig } from '@mobx-form-state/core';
import { useState } from 'react';

export const useForm = <MValue>(model: Fields.ModelClass<MValue>, config?: FormConfig<MValue>): Form<MValue> => {
  const [form] = useState(() => new Form<MValue>(model, config));

  return form;
};
