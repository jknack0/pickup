import { Typography } from '../../atoms/Typography';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export const AuthHeader = ({
  title,
  subtitle = 'Create your account to get started',
}: AuthHeaderProps) => {
  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{ fontWeight: 700, color: 'text.primary' }}
      >
        {title}
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
    </>
  );
};
