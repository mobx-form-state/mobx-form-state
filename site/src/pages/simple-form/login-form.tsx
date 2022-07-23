import { Control, FormElementProps, useForm } from '@mobx-form-state/react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Box } from '../../components/box';
import { Gender, LoginFormModel } from './login-form.model';

export const LoginForm = observer(() => {
  const form = useForm(LoginFormModel, {
    initialValues: {
      username: 'John Doe',
      sause: 'mustard',
    },
    onSubmit: async (values) => {
      alert(JSON.stringify(values, undefined, 2));
    },
    onSubmitSuccess: () => {
      form.reset();
    },
  });

  return (
    <Paper sx={{ padding: 4 }}>
      <form onSubmit={form.handleSubmit}>
        <Box gap={10} column>
          <Control of={TextField} field={form.fields.username} label="Username" fullWidth />
          <Control of={TextField} field={form.fields.password} label="Password" fullWidth type="password" />
          <Control
            of={FormControlLabel}
            field={form.fields.employed}
            as="checkbox"
            omitProps={['helperText', 'error']}
            control={<Checkbox />}
            label="Employed"
          />
          <Control
            field={form.fields.gender}
            of={({ onChange, value, helperText, error }: FormElementProps) => (
              <FormControl fullWidth>
                <InputLabel id="gender-select-label" variant="standard">
                  Gender
                </InputLabel>
                <Select
                  labelId="gender-select-label"
                  id="gender-select"
                  onChange={onChange}
                  value={value}
                  label="Gender"
                  variant="standard"
                >
                  <MenuItem value={Gender.Male}>Male</MenuItem>
                  <MenuItem value={Gender.Female}>Female</MenuItem>
                </Select>
                <FormHelperText error={error}>{helperText}</FormHelperText>
              </FormControl>
            )}
          />
          <FormControl>
            <FormLabel>Choose your favorite sause</FormLabel>
            <RadioGroup>
              <Control
                of={FormControlLabel}
                field={form.fields.sause}
                as="radio"
                omitProps={['helperText', 'error']}
                value="mustard"
                control={<Radio />}
                label="Mustard"
              />
              <Control
                of={FormControlLabel}
                field={form.fields.sause}
                as="radio"
                omitProps={['helperText', 'error']}
                value="ketchup"
                control={<Radio />}
                label="Ketchup"
              />
            </RadioGroup>
          </FormControl>
          <Box gap={10} justifyEnd flex={1}>
            <Button type="button" onClick={() => form.reset({})}>
              Clear
            </Button>
            <Button type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Sign In
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
});
