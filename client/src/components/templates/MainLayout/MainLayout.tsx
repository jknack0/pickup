import { type ReactNode } from 'react';
import { AppBar } from '../../atoms/AppBar';
import { Toolbar } from '../../atoms/Toolbar';
import { Typography } from '../../atoms/Typography';
import { Drawer } from '../../atoms/Drawer';
import { Box } from '../../atoms/Box';
import { List } from '../../atoms/List';
import { ListItem } from '../../atoms/ListItem';
import { ListItemButton } from '../../atoms/ListItemButton';
import { ListItemText } from '../../atoms/ListItemText';

const drawerWidth = 240;

export interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
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
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
