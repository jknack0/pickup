import { MenuItem as MuiMenuItem, type MenuItemProps as MuiMenuItemProps } from '@mui/material';

export type MenuItemProps = MuiMenuItemProps;

export const MenuItem = (props: MenuItemProps) => {
  return <MuiMenuItem {...props} />;
};
