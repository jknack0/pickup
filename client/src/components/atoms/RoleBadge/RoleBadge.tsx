import { Chip, type ChipProps } from '@mui/material';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import ModeratorIcon from '@mui/icons-material/Shield';
import MemberIcon from '@mui/icons-material/Person';
import { GroupRole } from '@pickup/shared';

export interface RoleBadgeProps {
  role: GroupRole;
  size?: 'small' | 'medium';
  showIcon?: boolean;
}

const roleConfig: Record<
  GroupRole,
  { label: string; color: ChipProps['color']; icon: React.ReactElement }
> = {
  [GroupRole.ADMIN]: {
    label: 'Admin',
    color: 'error',
    icon: <AdminIcon fontSize="small" />,
  },
  [GroupRole.MODERATOR]: {
    label: 'Moderator',
    color: 'warning',
    icon: <ModeratorIcon fontSize="small" />,
  },
  [GroupRole.MEMBER]: {
    label: 'Member',
    color: 'default',
    icon: <MemberIcon fontSize="small" />,
  },
};

/**
 * Display a role badge with color-coded styling
 */
export const RoleBadge = ({ role, size = 'small', showIcon = true }: RoleBadgeProps) => {
  const config = roleConfig[role];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      icon={showIcon ? config.icon : undefined}
      sx={{ fontWeight: 500 }}
    />
  );
};

export default RoleBadge;
