import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonProps = MuiButtonProps;

export const Button = (props: ButtonProps) => {
  return <MuiButton {...props} />;
};
