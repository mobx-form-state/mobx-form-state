import { Code } from 'site/src/components/code';

import { Block, Content } from '../layout';
import { LoginForm } from './login-form';

export const SimpleFormPage = () => {
  return (
    <Content>
      <h1>Simple example</h1>

      <Block>
        <a
        //   href=""
        //   target="_blank"
        >
          Link to github with source
        </a>
      </Block>

      <LoginForm />

      <h2>Typescript Example</h2>
      <Code file={import('!!./login-form.model?raw')} fileName="login-form.model.ts" />
      <Code file={import('!!./login-form.tsx?raw')} fileName="login-form.tsx" />
    </Content>
  );
};
