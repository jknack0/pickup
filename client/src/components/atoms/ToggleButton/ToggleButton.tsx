import {
  ToggleButton as MuiToggleButton,
  type ToggleButtonProps as MuiToggleButtonProps,
} from '@mui/material';

export type ToggleButtonProps = MuiToggleButtonProps;

export const ToggleButton = (props: ToggleButtonProps) => {
  return <MuiToggleButton {...props} />;
};
