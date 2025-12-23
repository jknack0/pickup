import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import SearchIcon from '@mui/icons-material/Search';
import { useMyEvents } from '@/hooks/useEvents';
import { useMyGroups, usePublicGroups } from '@/hooks/useGroups';
import EventCard from '@/components/molecules/EventCard/EventCard';
import GroupCard from '@/components/molecules/GroupCard/GroupCard';
import { useNavigate } from 'react-router-dom';
import { EventStatus, GroupRole } from '@pickup/shared';
import { useUser } from '@/hooks/useAuth';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events = [], isLoading: isLoadingEvents, error: eventsError } = useMyEvents();
  const { data: groups = [], isLoading: isLoadingGroups, error: groupsError } = useMyGroups();
  const { data: publicGroupsData, isLoading: isLoadingPublic } = usePublicGroups({
    search: searchQuery,
  });
  const { data: userData } = useUser();

  const firstName = userData?.user?.firstName || 'there';
  const userId = userData?.user?._id;

  const publicGroups = publicGroupsData?.groups || [];

  // Filter to non-group events (group events show under their groups)
  const activeEvents = React.useMemo(
    () => events.filter((event) => event.status !== EventStatus.CANCELED && !event.group),
    [events],
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isLoading = isLoadingEvents || isLoadingGroups;
  const error = eventsError || groupsError;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: dark.accent }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load data</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${dark.light} 0%, ${alpha(dark.accent, 0.2)} 100%)`,
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${dark.accentGlow} 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: dark.textActive,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Welcome back, {firstName}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: dark.text,
              maxWidth: 500,
            }}
          >
            Manage your events, groups, and organize your next pickup game.
          </Typography>
        </Box>
      </Box>

      {/* Tabs Section */}
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
              label={`Events (${activeEvents.length})`}
            />
            <Tab
              icon={<GroupsIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label={`My Groups (${groups.length})`}
            />
            <Tab
              icon={<SearchIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Discover"
            />
          </Tabs>
        </Box>

        {/* Events Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            {/* Create Event Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/events/new')}
                sx={{
                  background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                  boxShadow: `0 4px 15px ${alpha(dark.accent, 0.4)}`,
                  px: 3,
                  py: 1.25,
                  borderRadius: '10px',
                  fontWeight: 600,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                    boxShadow: `0 6px 20px ${alpha(dark.accent, 0.5)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Create Event
              </Button>
            </Box>

            {activeEvents.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  px: 4,
                  bgcolor: alpha(dark.main, 0.3),
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: alpha(dark.textActive, 0.2),
                }}
              >
                <Typography variant="h6" sx={{ color: dark.textActive }} gutterBottom>
                  No events yet
                </Typography>
                <Typography variant="body2" sx={{ color: dark.text }}>
                  Create your first event or join one to get started!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {activeEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* My Groups Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/groups/new')}
                sx={{
                  background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                  boxShadow: `0 4px 15px ${alpha(dark.accent, 0.4)}`,
                  px: 3,
                  py: 1.25,
                  borderRadius: '10px',
                  fontWeight: 600,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                    boxShadow: `0 6px 20px ${alpha(dark.accent, 0.5)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Create Group
              </Button>
            </Box>

            {groups.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  px: 4,
                  bgcolor: alpha(dark.main, 0.3),
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: alpha(dark.textActive, 0.2),
                }}
              >
                <Typography variant="h6" sx={{ color: dark.textActive }} gutterBottom>
                  No groups yet
                </Typography>
                <Typography variant="body2" sx={{ color: dark.text }}>
                  Create a group or check out the Discover tab!
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {groups.map((group) => {
                  const userMember = group.members?.find((m) => {
                    const memberId =
                      typeof m.user === 'object' ? (m.user as { _id: string })._id : m.user;
                    return memberId === userId;
                  });
                  return (
                    <GroupCard
                      key={group._id}
                      group={group}
                      userRole={userMember?.role as GroupRole | undefined}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Discover Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                placeholder="Search public groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: dark.text }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: 400,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: dark.main,
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: alpha(dark.textActive, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: dark.accent,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: dark.accent,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: dark.textActive,
                  },
                }}
              />
            </Box>

            {isLoadingPublic ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={32} sx={{ color: dark.accent }} />
              </Box>
            ) : publicGroups.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  px: 4,
                  bgcolor: alpha(dark.main, 0.3),
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: alpha(dark.textActive, 0.2),
                }}
              >
                <Typography variant="h6" sx={{ color: dark.textActive }} gutterBottom>
                  {searchQuery ? 'No groups found' : 'No public groups available'}
                </Typography>
                <Typography variant="body2" sx={{ color: dark.text }}>
                  {searchQuery ? 'Try a different search term' : 'Be the first to create one!'}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {publicGroups.map((group) => {
                  const userMember = group.members?.find((m) => {
                    const memberId =
                      typeof m.user === 'object' ? (m.user as { _id: string })._id : m.user;
                    return memberId === userId;
                  });
                  return (
                    <GroupCard
                      key={group._id}
                      group={group}
                      userRole={userMember?.role as GroupRole | undefined}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Dashboard;
