import {
  ButtonGroup as MuiButtonGroup,
  type ButtonGroupProps as MuiButtonGroupProps,
} from '@mui/material';

export type ButtonGroupProps = MuiButtonGroupProps;

export const ButtonGroup = (props: ButtonGroupProps) => {
  return <MuiButtonGroup {...props} />;
};
