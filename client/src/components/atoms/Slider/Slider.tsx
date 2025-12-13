import { Slider as MuiSlider, type SliderProps as MuiSliderProps } from '@mui/material';

export type SliderProps = MuiSliderProps;

export const Slider = (props: SliderProps) => {
  return <MuiSlider {...props} />;
};
