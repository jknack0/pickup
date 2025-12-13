import {
  DialogContent as MuiDialogContent,
  type DialogContentProps as MuiDialogContentProps,
} from '@mui/material';

export type DialogContentProps = MuiDialogContentProps;

export const DialogContent = (props: DialogContentProps) => {
  return <MuiDialogContent {...props} />;
};
