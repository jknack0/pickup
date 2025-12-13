import {
  ImageListItem as MuiImageListItem,
  type ImageListItemProps as MuiImageListItemProps,
} from '@mui/material';

export type ImageListItemProps = MuiImageListItemProps;

export const ImageListItem = (props: ImageListItemProps) => {
  return <MuiImageListItem {...props} />;
};
