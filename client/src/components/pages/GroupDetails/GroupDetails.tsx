import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { useGroup, useGroupEvents, useJoinGroup, useLeaveGroup } from '@/hooks/useGroups';
import { useUser } from '@/hooks/useAuth';
import { GroupAvatar } from '@/components/atoms/GroupAvatar';
import { RoleBadge } from '@/components/atoms/RoleBadge';
import { GroupVisibility, GroupJoinPolicy, GroupRole } from '@pickup/shared';
import { useSnackbar } from 'notistack';
import EventCard from '@/components/molecules/EventCard';

const joinPolicyLabels: Record<GroupJoinPolicy, string> = {
  [GroupJoinPolicy.OPEN]: 'Open',
  [GroupJoinPolicy.REQUEST]: 'Request to Join',
  [GroupJoinPolicy.INVITE_ONLY]: 'Invite Only',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`group-tabpanel-${index}`}
      aria-labelledby={`group-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;
  const { enqueueSnackbar } = useSnackbar();

  const [tabValue, setTabValue] = useState(0);

  const { data: group, isLoading, error } = useGroup(id!);
  const { data: groupEvents = [], isLoading: isLoadingEvents } = useGroupEvents(id!);
  const { data: userData } = useUser();
  const joinMutation = useJoinGroup();
  const leaveMutation = useLeaveGroup();

  const currentUserId = userData?.user?._id;

  // Check user's membership status
  type PopulatedUser = { _id: string; firstName: string; lastName: string; email: string };
  const userMember = group?.members?.find((m) => {
    const memberId = typeof m.user === 'object' ? (m.user as PopulatedUser)._id : m.user;
    return memberId === currentUserId;
  });
  const isOwner =
    group?.owner === currentUserId ||
    (typeof group?.owner === 'object' && (group.owner as { _id: string })._id === currentUserId);
  const isMember = !!userMember;
  const userRole = userMember?.role;

  const handleJoin = async () => {
    if (!id) return;
    try {
      await joinMutation.mutateAsync({ groupId: id });
      enqueueSnackbar('Successfully joined the group!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to join group', { variant: 'error' });
    }
  };

  const handleLeave = async () => {
    if (!id) return;
    try {
      await leaveMutation.mutateAsync(id);
      enqueueSnackbar('Left the group', { variant: 'success' });
      navigate('/groups');
    } catch {
      enqueueSnackbar('Failed to leave group', { variant: 'error' });
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress sx={{ color: dark.accent }} />
        </Box>
      </Container>
    );
  }

  if (error || !group) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Alert severity="error">Group not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/groups')}
          sx={{ mt: 2, color: dark.text }}
        >
          Back to Groups
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/groups')}
        sx={{
          color: dark.text,
          mb: 2,
          '&:hover': { bgcolor: alpha(dark.text, 0.1) },
        }}
      >
        Back to Groups
      </Button>

      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: dark.light,
          border: `1px solid ${alpha(dark.textActive, 0.1)}`,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <GroupAvatar name={group.name} avatarUrl={group.avatarUrl} size="large" />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: dark.textActive,
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {group.name}
              </Typography>
              <Chip
                size="small"
                label={group.visibility === GroupVisibility.PUBLIC ? 'Public' : 'Private'}
                sx={{
                  bgcolor:
                    group.visibility === GroupVisibility.PUBLIC
                      ? alpha(dark.accent, 0.2)
                      : alpha(dark.text, 0.2),
                  color: group.visibility === GroupVisibility.PUBLIC ? dark.accent : dark.text,
                }}
              />
              {userRole && <RoleBadge role={userRole} size="small" />}
            </Box>

            {group.description && (
              <Typography variant="body1" sx={{ color: dark.text, mb: 2 }}>
                {group.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {group.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationIcon sx={{ fontSize: 18, color: dark.text }} />
                  <Typography variant="body2" sx={{ color: dark.text }}>
                    {group.location}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleIcon sx={{ fontSize: 18, color: dark.text }} />
                <Typography variant="body2" sx={{ color: dark.text }}>
                  {group.members?.length || 0} members
                </Typography>
              </Box>
              <Chip
                size="small"
                label={joinPolicyLabels[group.joinPolicy]}
                variant="outlined"
                sx={{ borderColor: dark.text, color: dark.text }}
              />
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: { sm: 150 } }}>
            {!isMember && group.joinPolicy === GroupJoinPolicy.OPEN && (
              <Button
                variant="contained"
                onClick={handleJoin}
                disabled={joinMutation.isPending}
                sx={{
                  bgcolor: dark.accent,
                  color: dark.main,
                  fontWeight: 600,
                  '&:hover': { bgcolor: alpha(dark.accent, 0.85) },
                }}
              >
                {joinMutation.isPending ? 'Joining...' : 'Join Group'}
              </Button>
            )}
            {isMember && !isOwner && (
              <Button
                variant="outlined"
                onClick={handleLeave}
                disabled={leaveMutation.isPending}
                sx={{
                  borderColor: '#f87171',
                  color: '#f87171',
                  '&:hover': {
                    borderColor: '#ef4444',
                    bgcolor: alpha('#ef4444', 0.1),
                  },
                }}
              >
                {leaveMutation.isPending ? 'Leaving...' : 'Leave Group'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: dark.light,
          border: `1px solid ${alpha(dark.textActive, 0.1)}`,
          borderRadius: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: alpha(dark.textActive, 0.1) }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                color: dark.text,
                fontWeight: 500,
                '&.Mui-selected': {
                  color: dark.accent,
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: dark.accent,
              },
            }}
          >
            <Tab
              icon={<EventIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`Events (${groupEvents.length})`}
            />
            <Tab
              icon={<PeopleIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`Members (${group.members?.length || 0})`}
            />
          </Tabs>
        </Box>

        {/* Events Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            {(userRole === GroupRole.ADMIN || userRole === GroupRole.MODERATOR) && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/events/new?groupId=${id}`)}
                  sx={{
                    bgcolor: dark.accent,
                    color: dark.main,
                    '&:hover': { bgcolor: alpha(dark.accent, 0.85) },
                  }}
                >
                  Create Event
                </Button>
              </Box>
            )}

            {isLoadingEvents ? (
              <Box display="flex" justifyContent="center" py={3}>
                <CircularProgress size={24} sx={{ color: dark.accent }} />
              </Box>
            ) : groupEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: dark.text, mb: 1 }}>
                  No events yet
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(dark.text, 0.7) }}>
                  {userRole === GroupRole.ADMIN || userRole === GroupRole.MODERATOR
                    ? 'Create the first event for this group!'
                    : 'Check back later for upcoming events.'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {groupEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Members Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <List sx={{ pt: 0 }}>
              {group.members?.map((member) => {
                const user =
                  typeof member.user === 'object' ? (member.user as PopulatedUser) : null;
                const displayName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
                const initials = user
                  ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
                  : '?';

                return (
                  <ListItem key={user?._id || String(member.user)}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: dark.accent, color: dark.main }}>{initials}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayName}
                      secondary={user?.email}
                      primaryTypographyProps={{ sx: { color: dark.textActive } }}
                      secondaryTypographyProps={{ sx: { color: dark.text } }}
                    />
                    <RoleBadge role={member.role} size="small" />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default GroupDetails;
