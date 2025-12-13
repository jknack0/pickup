import {
  BottomNavigation as MuiBottomNavigation,
  type BottomNavigationProps as MuiBottomNavigationProps,
} from '@mui/material';

export type BottomNavigationProps = MuiBottomNavigationProps;

export const BottomNavigation = (props: BottomNavigationProps) => {
  return <MuiBottomNavigation {...props} />;
};
