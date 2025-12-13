import {
  RadioGroup as MuiRadioGroup,
  type RadioGroupProps as MuiRadioGroupProps,
} from '@mui/material';

export type RadioGroupProps = MuiRadioGroupProps;

export const RadioGroup = (props: RadioGroupProps) => {
  return <MuiRadioGroup {...props} />;
};
