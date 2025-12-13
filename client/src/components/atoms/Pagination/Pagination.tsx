import {
  Pagination as MuiPagination,
  type PaginationProps as MuiPaginationProps,
} from '@mui/material';

export type PaginationProps = MuiPaginationProps;

export const Pagination = (props: PaginationProps) => {
  return <MuiPagination {...props} />;
};
