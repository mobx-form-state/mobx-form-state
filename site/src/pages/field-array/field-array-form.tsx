import { Control, useForm } from '@mobx-form-state/react';
import { Add, Delete } from '@mui/icons-material';
import { Button, FormLabel, IconButton, Paper, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { Box } from '../../components/box';
import { CompanyModel } from './company.model';

export const FieldArrayForm = observer(() => {
  const form = useForm(CompanyModel, {
    initialValues: {},
    onSubmit: async (values) => console.log(JSON.stringify(values)),
    onSubmitSuccess: () => {
      form.reset();
    },
  });

  return (
    <Paper sx={{ padding: 4 }}>
      <form onSubmit={form.handleSubmit}>
        <Box gap={10} column>
          <Control of={TextField} field={form.fields.name} label="Name" fullWidth />

          <Box justifyBetween alignCenter>
            <FormLabel>Customers</FormLabel>
            <IconButton color="primary" onClick={() => form.fields.customers.push({})}>
              <Add />
            </IconButton>
          </Box>
          {form.fields.customers.fields.map((fields, index) => (
            <Box key={index} gap={10} alignCenter>
              <Control of={TextField} field={fields.firstName} label="First Name" fullWidth />
              <Control of={TextField} field={fields.lastName} label="Last Name" fullWidth />
              <IconButton color="primary" onClick={() => form.fields.customers.remove(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}

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
