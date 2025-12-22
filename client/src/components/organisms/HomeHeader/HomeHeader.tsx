import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';
import { Button } from '@atoms/Button';
import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { Drawer } from '@atoms/Drawer';
import { List } from '@atoms/List';
import { ListItem } from '@atoms/ListItem';
import { ListItemButton } from '@atoms/ListItemButton';
import { ListItemText } from '@atoms/ListItemText';

import { useLogout, useUser } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export const HomeHeader = () => {
  const { data: userData } = useUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const theme = useTheme();
  const dark = theme.palette.dark;

  const user = userData?.user;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate('/') });
    handleCloseUserMenu();
  };

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : 'U';

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        backgroundColor: dark.main,
        height: '100%',
        color: dark.textActive,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 2,
          borderBottom: `1px solid ${dark.divider}`,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            backgroundColor: dark.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}
        >
          🏐
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Pickup
        </Typography>
      </Box>
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/dashboard')}
                sx={{
                  justifyContent: 'center',
                  color: dark.text,
                  '&:hover': { color: dark.textActive, bgcolor: dark.light },
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/profile')}
                sx={{
                  justifyContent: 'center',
                  color: dark.text,
                  '&:hover': { color: dark.textActive, bgcolor: dark.light },
                }}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  justifyContent: 'center',
                  color: '#f87171',
                  '&:hover': { bgcolor: alpha('#ef4444', 0.1) },
                }}
              >
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/login')}
                sx={{
                  justifyContent: 'center',
                  color: dark.text,
                  '&:hover': { color: dark.textActive, bgcolor: dark.light },
                }}
              >
                <ListItemText primary="Log In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate('/signup')}
                sx={{
                  justifyContent: 'center',
                  color: dark.accent,
                  '&:hover': { bgcolor: alpha(dark.accent, 0.1) },
                }}
              >
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: dark.main,
        borderBottom: `1px solid ${dark.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ position: 'relative', minHeight: 64 }}>
          {/* Mobile hamburger */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: dark.textActive, zIndex: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              position: { xs: 'absolute', md: 'static' },
              left: { xs: '50%', md: 'auto' },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              flexGrow: { md: 1 },
            }}
            onClick={() => navigate('/')}
          >
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
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                color: dark.textActive,
              }}
            >
              Pickup
            </Typography>
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {user ? (
              <>
                {/* Go to Dashboard button */}
                <Button
                  onClick={() => navigate('/dashboard')}
                  startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: 'none',
                    color: dark.text,
                    px: 2,
                    '&:hover': {
                      color: dark.textActive,
                      bgcolor: dark.light,
                    },
                  }}
                >
                  Dashboard
                </Button>

                {/* User Avatar with Menu */}
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
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
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  sx={{
                    mt: 1,
                    '& .MuiPaper-root': {
                      backgroundColor: dark.main,
                      border: `1px solid ${dark.divider}`,
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate('/dashboard');
                      handleCloseUserMenu();
                    }}
                    sx={{
                      color: dark.text,
                      '&:hover': { backgroundColor: dark.light, color: dark.textActive },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/profile');
                      handleCloseUserMenu();
                    }}
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
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    color: dark.text,
                    px: 2,
                    '&:hover': {
                      color: dark.textActive,
                      bgcolor: dark.light,
                    },
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    textTransform: 'none',
                    bgcolor: dark.accent,
                    color: '#ffffff',
                    px: 3,
                    '&:hover': { bgcolor: alpha(dark.accent, 0.85) },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 260,
              backgroundColor: dark.main,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </AppBar>
  );
};
