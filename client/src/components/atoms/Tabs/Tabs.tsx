import { Tabs as MuiTabs, type TabsProps as MuiTabsProps } from '@mui/material';

export type TabsProps = MuiTabsProps;

export const Tabs = (props: TabsProps) => {
  return <MuiTabs {...props} />;
};
