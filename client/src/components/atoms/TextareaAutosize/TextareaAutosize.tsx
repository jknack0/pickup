import {
  TextareaAutosize as MuiTextareaAutosize,
  type TextareaAutosizeProps as MuiTextareaAutosizeProps,
} from '@mui/material';

export type TextareaAutosizeProps = MuiTextareaAutosizeProps;

export const TextareaAutosize = (props: TextareaAutosizeProps) => {
  return <MuiTextareaAutosize {...props} />;
};
