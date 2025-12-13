import { Typography } from '../../atoms/Typography';

export interface AuthHeaderProps {
  title: string;
}

export const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <Typography variant="h4" component="h1" gutterBottom align="center">
      {title}
    </Typography>
  );
};
