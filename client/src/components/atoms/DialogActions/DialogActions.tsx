import {
  DialogActions as MuiDialogActions,
  type DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material';

export type DialogActionsProps = MuiDialogActionsProps;

export const DialogActions = (props: DialogActionsProps) => {
  return <MuiDialogActions {...props} />;
};
