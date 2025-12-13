import {
  SpeedDialIcon as MuiSpeedDialIcon,
  type SpeedDialIconProps as MuiSpeedDialIconProps,
} from '@mui/material';

export type SpeedDialIconProps = MuiSpeedDialIconProps;

export const SpeedDialIcon = (props: SpeedDialIconProps) => {
  return <MuiSpeedDialIcon {...props} />;
};
