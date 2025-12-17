import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'grey.100',
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'primary.main' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer', color: 'background.default' }}
              onClick={() => navigate('/')}
            >
              Pickup
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
