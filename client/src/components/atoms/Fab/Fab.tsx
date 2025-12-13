import { Fab as MuiFab, type FabProps as MuiFabProps } from '@mui/material';

export type FabProps = MuiFabProps;

export const Fab = (props: FabProps) => {
  return <MuiFab {...props} />;
};
