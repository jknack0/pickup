import {
  Breadcrumbs as MuiBreadcrumbs,
  type BreadcrumbsProps as MuiBreadcrumbsProps,
} from '@mui/material';

export type BreadcrumbsProps = MuiBreadcrumbsProps;

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  return <MuiBreadcrumbs {...props} />;
};
