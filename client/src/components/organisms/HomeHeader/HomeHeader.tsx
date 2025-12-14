import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';
import { Button } from '@atoms/Button';
import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';

import { useUser } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const HomeHeader = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();

  return (
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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                sx={{ textTransform: 'none', color: 'background.default' }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button sx={{ color: 'background.default' }} onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    bgcolor: 'background.default',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
