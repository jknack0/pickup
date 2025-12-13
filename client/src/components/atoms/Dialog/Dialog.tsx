import { Dialog as MuiDialog, type DialogProps as MuiDialogProps } from '@mui/material';

export type DialogProps = MuiDialogProps;

export const Dialog = (props: DialogProps) => {
  return <MuiDialog {...props} />;
};
