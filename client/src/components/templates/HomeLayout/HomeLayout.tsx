import { type ReactNode } from 'react';
import { Box } from '@atoms/Box';
import { HomeHeader } from '@organisms/HomeHeader';
import { useTheme } from '@mui/material';

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  const theme = useTheme();
  const dark = theme.palette.dark;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <HomeHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          mt: 'auto',
          backgroundColor: dark.main,
          borderTop: `1px solid ${dark.divider}`,
        }}
      >
        <Box sx={{ maxWidth: 'lg', mx: 'auto', textAlign: 'center', color: dark.text }}>
          © {new Date().getFullYear()} Pickup. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
};
