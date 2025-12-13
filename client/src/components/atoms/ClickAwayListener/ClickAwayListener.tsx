import {
  ClickAwayListener as MuiClickAwayListener,
  type ClickAwayListenerProps as MuiClickAwayListenerProps,
} from '@mui/material';

export type ClickAwayListenerProps = MuiClickAwayListenerProps;

export const ClickAwayListener = (props: ClickAwayListenerProps) => {
  return <MuiClickAwayListener {...props} />;
};
