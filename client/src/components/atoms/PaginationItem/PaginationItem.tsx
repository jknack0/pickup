import {
  PaginationItem as MuiPaginationItem,
  type PaginationItemProps as MuiPaginationItemProps,
} from '@mui/material';

export type PaginationItemProps = MuiPaginationItemProps;

export const PaginationItem = (props: PaginationItemProps) => {
  return <MuiPaginationItem {...props} />;
};
