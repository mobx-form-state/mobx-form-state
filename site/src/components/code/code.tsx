import { useState, useEffect } from 'react';
import Prism from 'prismjs';
import styled from 'styled-components';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';

type CodeProps = {
  file: Promise<{ default: string }>;
  fileName: string;
};

export const Code = (props: CodeProps) => {
  const [source, setSource] = useState('');

  useEffect(() => {
    setFile();
  }, []);

  const header = `// ${props.fileName}\n\n`;

  async function setFile() {
    try {
      const result = await props.file;
      setSource(result.default);
    } catch (e) {
      setSource(`// :( couldn't load file ${props.fileName}`);
    }
  }

  return (
    <CodeRoot>
      <h4>{props.fileName}</h4>
      <pre className="language-tsx">
        <code
          className="language-tsx"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(header + source, Prism.languages.tsx, 'tsx'),
          }}
        />
      </pre>
    </CodeRoot>
  );
};

export const CodeRoot = styled.div`
  margin-bottom: 2rem;
  pre > {
    background: #272822;
  }
`;
