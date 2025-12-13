import {
  DialogContentText as MuiDialogContentText,
  type DialogContentTextProps as MuiDialogContentTextProps,
} from '@mui/material';

export type DialogContentTextProps = MuiDialogContentTextProps;

export const DialogContentText = (props: DialogContentTextProps) => {
  return <MuiDialogContentText {...props} />;
};
