import {
  CircularProgress as MuiCircularProgress,
  type CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material';

export type CircularProgressProps = MuiCircularProgressProps;

export const CircularProgress = (props: CircularProgressProps) => {
  return <MuiCircularProgress {...props} />;
};
