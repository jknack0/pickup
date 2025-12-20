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
  const organizerId = typeof organizer === 'object' ? organizer._id : organizer;
  const organizerName = typeof organizer === 'object' ? organizer.firstName : 'Organizer';

  return (
    <Card elevation={0} variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">Attendees</Typography>
            <Chip label={`${attendees.length}`} size="small" />
          </Box>
          {isOrganizer && !isCanceled && (
            <IconButton
              size="small"
              onClick={onAddAttendeeClick}
              title="Add Attendee"
              color="primary"
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
                  p={1}
                  bgcolor="background.default"
                  borderRadius={1}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                      {user?.firstName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  {/* Don't remove organizer (self) */}
                  {user?._id !== organizerId && (
                    <IconButton
                      size="small"
                      onClick={() => onRemoveAttendee(user?._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <AvatarGroup max={7} sx={{ justifyContent: 'flex-start' }}>
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
          <Typography variant="body2" color="text.secondary">
            Organized by <strong>{organizerName}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendeeList;
