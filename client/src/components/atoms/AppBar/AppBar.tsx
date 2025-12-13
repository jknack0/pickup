import { AppBar as MuiAppBar, type AppBarProps as MuiAppBarProps } from '@mui/material';

export type AppBarProps = MuiAppBarProps;

export const AppBar = (props: AppBarProps) => {
  return <MuiAppBar {...props} />;
};
