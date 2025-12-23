import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useGroupEvents } from '@/hooks/useGroups';
import type { IGroup } from '@pickup/shared';

interface GroupNavItemProps {
  group: IGroup;
  onNavigate?: () => void;
  navItemStyles: (isActive: boolean) => object;
}

const GroupNavItem: React.FC<GroupNavItemProps> = ({ group, onNavigate, navItemStyles }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dark = theme.palette.dark;
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [expanded, setExpanded] = useState(false);
  const { data: groupEvents = [] } = useGroupEvents(group._id);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleGroupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleNavigateToGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/groups/${group._id}`);
    if (!isDesktop && onNavigate) onNavigate();
  };

  const handleNavigateToEvent = (eventId: string) => {
    navigate(`/events/${eventId}`);
    if (!isDesktop && onNavigate) onNavigate();
  };

  return (
    <>
      <ListItemButton
        onClick={handleGroupClick}
        sx={{
          ...navItemStyles(isActive(`/groups/${group._id}`)),
          py: 0.75,
        }}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
          <Box
            onClick={handleNavigateToGroup}
            sx={{
              width: 18,
              height: 18,
              borderRadius: 1,
              bgcolor: dark.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              color: dark.main,
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {group.name.charAt(0).toUpperCase()}
          </Box>
        </ListItemIcon>
        <ListItemText
          primary={group.name}
          onClick={handleNavigateToGroup}
          primaryTypographyProps={{
            fontSize: '0.8rem',
            fontWeight: isActive(`/groups/${group._id}`) ? 600 : 400,
            noWrap: true,
            sx: { cursor: 'pointer' },
          }}
        />
        {groupEvents.length > 0 &&
          (expanded ? (
            <ExpandLess sx={{ color: dark.text, fontSize: 16 }} />
          ) : (
            <ExpandMore sx={{ color: dark.text, fontSize: 16 }} />
          ))}
      </ListItemButton>

      {groupEvents.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {groupEvents.map((event) => (
              <ListItemButton
                key={event._id}
                onClick={() => handleNavigateToEvent(event._id)}
                sx={{
                  ...navItemStyles(isActive(`/events/${event._id}`)),
                  py: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 28 }}>
                  <CalendarTodayIcon sx={{ fontSize: 14 }} />
                </ListItemIcon>
                <ListItemText
                  primary={event.title}
                  primaryTypographyProps={{
                    fontSize: '0.75rem',
                    fontWeight: isActive(`/events/${event._id}`) ? 600 : 400,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default GroupNavItem;
