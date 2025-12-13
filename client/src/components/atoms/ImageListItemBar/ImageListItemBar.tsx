import {
  ImageListItemBar as MuiImageListItemBar,
  type ImageListItemBarProps as MuiImageListItemBarProps,
} from '@mui/material';

export type ImageListItemBarProps = MuiImageListItemBarProps;

export const ImageListItemBar = (props: ImageListItemBarProps) => {
  return <MuiImageListItemBar {...props} />;
};
