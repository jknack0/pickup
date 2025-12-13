import { SpeedDial as MuiSpeedDial, type SpeedDialProps as MuiSpeedDialProps } from '@mui/material';

export type SpeedDialProps = MuiSpeedDialProps;

export const SpeedDial = (props: SpeedDialProps) => {
  return <MuiSpeedDial {...props} />;
};
