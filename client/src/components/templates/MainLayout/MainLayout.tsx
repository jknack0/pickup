import { type ReactNode, type MouseEvent, useState } from 'react';
import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';
import { Container } from '@atoms/Container';
import { Drawer } from '@atoms/Drawer';
import { Box } from '@atoms/Box';
import { List } from '@atoms/List';
import { ListItem } from '@atoms/ListItem';
import { ListItemButton } from '@atoms/ListItemButton';
import { ListItemText } from '@atoms/ListItemText';

import { useNavigate } from 'react-router-dom';
import { useLogout, useUser } from '@hooks/useAuth';
import { useMyEvents } from '@hooks/useEvents';
import {
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import { EventStatus } from '@pickup/shared';

const drawerWidth = 240;

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { mutate: logout } = useLogout();
  const { data: userData } = useUser();
  const navigate = useNavigate();
  const { data: events } = useMyEvents();
  const [eventsOpen, setEventsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  // We can use this if we want conditional rendering logic in JS,
  // but CSS display properties are often smoother for SSR/hydration.
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

  const filteredEvents = events?.filter((event) => event.status !== EventStatus.CANCELED);

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/dashboard');
                if (!isDesktop) setMobileOpen(false);
              }}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => setEventsOpen(!eventsOpen)}>
              <ListItemText primary="Events" />
              {eventsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={eventsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {filteredEvents?.map((event) => (
                <ListItemButton
                  key={event._id}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    navigate(`/events/${event._id}`);
                    if (!isDesktop) setMobileOpen(false);
                  }}
                >
                  <ListItemText primary={event.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => logout(undefined, { onSuccess: () => navigate('/') })}
              sx={{ justifyContent: 'center' }}
            >
              <ListItemText primary="Sign Out" primaryTypographyProps={{ align: 'center' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  const userInitials =
    userData?.user?.firstName && userData?.user?.lastName
      ? `${userData.user.firstName[0]}${userData.user.lastName[0]}`.toUpperCase()
      : 'U';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'primary.main',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' }, color: 'background.default', zIndex: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: 'background.default',
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                // On mobile, center title if drawer icon is present?
                // Using flexGrow 1 pushes the avatar to the end.
              }}
            >
              Pickup
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                      width: 32,
                      height: 32,
                      fontSize: 14,
                    }}
                  >
                    {userInitials}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleNavigateProfile}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
