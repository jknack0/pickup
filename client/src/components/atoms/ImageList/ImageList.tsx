import { ImageList as MuiImageList, type ImageListProps as MuiImageListProps } from '@mui/material';

export type ImageListProps = MuiImageListProps;

export const ImageList = (props: ImageListProps) => {
  return <MuiImageList {...props} />;
};
