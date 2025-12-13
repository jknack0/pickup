import { Grid as MuiGrid, type GridProps as MuiGridProps } from '@mui/material';

export type GridProps = MuiGridProps;

export const Grid = (props: GridProps) => {
  return <MuiGrid {...props} />;
};
