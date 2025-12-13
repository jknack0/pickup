import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material';

export type LinkProps = MuiLinkProps;

export const Link = (props: LinkProps) => {
  return <MuiLink {...props} />;
};
