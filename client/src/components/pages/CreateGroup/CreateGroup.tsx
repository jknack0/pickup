import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Paper, Link, useTheme, alpha, Stack } from '@mui/material';
import { TextField } from '@/components/atoms/TextField';
import { Button } from '@/components/atoms/Button';
import { useSnackbar } from 'notistack';
import { CreateGroupSchema, GroupVisibility, GroupJoinPolicy } from '@pickup/shared';
import type { CreateGroupInput } from '@pickup/shared';
import { useCreateGroup } from '@/hooks/useGroups';

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;
  const { enqueueSnackbar } = useSnackbar();
  const { mutateAsync: createGroup, isPending } = useCreateGroup();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(CreateGroupSchema) as Resolver<CreateGroupInput>,
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      visibility: GroupVisibility.PUBLIC,
      joinPolicy: GroupJoinPolicy.OPEN,
      location: '',
      defaultSportTypes: [],
    },
  });

  const onSubmit: SubmitHandler<CreateGroupInput> = async (data) => {
    try {
      const response = await createGroup(data);
      enqueueSnackbar('Group created successfully!', { variant: 'success' });
      navigate(`/groups/${response.data.group._id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      enqueueSnackbar(err.response?.data?.message || 'Failed to create group', {
        variant: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100%',
        py: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          backgroundColor: alpha('#ffffff', 0.98),
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: `0 25px 50px -12px ${alpha(dark.main, 0.25)}`,
          width: '100%',
          maxWidth: 500,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Create a Group
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start organizing events with your community
          </Typography>
        </Box>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Group Name"
              fullWidth
              variant="outlined"
              required
              autoFocus
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            />

            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message || 'Optional - describe your group'}
              {...register('description')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            />

            <TextField
              label="Location"
              fullWidth
              variant="outlined"
              placeholder="e.g., San Francisco, CA"
              error={!!errors.location}
              helperText={errors.location?.message || 'Where does your group meet?'}
              {...register('location')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
              }}
            />

            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  label="Visibility"
                  error={!!errors.visibility}
                  helperText={errors.visibility?.message || 'Who can see this group?'}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      '&:hover fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                >
                  <option value={GroupVisibility.PUBLIC}>
                    Public - Anyone can find this group
                  </option>
                  <option value={GroupVisibility.PRIVATE}>Private - Only visible to members</option>
                </TextField>
              )}
            />

            <Controller
              name="joinPolicy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  variant="outlined"
                  label="Join Policy"
                  error={!!errors.joinPolicy}
                  helperText={errors.joinPolicy?.message || 'How can people join?'}
                  SelectProps={{ native: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'background.paper',
                      '&:hover fieldset': { borderColor: 'primary.main' },
                    },
                  }}
                >
                  <option value={GroupJoinPolicy.OPEN}>Open - Anyone can join immediately</option>
                  <option value={GroupJoinPolicy.REQUEST}>
                    Request - Members must request to join
                  </option>
                  <option value={GroupJoinPolicy.INVITE_ONLY}>
                    Invite Only - Members need an invite code
                  </option>
                </TextField>
              )}
            />
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isPending}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
              boxShadow: `0 4px 15px ${alpha(dark.accent, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${dark.accent} 0%, #a855f7 100%)`,
                boxShadow: `0 6px 20px ${alpha(dark.accent, 0.4)}`,
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: theme.palette.action.disabledBackground,
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isPending ? 'Creating...' : 'Create Group'}
          </Button>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Changed your mind?{' '}
              <Link
                component={RouterLink}
                to="/groups"
                underline="hover"
                sx={{ fontWeight: 600, color: dark.accent }}
              >
                Back to Groups
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateGroup;
