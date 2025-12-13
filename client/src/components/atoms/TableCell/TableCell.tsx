import { TableCell as MuiTableCell, type TableCellProps as MuiTableCellProps } from '@mui/material';

export type TableCellProps = MuiTableCellProps;

export const TableCell = (props: TableCellProps) => {
  return <MuiTableCell {...props} />;
};
