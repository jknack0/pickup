import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import { Grid } from '@/components/atoms';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useAuth';
import { useMyGroups, usePublicGroups } from '@/hooks/useGroups';
import GroupCard from '@/components/molecules/GroupCard';
import type { IGroup } from '@pickup/shared';
import { GroupRole } from '@pickup/shared';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;

  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: myGroups = [], isLoading: isLoadingMy, error: errorMy } = useMyGroups();
  const {
    data: publicData,
    isLoading: isLoadingPublic,
    error: errorPublic,
  } = usePublicGroups({ search: searchQuery || undefined });

  // Get current user
  const { data: authData } = useUser();
  const user = authData?.user;

  const publicGroups = publicData?.groups || [];

  // Get user's role in each group
  const getUserRole = (group: IGroup): GroupRole | null => {
    if (!user) return null;

    // Check if owner (handle both populated object and string ID)
    // Groups from API might have populated owner/members despite IGroup interface
    const owner = group.owner as unknown;
    let ownerId: string;

    if (typeof owner === 'string') {
      ownerId = owner;
    } else if (typeof owner === 'object' && owner !== null && '_id' in owner) {
      ownerId = (owner as { _id: string })._id;
    } else {
      ownerId = '';
    }

    if (ownerId === user._id) return GroupRole.ADMIN;

    if (!group.members) return null;

    const member = group.members.find((m) => {
      const memberUser = m.user as unknown;
      let memberId: string;

      if (typeof memberUser === 'string') {
        memberId = memberUser;
      } else if (typeof memberUser === 'object' && memberUser !== null && '_id' in memberUser) {
        memberId = (memberUser as { _id: string })._id;
      } else {
        memberId = '';
      }

      return memberId === user._id;
    });

    return member ? member.role : null;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const isLoading = tabValue === 0 ? isLoadingMy : isLoadingPublic;
  const error = tabValue === 0 ? errorMy : errorPublic;
  const groups = tabValue === 0 ? myGroups : publicGroups;

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
            Groups
          </Typography>
          <Typography variant="body1" sx={{ color: dark.text, mb: 3 }}>
            Join groups to find and create events with like-minded players.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/groups/new')}
            sx={{
              bgcolor: dark.accent,
              color: dark.main,
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: alpha(dark.accent, 0.85),
              },
            }}
          >
            Create Group
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
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
          <Tab label="My Groups" />
          <Tab label="Discover" />
        </Tabs>
      </Box>

      {/* Search (only for Discover tab) */}
      {tabValue === 1 && (
        <TextField
          fullWidth
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: dark.text }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              bgcolor: dark.light,
              '& fieldset': {
                borderColor: alpha(dark.textActive, 0.2),
              },
              '&:hover fieldset': {
                borderColor: dark.accent,
              },
            },
            '& .MuiInputBase-input': {
              color: dark.textActive,
            },
          }}
        />
      )}

      {/* Content */}
      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: dark.accent }} />
          </Box>
        ) : error ? (
          <Alert severity="error">Failed to load groups</Alert>
        ) : groups.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: dark.text,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No groups yet
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Create a group or join one to get started!
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setTabValue(1)}
              sx={{
                borderColor: dark.accent,
                color: dark.accent,
                '&:hover': {
                  borderColor: dark.accent,
                  bgcolor: alpha(dark.accent, 0.1),
                },
              }}
            >
              Discover Groups
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {groups.map((group) => (
              <Grid key={group._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <GroupCard group={group} userRole={getUserRole(group)} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {isLoadingPublic ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: dark.accent }} />
          </Box>
        ) : errorPublic ? (
          <Alert severity="error">Failed to load groups</Alert>
        ) : publicGroups.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: dark.text,
            }}
          >
            <Typography variant="h6">
              {searchQuery ? 'No groups found' : 'No public groups available'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {publicGroups.map((group) => (
              <Grid key={group._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <GroupCard group={group} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Container>
  );
};

export default Groups;
