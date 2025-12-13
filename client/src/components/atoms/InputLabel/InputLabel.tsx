import {
  InputLabel as MuiInputLabel,
  type InputLabelProps as MuiInputLabelProps,
} from '@mui/material';

export type InputLabelProps = MuiInputLabelProps;

export const InputLabel = (props: InputLabelProps) => {
  return <MuiInputLabel {...props} />;
};
