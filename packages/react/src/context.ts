import { createContext } from 'react';
import { Field } from '@mobx-form-state/core';

export const FieldContext = createContext<Field | undefined>(undefined);
