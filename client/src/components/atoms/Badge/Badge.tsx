import { Badge as MuiBadge, type BadgeProps as MuiBadgeProps } from '@mui/material';

export type BadgeProps = MuiBadgeProps;

export const Badge = (props: BadgeProps) => {
  return <MuiBadge {...props} />;
};
