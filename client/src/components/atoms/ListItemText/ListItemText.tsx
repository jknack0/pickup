import {
  ListItemText as MuiListItemText,
  type ListItemTextProps as MuiListItemTextProps,
} from '@mui/material';

export type ListItemTextProps = MuiListItemTextProps;

export const ListItemText = (props: ListItemTextProps) => {
  return <MuiListItemText {...props} />;
};
