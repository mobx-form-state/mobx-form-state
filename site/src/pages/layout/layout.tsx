import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { GlobalStyle } from '../../global-style';
import { Container } from '../layout';
import { Sidebar } from './sidebar';

export const Layout = () => (
  <>
    <GlobalStyle />
    <Sidebar />
    <Main>
      <Container>
        <Outlet />
      </Container>
    </Main>
  </>
);

const Main = styled.div`
  margin-left: 300px;
  margin-right: 300px;
`;
