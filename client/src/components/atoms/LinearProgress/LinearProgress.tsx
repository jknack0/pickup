import {
  LinearProgress as MuiLinearProgress,
  type LinearProgressProps as MuiLinearProgressProps,
} from '@mui/material';

export type LinearProgressProps = MuiLinearProgressProps;

export const LinearProgress = (props: LinearProgressProps) => {
  return <MuiLinearProgress {...props} />;
};
