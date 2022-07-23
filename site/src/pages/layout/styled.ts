import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  height: 100vh;
`;

export const Aside = styled.div`
  flex: 0 0 300px;
  height: 100%;
`;

export const Container = styled.div`
  flex: 1;
  min-width: 1000px;
  display: flex;
  justify-content: flex-start;
  overflow-y: scroll;

  @media (min-width: 1620px) {
    justify-content: center;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    color: #34404e;
    margin-bottom: 2rem;
  }
  h2 {
    color: #34404e;

    margin: 2rem 0;
  }
  a {
    color: #e26f6f;
  }
`;

export const Content = styled.div`
  padding: 3rem;
  box-sizing: border-box;
  width: 960px;
`;

export const List = styled.ul<{ listStyle?: 'disc' }>`
  list-style-type: ${({ listStyle }) => listStyle || 'none'};
  li {
    margin-bottom: 0.5rem;

    code {
      padding: 3px;
      margin: 0;
      font-size: 14px;
      background-color: #f7f7f7;
    }
  }
`;

export const Block = styled.div`
  margin: 2rem 0.5rem;
`;
