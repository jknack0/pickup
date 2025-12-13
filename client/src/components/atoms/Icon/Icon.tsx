import { Icon as MuiIcon, type IconProps as MuiIconProps } from '@mui/material';

export type IconProps = MuiIconProps;

export const Icon = (props: IconProps) => {
  return <MuiIcon {...props} />;
};
