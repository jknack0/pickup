import { Avatar } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

export interface GroupAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 56,
};

/**
 * Display a group avatar with the group's image or fallback to initials/icon
 */
export const GroupAvatar = ({ name, avatarUrl, size = 'medium' }: GroupAvatarProps) => {
  const dimension = sizeMap[size];

  // Generate initials from group name (first two words)
  const getInitials = (groupName: string): string => {
    const words = groupName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return groupName.slice(0, 2).toUpperCase();
  };

  if (avatarUrl) {
    return <Avatar src={avatarUrl} alt={name} sx={{ width: dimension, height: dimension }} />;
  }

  // If no name, show icon
  if (!name) {
    return (
      <Avatar sx={{ width: dimension, height: dimension, bgcolor: 'primary.main' }}>
        <GroupsIcon fontSize={size === 'small' ? 'small' : 'medium'} />
      </Avatar>
    );
  }

  return (
    <Avatar
      sx={{
        width: dimension,
        height: dimension,
        bgcolor: 'primary.main',
        fontSize: size === 'small' ? '0.875rem' : '1rem',
      }}
    >
      {getInitials(name)}
    </Avatar>
  );
};

export default GroupAvatar;
