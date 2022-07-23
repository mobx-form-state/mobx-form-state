import { Route, Routes } from 'react-router-dom';

import { FieldArrayFormPage } from './field-array';
import { IntroductionPage } from './introduction';
import { Layout } from './layout';
import { SimpleFormPage } from './simple-form';

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<IntroductionPage />} />
      <Route path="/examples">
        <Route path="simple" element={<SimpleFormPage />} />
        <Route path="field-array" element={<FieldArrayFormPage />} />
      </Route>

      <Route path="*" element={<div>Not found</div>} />
    </Route>
  </Routes>
);
