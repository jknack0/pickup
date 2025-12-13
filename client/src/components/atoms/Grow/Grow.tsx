import { Grow as MuiGrow, type GrowProps as MuiGrowProps } from '@mui/material';

export type GrowProps = MuiGrowProps;

export const Grow = (props: GrowProps) => {
  return <MuiGrow {...props} />;
};
