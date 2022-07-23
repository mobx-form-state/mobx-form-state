import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import styled from 'styled-components';

import { NavLink } from '../../components/nav-link';

export const Sidebar = () => (
  <Drawer variant="persistent" open>
    <NavLink as={Logo} to="/">
      🚀 Mobx form state
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

const Logo = styled.a`
  display: block;
  cursor: pointer;
  text-align: center;
  color: rgb(78 78 98);
  font-size: 24px;
  padding: 20px 10px;
`;
