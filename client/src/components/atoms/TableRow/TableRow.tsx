import { TableRow as MuiTableRow, type TableRowProps as MuiTableRowProps } from '@mui/material';

export type TableRowProps = MuiTableRowProps;

export const TableRow = (props: TableRowProps) => {
  return <MuiTableRow {...props} />;
};
