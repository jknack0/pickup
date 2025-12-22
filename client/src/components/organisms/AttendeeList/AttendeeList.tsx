import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Avatar,
  AvatarGroup,
  useTheme,
  alpha,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { type IEvent } from '@pickup/shared';

// Define a local interface for the populated attendee that matches what EventDetails expects
// Accessing 'user' as full object because it is populated on the server
interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName?: string;
  email?: string;
}

interface AttendeeListProps {
  attendees: IEvent['attendees'];
  organizer: { firstName: string; _id?: string } | string; // Handle populated or ID
  currentUserId?: string;
  isOrganizer: boolean;
  isCanceled: boolean;
  onAddAttendeeClick: () => void;
  onRemoveAttendee: (userId: string) => void;
}

const AttendeeList: React.FC<AttendeeListProps> = ({
  attendees,
  organizer,
  isOrganizer,
  isCanceled,
  onAddAttendeeClick,
  onRemoveAttendee,
}) => {
  const theme = useTheme();
  const dark = theme.palette.dark;

  const organizerId = typeof organizer === 'object' ? organizer._id : organizer;
  const organizerName = typeof organizer === 'object' ? organizer.firstName : 'Organizer';

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: dark.light,
        border: `1px solid ${alpha(dark.textActive, 0.1)}`,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" sx={{ color: dark.textActive }}>
              Attendees
            </Typography>
            <Chip
              label={`${attendees.length}`}
              size="small"
              sx={{
                bgcolor: alpha(dark.accent, 0.15),
                color: dark.accent,
                fontWeight: 600,
              }}
            />
          </Box>
          {isOrganizer && !isCanceled && (
            <IconButton
              size="small"
              onClick={onAddAttendeeClick}
              title="Add Attendee"
              sx={{ color: dark.accent }}
            >
              <PersonAddIcon />
            </IconButton>
          )}
        </Box>

        {isOrganizer ? (
          <Stack spacing={1} mt={1}>
            {attendees.map((att, index) => {
              // Safety cast as per original implementation logic
              const person = att as unknown as { user: PopulatedUser };
              const user = person.user;
              const name = user ? `${user.firstName} ${user.lastName || ''}` : 'Unknown';

              return (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1.5}
                  bgcolor={alpha(dark.textActive, 0.05)}
                  border={`1px solid ${alpha(dark.textActive, 0.08)}`}
                  borderRadius={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem',
                        bgcolor: alpha(dark.accent, 0.2),
                        color: dark.accent,
                      }}
                    >
                      {user?.firstName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="500" sx={{ color: dark.textActive }}>
                        {name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: dark.text }}>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Don't remove organizer (self) */}
                  {user?._id !== organizerId && (
                    <IconButton
                      size="small"
                      onClick={() => onRemoveAttendee(user?._id)}
                      sx={{ color: theme.palette.error.main }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <AvatarGroup
            max={7}
            sx={{
              justifyContent: 'flex-start',
              '& .MuiAvatar-root': {
                bgcolor: alpha(dark.accent, 0.2),
                color: dark.accent,
                border: `2px solid ${dark.light}`,
              },
            }}
          >
            {attendees.map((att, index) => {
              const person = att as unknown as { user: PopulatedUser };
              const user = person.user;
              const name = user ? `${user.firstName} ${user.lastName || ''}` : '?';
              return (
                <Avatar key={index} alt={name}>
                  {user?.firstName?.[0]}
                </Avatar>
              );
            })}
          </AvatarGroup>
        )}

        <Box mt={2}>
          <Typography variant="body2" sx={{ color: dark.text }}>
            Organized by <strong style={{ color: dark.textActive }}>{organizerName}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendeeList;
