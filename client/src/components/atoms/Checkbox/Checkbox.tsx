import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps } from '@mui/material';

export type CheckboxProps = MuiCheckboxProps;

export const Checkbox = (props: CheckboxProps) => {
  return <MuiCheckbox {...props} />;
};
