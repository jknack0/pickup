import {
  IconButton as MuiIconButton,
  type IconButtonProps as MuiIconButtonProps,
} from '@mui/material';

export type IconButtonProps = MuiIconButtonProps;

export const IconButton = (props: IconButtonProps) => {
  return <MuiIconButton {...props} />;
};
