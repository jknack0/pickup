import { type ReactNode, type MouseEvent, useState } from 'react';
import { Typography } from '@atoms/Typography';
import { Drawer } from '@atoms/Drawer';
import { Box } from '@atoms/Box';
import { List } from '@atoms/List';
import { ListItem } from '@atoms/ListItem';
import { ListItemButton } from '@atoms/ListItemButton';
import { ListItemText } from '@atoms/ListItemText';
import {
  ListItemIcon,
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  alpha,
} from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout, useUser } from '@hooks/useAuth';
import { useMyEvents } from '@hooks/useEvents';
import { useMyGroups } from '@hooks/useGroups';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { EventStatus } from '@pickup/shared';
import GroupNavItem from '@/components/molecules/GroupNavItem';

const drawerWidth = 260;

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { mutate: logout } = useLogout();
  const { data: userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: events } = useMyEvents();
  const { data: myGroups } = useMyGroups();
  const [eventsOpen, setEventsOpen] = useState(true);
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const dark = theme.palette.dark;
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate('/') });
    handleCloseUserMenu();
  };

  // Filter events: exclude canceled and group events (group events show under their group)
  const filteredEvents = events?.filter(
    (event) => event.status !== EventStatus.CANCELED && !event.group,
  );

  // Check if current path matches
  const isActive = (path: string) => location.pathname === path;
  const isEventActive = (eventId: string) => location.pathname === `/events/${eventId}`;

  // Common styles for nav items
  const navItemStyles = (active: boolean) => ({
    borderRadius: '8px',
    mx: 1,
    mb: 0.5,
    color: active ? dark.textActive : dark.text,
    backgroundColor: active ? dark.paper : 'transparent',
    borderLeft: active ? `3px solid ${dark.accent}` : '3px solid transparent',
    '&:hover': {
      backgroundColor: active ? dark.paper : dark.light,
      color: dark.textActive,
    },
    transition: 'all 0.15s ease',
  });

  const userInitials =
    userData?.user?.firstName && userData?.user?.lastName
      ? `${userData.user.firstName[0]}${userData.user.lastName[0]}`.toUpperCase()
      : 'U';

  const userName =
    userData?.user?.firstName && userData?.user?.lastName
      ? `${userData.user.firstName} ${userData.user.lastName}`
      : 'User';

  const userEmail = userData?.user?.email || '';

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: dark.main,
      }}
    >
      {/* Logo area */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          borderBottom: `1px solid ${dark.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: dark.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            🏐
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: dark.textActive,
              letterSpacing: '-0.3px',
            }}
          >
            Pickup
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', flexGrow: 1, py: 2 }}>
        <List sx={{ px: 0.5 }}>
          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/dashboard');
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={navItemStyles(isActive('/dashboard'))}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <DashboardIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive('/dashboard') ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>

          {/* Groups Section */}
          <ListItem disablePadding sx={{ mt: 0.5 }}>
            <ListItemButton
              onClick={() => setGroupsOpen(!groupsOpen)}
              sx={{
                ...navItemStyles(false),
                backgroundColor: 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <GroupsIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Groups"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              />
              {groupsOpen ? (
                <ExpandLess sx={{ color: dark.text, fontSize: 20 }} />
              ) : (
                <ExpandMore sx={{ color: dark.text, fontSize: 20 }} />
              )}
            </ListItemButton>
          </ListItem>

          {/* Groups List */}
          <Collapse in={groupsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 0.5 }}>
              {/* User's Groups */}
              {myGroups?.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha(dark.text, 0.5),
                    px: 2,
                    py: 1,
                    ml: 4,
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  No groups yet
                </Typography>
              )}

              {myGroups?.map((group) => (
                <GroupNavItem
                  key={group._id}
                  group={group}
                  navItemStyles={navItemStyles}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </List>
          </Collapse>

          {/* Events Section */}
          <ListItem disablePadding sx={{ mt: 0.5 }}>
            <ListItemButton
              onClick={() => setEventsOpen(!eventsOpen)}
              sx={{
                ...navItemStyles(false),
                backgroundColor: 'transparent',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                <EventIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Events"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                }}
              />
              {eventsOpen ? (
                <ExpandLess sx={{ color: dark.text, fontSize: 20 }} />
              ) : (
                <ExpandMore sx={{ color: dark.text, fontSize: 20 }} />
              )}
            </ListItemButton>
          </ListItem>

          {/* Events List */}
          <Collapse in={eventsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 0.5 }}>
              {filteredEvents?.length === 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: alpha(dark.text, 0.5),
                    px: 2,
                    py: 1,
                    ml: 4,
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}
                >
                  No events yet
                </Typography>
              )}
              {filteredEvents?.map((event) => (
                <ListItemButton
                  key={event._id}
                  sx={{
                    ...navItemStyles(isEventActive(event._id)),
                    py: 0.625,
                  }}
                  onClick={() => {
                    navigate(`/events/${event._id}`);
                    if (!isDesktop) setMobileOpen(false);
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.title}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      fontWeight: isEventActive(event._id) ? 500 : 400,
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>

      {/* User Section at Bottom */}
      <Box sx={{ borderTop: `1px solid ${dark.divider}`, p: 1.5 }}>
        <Box
          onClick={handleOpenUserMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.15s',
            '&:hover': {
              backgroundColor: dark.light,
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: dark.accent,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {userInitials}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: dark.textActive,
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName}
            </Typography>
            <Typography
              sx={{
                color: dark.text,
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userEmail}
            </Typography>
          </Box>
          <SettingsIcon sx={{ color: dark.text, fontSize: 18 }} />
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiPaper-root': {
              backgroundColor: dark.main,
              border: `1px solid ${dark.divider}`,
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={handleNavigateProfile}
            sx={{
              color: dark.text,
              '&:hover': { backgroundColor: dark.light, color: dark.textActive },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <Divider sx={{ borderColor: dark.divider }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: '#f87171',
              '&:hover': { backgroundColor: alpha('#ef4444', 0.1) },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Mobile Header Bar - only shows hamburger */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          backgroundColor: dark.main,
          borderBottom: `1px solid ${dark.divider}`,
          alignItems: 'center',
          px: 2,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ color: dark.textActive }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: dark.textActive,
            ml: 1,
          }}
        >
          Pickup
        </Typography>
      </Box>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: dark.main,
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: dark.main,
              border: 'none',
              borderRight: `1px solid ${dark.light}`,
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: { xs: 9, md: 3 }, // Extra padding on mobile for fixed header
          width: { md: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: dark.main,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
