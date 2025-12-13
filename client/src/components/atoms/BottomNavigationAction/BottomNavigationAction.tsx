import {
  BottomNavigationAction as MuiBottomNavigationAction,
  type BottomNavigationActionProps as MuiBottomNavigationActionProps,
} from '@mui/material';

export type BottomNavigationActionProps = MuiBottomNavigationActionProps;

export const BottomNavigationAction = (props: BottomNavigationActionProps) => {
  return <MuiBottomNavigationAction {...props} />;
};
