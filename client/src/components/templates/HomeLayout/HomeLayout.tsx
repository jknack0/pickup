import { type ReactNode } from 'react';
import { Box } from '@atoms/Box';
import { HomeHeader } from '@organisms/HomeHeader';

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
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
      {/* Footer placeholder */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ maxWidth: 'lg', mx: 'auto', textAlign: 'center', color: 'text.secondary' }}>
          © {new Date().getFullYear()} Pickup. All rights reserved.
        </Box>
      </Box>
    </Box>
  );
};
