import { NoSsr as MuiNoSsr, type NoSsrProps as MuiNoSsrProps } from '@mui/material';

export type NoSsrProps = MuiNoSsrProps;

export const NoSsr = (props: NoSsrProps) => {
  return <MuiNoSsr {...props} />;
};
