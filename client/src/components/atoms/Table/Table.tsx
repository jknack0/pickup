import { Table as MuiTable, type TableProps as MuiTableProps } from '@mui/material';

export type TableProps = MuiTableProps;

export const Table = (props: TableProps) => {
  return <MuiTable {...props} />;
};
