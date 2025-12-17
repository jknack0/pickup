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

import { useUser } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export const HomeHeader = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = user
    ? [{ label: 'Dashboard', path: '/dashboard' }]
    : [
        { label: 'Log In', path: '/login' },
        { label: 'Sign Up', path: '/signup' },
      ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        Pickup
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'primary.main' }}
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
              flexGrow: 1,
              fontWeight: 700,
              cursor: 'pointer',
              color: 'background.default',
              position: { xs: 'absolute', md: 'static' },
              // Let's just use width 100% and text-align center, but Icon is on top flow.
              // If we use absolute, we need to make sure we don't block the button.
              // Simplified approach: atomic styling adjustments.
            }}
            onClick={() => navigate('/')}
          >
            Pickup
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                sx={{ textTransform: 'none', color: 'background.default' }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button sx={{ color: 'background.default' }} onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </AppBar>
  );
};
