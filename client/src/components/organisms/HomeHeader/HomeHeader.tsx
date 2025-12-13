import { AppBar } from '@atoms/AppBar';
import { Toolbar } from '@atoms/Toolbar';
import { Typography } from '@atoms/Typography';
import { Button } from '@atoms/Button';
import { Box } from '@atoms/Box';
import { Container } from '@atoms/Container';
import { Avatar } from '@mui/material';
import { useUser } from '@hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const HomeHeader = () => {
  const { data: user } = useUser();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Pickup
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <Box
                onClick={() => navigate('/dashboard')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                title="Go to Dashboard"
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/signup')}
                  sx={{ color: 'primary.contrastText' }}
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
