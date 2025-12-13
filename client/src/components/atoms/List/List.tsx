import { List as MuiList, type ListProps as MuiListProps } from '@mui/material';

export type ListProps = MuiListProps;

export const List = (props: ListProps) => {
  return <MuiList {...props} />;
};
