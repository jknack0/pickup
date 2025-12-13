import { Select as MuiSelect, type SelectProps as MuiSelectProps } from '@mui/material';

export type SelectProps<T = unknown> = MuiSelectProps<T>;

export const Select = <T = unknown,>(props: SelectProps<T>) => {
  return <MuiSelect {...props} />;
};
