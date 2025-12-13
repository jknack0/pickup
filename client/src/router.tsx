import { createBrowserRouter } from 'react-router-dom';
import { Signup } from './components/pages/Signup';
import { Login } from './components/pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
