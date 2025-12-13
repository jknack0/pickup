import { ListItem as MuiListItem, type ListItemProps as MuiListItemProps } from '@mui/material';

export type ListItemProps = MuiListItemProps;

export const ListItem = (props: ListItemProps) => {
  return <MuiListItem {...props} />;
};
