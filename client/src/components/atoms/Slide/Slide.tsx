import { Slide as MuiSlide, type SlideProps as MuiSlideProps } from '@mui/material';

export type SlideProps = MuiSlideProps;

export const Slide = (props: SlideProps) => {
  return <MuiSlide {...props} />;
};
