import { Field } from '@mobx-form-state/core';
import { createContext } from 'react';

export const FieldContext = createContext<Field | undefined>(undefined);
