import { Tab as MuiTab, type TabProps as MuiTabProps } from '@mui/material';

export type TabProps = MuiTabProps;

export const Tab = (props: TabProps) => {
  return <MuiTab {...props} />;
};
