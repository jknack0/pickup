import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from '@mui/material';

export type SwitchProps = MuiSwitchProps;

export const Switch = (props: SwitchProps) => {
  return <MuiSwitch {...props} />;
};
