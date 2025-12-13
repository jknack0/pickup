import {
  Autocomplete as MuiAutocomplete,
  type AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material';

export type AutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export const Autocomplete = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(
  props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
) => {
  return <MuiAutocomplete {...props} />;
};
