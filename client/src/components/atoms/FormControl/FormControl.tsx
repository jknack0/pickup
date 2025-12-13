import {
  FormControl as MuiFormControl,
  type FormControlProps as MuiFormControlProps,
} from '@mui/material';

export type FormControlProps = MuiFormControlProps;

export const FormControl = (props: FormControlProps) => {
  return <MuiFormControl {...props} />;
};
