import {
  ListItemIcon as MuiListItemIcon,
  type ListItemIconProps as MuiListItemIconProps,
} from '@mui/material';

export type ListItemIconProps = MuiListItemIconProps;

export const ListItemIcon = (props: ListItemIconProps) => {
  return <MuiListItemIcon {...props} />;
};
