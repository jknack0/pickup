import { Popper as MuiPopper, type PopperProps as MuiPopperProps } from '@mui/material';

export type PopperProps = MuiPopperProps;

export const Popper = (props: PopperProps) => {
  return <MuiPopper {...props} />;
};
