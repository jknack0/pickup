import { Fade as MuiFade, type FadeProps as MuiFadeProps } from '@mui/material';

export type FadeProps = MuiFadeProps;

export const Fade = (props: FadeProps) => {
  return <MuiFade {...props} />;
};
