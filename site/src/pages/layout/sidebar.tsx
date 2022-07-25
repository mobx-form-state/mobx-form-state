import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import styled from 'styled-components';

import { NavLink } from '../../components/nav-link';
import { Logo } from '../../logo';

export const Sidebar = () => (
  <Drawer variant="persistent" open>
    <NavLink as={Home} to="/">
      <Logo /> MobX form state
    </NavLink>
    <StyledList>
      <ListItem disablePadding>
        <NavLink as={ListItemButton} dense to="">
          <ListItemText primary="Introduction" />
        </NavLink>
      </ListItem>
      <ListItem disablePadding>
        <NavLink as={ListItemButton} dense to="/examples/simple">
          <ListItemText primary="Simple" />
        </NavLink>
      </ListItem>
      <ListItem disablePadding>
        <NavLink as={ListItemButton} dense to="/examples/field-array">
          <ListItemText primary="Field-array" />
        </NavLink>
      </ListItem>
    </StyledList>
  </Drawer>
);

const StyledList = styled(List)`
  width: 280px;
`;

const Home = styled.a`
  display: flex;
  margin: 0 auto;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: gb(0, 30, 60);
  font-size: 24px;
  padding: 20px 10px;
  svg {
    font-size: 40px;
  }
`;
