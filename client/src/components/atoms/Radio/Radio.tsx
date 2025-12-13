import { Radio as MuiRadio, type RadioProps as MuiRadioProps } from '@mui/material';

export type RadioProps = MuiRadioProps;

export const Radio = (props: RadioProps) => {
  return <MuiRadio {...props} />;
};
