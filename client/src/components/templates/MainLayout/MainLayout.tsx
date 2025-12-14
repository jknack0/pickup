import { type ReactNode } from 'react';
import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';
import { Drawer } from '@atoms/Drawer';
import { Box } from '@atoms/Box';
import { List } from '@atoms/List';
import { ListItem } from '@atoms/ListItem';
import { ListItemButton } from '@atoms/ListItemButton';
import { ListItemText } from '@atoms/ListItemText';

import { useNavigate } from 'react-router-dom';
import { useLogout } from '@hooks/useAuth';

const drawerWidth = 240;

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Pickup
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
            <List>
              {['Dashboard', 'My Games', 'Profile', 'Settings'].map((text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
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
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
