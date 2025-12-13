import { Backdrop as MuiBackdrop, type BackdropProps as MuiBackdropProps } from '@mui/material';

export type BackdropProps = MuiBackdropProps;

export const Backdrop = (props: BackdropProps) => {
  return <MuiBackdrop {...props} />;
};
