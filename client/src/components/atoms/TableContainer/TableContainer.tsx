import {
  TableContainer as MuiTableContainer,
  type TableContainerProps as MuiTableContainerProps,
} from '@mui/material';

export type TableContainerProps = MuiTableContainerProps;

export const TableContainer = (props: TableContainerProps) => {
  return <MuiTableContainer {...props} />;
};
