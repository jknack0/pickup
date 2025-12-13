import { Menu as MuiMenu, type MenuProps as MuiMenuProps } from '@mui/material';

export type MenuProps = MuiMenuProps;

export const Menu = (props: MenuProps) => {
  return <MuiMenu {...props} />;
};
