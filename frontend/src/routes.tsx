import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { OrderTracker } from './pages/OrderTracker';
import { Architecture } from './pages/Architecture';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'order-tracker', element: <OrderTracker /> },
      { path: 'architecture', element: <Architecture /> },
      { path: '*', element: <Dashboard /> }
    ]
  }
]);
