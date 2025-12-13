import {
  ListItemButton as MuiListItemButton,
  type ListItemButtonProps as MuiListItemButtonProps,
} from '@mui/material';

export type ListItemButtonProps = MuiListItemButtonProps;

export const ListItemButton = (props: ListItemButtonProps) => {
  return <MuiListItemButton {...props} />;
};
