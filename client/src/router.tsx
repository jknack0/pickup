import { createBrowserRouter } from 'react-router-dom';
import { Signup } from '@pages/Signup';
import { Login } from '@pages/Login';
import { Landing } from '@pages/Landing';
import Dashboard from '@/components/pages/Dashboard';
import CreateEvent from '@/components/pages/CreateEvent/CreateEvent';
import EventDetails from '@/components/pages/EventDetails/EventDetails';
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
    element: (
      <ProtectedLayout>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </ProtectedLayout>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/events/new',
        element: <CreateEvent />,
      },
      {
        path: '/events/:id',
        element: <EventDetails />,
      },
    ],
  },
]);
