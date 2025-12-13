import { Collapse as MuiCollapse, type CollapseProps as MuiCollapseProps } from '@mui/material';

export type CollapseProps = MuiCollapseProps;

export const Collapse = (props: CollapseProps) => {
  return <MuiCollapse {...props} />;
};
