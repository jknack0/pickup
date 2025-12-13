import {
  Typography as MuiTypography,
  type TypographyProps as MuiTypographyProps,
} from '@mui/material';

export type TypographyProps = MuiTypographyProps;

export const Typography = (props: TypographyProps) => {
  return <MuiTypography {...props} />;
};
