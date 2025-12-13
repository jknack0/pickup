import { Box as MuiBox, type BoxProps as MuiBoxProps } from '@mui/material';

export type BoxProps = MuiBoxProps;

export const Box = (props: BoxProps) => {
  return <MuiBox {...props} />;
};
