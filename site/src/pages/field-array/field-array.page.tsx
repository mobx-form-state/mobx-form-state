import { Code } from 'site/src/components/code';

import { Block, Content } from '../layout';
import { FieldArrayForm } from './field-array-form';

export const FieldArrayFormPage = () => {
  return (
    <Content>
      <h1>Field-array example</h1>

      <Block>
        <a
        //   href=""
        //   target="_blank"
        >
          Link to github with source
        </a>
      </Block>

      <FieldArrayForm />

      <h2>Typescript Example</h2>
      <Code file={import('!!./company.model?raw')} fileName="company.model.ts" />
      <Code file={import('!!./field-array-form.tsx?raw')} fileName="field-array-form.tsx" />
    </Content>
  );
};
