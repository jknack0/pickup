import {
  DialogTitle as MuiDialogTitle,
  type DialogTitleProps as MuiDialogTitleProps,
} from '@mui/material';

export type DialogTitleProps = MuiDialogTitleProps;

export const DialogTitle = (props: DialogTitleProps) => {
  return <MuiDialogTitle {...props} />;
};
