import { Stack as MuiStack, type StackProps as MuiStackProps } from '@mui/material';

export type StackProps = MuiStackProps;

export const Stack = (props: StackProps) => {
  return <MuiStack {...props} />;
};
