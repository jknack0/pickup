import { createBrowserRouter } from 'react-router-dom';
import { Signup } from '@pages/Signup';
import { Login } from '@pages/Login';
import { Landing } from '@pages/Landing';
import { DashboardHome } from '@pages/DashboardHome';
import { MainLayout } from '@templates/MainLayout';
import { ProtectedLayout } from '@templates/ProtectedLayout';
import { Outlet } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedLayout>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedLayout>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      // Future sub-routes can go here
    ],
  },
]);
