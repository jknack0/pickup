import {
  SpeedDialAction as MuiSpeedDialAction,
  type SpeedDialActionProps as MuiSpeedDialActionProps,
} from '@mui/material';

export type SpeedDialActionProps = MuiSpeedDialActionProps;

export const SpeedDialAction = (props: SpeedDialActionProps) => {
  return <MuiSpeedDialAction {...props} />;
};
