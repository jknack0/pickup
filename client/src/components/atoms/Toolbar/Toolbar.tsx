import { Toolbar as MuiToolbar, type ToolbarProps as MuiToolbarProps } from '@mui/material';

export type ToolbarProps = MuiToolbarProps;

export const Toolbar = (props: ToolbarProps) => {
  return <MuiToolbar {...props} />;
};
