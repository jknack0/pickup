import { TableBody as MuiTableBody, type TableBodyProps as MuiTableBodyProps } from '@mui/material';

export type TableBodyProps = MuiTableBodyProps;

export const TableBody = (props: TableBodyProps) => {
  return <MuiTableBody {...props} />;
};
