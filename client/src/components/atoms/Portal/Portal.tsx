import { Portal as MuiPortal, type PortalProps as MuiPortalProps } from '@mui/material';

export type PortalProps = MuiPortalProps;

export const Portal = (props: PortalProps) => {
  return <MuiPortal {...props} />;
};
