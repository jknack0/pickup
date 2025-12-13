import { Paper as MuiPaper, type PaperProps as MuiPaperProps } from '@mui/material';

export type PaperProps = MuiPaperProps;

export const Paper = (props: PaperProps) => {
  return <MuiPaper {...props} />;
};
