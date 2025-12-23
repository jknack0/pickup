import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import PrivateIcon from '@mui/icons-material/Lock';
import LocationIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import type { IGroup } from '@pickup/shared';
import { GroupVisibility, GroupJoinPolicy, GroupRole } from '@pickup/shared';
import { GroupAvatar } from '@/components/atoms/GroupAvatar';
import { RoleBadge } from '@/components/atoms/RoleBadge';

export interface GroupCardProps {
  group: IGroup;
  userRole?: GroupRole | null;
}

const joinPolicyLabels: Record<GroupJoinPolicy, string> = {
  [GroupJoinPolicy.OPEN]: 'Open',
  [GroupJoinPolicy.REQUEST]: 'Request to Join',
  [GroupJoinPolicy.INVITE_ONLY]: 'Invite Only',
};

const GroupCard = ({ group, userRole }: GroupCardProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;

  const memberCount = group.members?.length || 0;
  const isPublic = group.visibility === GroupVisibility.PUBLIC;

  return (
    <Card
      elevation={0}
      sx={{
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        bgcolor: dark.light,
        border: `1px solid ${alpha(dark.textActive, 0.1)}`,
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(dark.main, 0.4)}`,
          transform: 'translateY(-2px)',
          borderColor: alpha(dark.accent, 0.4),
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/groups/${group._id}`)}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header: Avatar + Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <GroupAvatar name={group.name} avatarUrl={group.avatarUrl} size="large" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: dark.textActive,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.name}
              </Typography>
              {userRole && (
                <Box sx={{ mt: 0.5 }}>
                  <RoleBadge role={userRole} size="small" />
                </Box>
              )}
            </Box>
          </Box>

          {/* Description */}
          {group.description && (
            <Typography
              variant="body2"
              sx={{
                color: dark.text,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {group.description}
            </Typography>
          )}

          {/* Badges Row */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              icon={isPublic ? <PublicIcon /> : <PrivateIcon />}
              label={isPublic ? 'Public' : 'Private'}
              size="small"
              sx={{
                bgcolor: alpha(isPublic ? '#10b981' : dark.accent, 0.15),
                color: isPublic ? '#10b981' : dark.accent,
                fontWeight: 500,
              }}
            />
            <Chip
              label={joinPolicyLabels[group.joinPolicy]}
              size="small"
              sx={{
                bgcolor: alpha(dark.text, 0.1),
                color: dark.text,
                fontWeight: 500,
              }}
            />
          </Box>

          {/* Info Stack */}
          <Stack spacing={1.5} sx={{ mt: 'auto' }}>
            {/* Members */}
            <Box display="flex" gap={1.5} alignItems="center">
              <PeopleIcon sx={{ color: dark.text, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: dark.textActive }}>
                {memberCount} {memberCount === 1 ? 'member' : 'members'}
              </Typography>
            </Box>

            {/* Location */}
            {group.location && (
              <Box display="flex" gap={1.5} alignItems="center">
                <LocationIcon sx={{ color: dark.text, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: dark.textActive,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.location}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default GroupCard;
