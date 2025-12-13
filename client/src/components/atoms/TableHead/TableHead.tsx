import { TableHead as MuiTableHead, type TableHeadProps as MuiTableHeadProps } from '@mui/material';

export type TableHeadProps = MuiTableHeadProps;

export const TableHead = (props: TableHeadProps) => {
  return <MuiTableHead {...props} />;
};
