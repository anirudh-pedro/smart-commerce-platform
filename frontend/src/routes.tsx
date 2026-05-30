import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { OrderTracker } from './pages/OrderTracker';
import { Architecture } from './pages/Architecture';
import { Login } from './pages/Login';
import { Shop } from './pages/Shop';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'shop', element: <Shop /> },
      { path: 'order-tracker', element: <OrderTracker /> },
      { path: 'architecture', element: <Architecture /> },
      { path: '*', element: <Dashboard /> }
    ]
  }
]);
