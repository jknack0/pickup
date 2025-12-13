import { Avatar as MuiAvatar, type AvatarProps as MuiAvatarProps } from '@mui/material';

export type AvatarProps = MuiAvatarProps;

export const Avatar = (props: AvatarProps) => {
  return <MuiAvatar {...props} />;
};
