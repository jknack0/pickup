import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { Typography } from '@atoms/Typography';
import { useTheme, Paper, alpha } from '@mui/material';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.dark;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        background: `linear-gradient(180deg, ${dark.main} 0%, ${dark.light} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        // Subtle glow effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: `radial-gradient(circle, ${dark.accentGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: dark.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
            }}
          >
            🏐
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: dark.textActive,
              letterSpacing: '-0.3px',
            }}
          >
            Pickup
          </Typography>
        </Box>
      </Box>

      {/* Form Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              backgroundColor: alpha('#ffffff', 0.98),
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: `0 25px 50px -12px ${alpha(dark.main, 0.5)}`,
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          textAlign: 'center',
          color: dark.text,
          fontSize: '0.875rem',
        }}
      >
        © {new Date().getFullYear()} Pickup. All rights reserved.
      </Box>
    </Box>
  );
};
