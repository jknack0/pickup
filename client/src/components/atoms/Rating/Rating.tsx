import { Rating as MuiRating, type RatingProps as MuiRatingProps } from '@mui/material';

export type RatingProps = MuiRatingProps;

export const Rating = (props: RatingProps) => {
  return <MuiRating {...props} />;
};
