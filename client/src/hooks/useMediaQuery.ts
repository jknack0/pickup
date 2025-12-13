import {
  useMediaQuery as useMuiMediaQuery,
  type UseMediaQueryOptions,
  type Theme,
} from '@mui/material';

export const useMediaQuery = (
  queryInput: string | ((theme: Theme) => string),
  options?: UseMediaQueryOptions,
) => {
  return useMuiMediaQuery(queryInput, options);
};
