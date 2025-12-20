import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';

import type { IEvent } from '@pickup/shared';
import { useUser } from '@hooks/useAuth';
import { useJoinEvent } from '@hooks/useEvents';
import { useCreateCheckout } from '@/hooks/usePayment';
import SortableItem from '@/components/atoms/SortableItem';

interface JoinEventButtonProps {
  event: IEvent;
  onJoinSuccess?: () => void;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const JoinEventButton: React.FC<JoinEventButtonProps> = ({
  event,
  onJoinSuccess,
  variant = 'contained',
  size = 'large',
  fullWidth = false,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userData, isLoading: isUserLoading } = useUser();

  const [positionDialogOpen, setPositionDialogOpen] = React.useState(false);
  const positionOptions = ['Setter', 'Outside', 'Opposite', 'Middle', 'Libero'];
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>(positionOptions);

  const { mutate: join } = useJoinEvent(event._id);
  const { mutateAsync: createCheckout } = useCreateCheckout();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (dragEvent: DragEndEvent) => {
    const { active, over } = dragEvent;
    if (over && active.id !== over.id) {
      setSelectedPositions((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const executeJoin = (positions?: string[]) => {
    join(positions || [], {
      onSuccess: () => {
        enqueueSnackbar('You have joined the event!', { variant: 'success' });
        setPositionDialogOpen(false);
        if (onJoinSuccess) onJoinSuccess();
      },
      onError: (err: unknown) => {
        const error = err as { response?: { status: number; data?: { message?: string } } };
        const msg = error.response?.data?.message || 'Failed to join event';
        enqueueSnackbar(msg, { variant: 'error' });
        setPositionDialogOpen(false);
      },
    });
  };

  const handleConfirmPayAndJoin = async () => {
    if (event.isPaid) {
      try {
        const { url } = await createCheckout({
          eventId: event._id,
          positions: selectedPositions,
        });
        if (url) {
          window.location.href = url;
        } else {
          enqueueSnackbar('Failed to initiate payment', { variant: 'error' });
        }
      } catch {
        enqueueSnackbar('Payment error occurred', { variant: 'error' });
      }
    } else {
      executeJoin(selectedPositions);
    }
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    if (isUserLoading) return;

    if (!userData) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (event.type === 'VOLLEYBALL') {
      setPositionDialogOpen(true);
    } else {
      if (event.isPaid) {
        handleConfirmPayAndJoin();
      } else {
        executeJoin(undefined);
      }
    }
  };

  // Don't render if it's too late or cancelled? Usually button should handle this or parent.
  // We'll let parent decide visibility based on status/organizer/attending.
  // This component just renders the 'Join' action.

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleJoinClick}
        fullWidth={fullWidth}
        sx={{ zIndex: 2 }}
      >
        {event.isPaid && event.price && event.price > 0
          ? `Pay & Join ($${(event.price / 100).toFixed(2)})`
          : 'Join Event'}
      </Button>

      <Dialog
        open={positionDialogOpen}
        onClose={() => setPositionDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Select Positions</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Drag to reorder positions by preference (1st is highest priority).
          </Typography>

          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            {selectedPositions.length > 0 && (
              <Box>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={selectedPositions} strategy={verticalListSortingStrategy}>
                    {selectedPositions.map((pos, index) => (
                      <SortableItem key={pos} id={pos} index={index} />
                    ))}
                  </SortableContext>
                </DndContext>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPositionDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmPayAndJoin} variant="contained">
            Confirm & Join
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JoinEventButton;
