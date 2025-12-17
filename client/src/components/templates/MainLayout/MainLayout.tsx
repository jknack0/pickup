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
import { useMyEvents } from '@hooks/useEvents';
import { Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

const drawerWidth = 240;

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const { data: events } = useMyEvents();
  const [eventsOpen, setEventsOpen] = useState(true);

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
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 700, color: 'background.default' }}
          >
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
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/dashboard')}>
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
                  {events?.map((event) => (
                    <ListItemButton
                      key={event._id}
                      sx={{ pl: 4 }}
                      onClick={() => navigate(`/events/${event._id}`)}
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
