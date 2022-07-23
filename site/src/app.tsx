import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './pages';

const theme = createTheme({
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 3,
        sx: {
          padding: 0,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
        helperText: ' ',
      },
    },
  },
});

export const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);
