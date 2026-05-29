import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { LiveEvents } from './pages/LiveEvents';
import { SystemHealth } from './pages/SystemHealth';
import { OrderTracker } from './pages/OrderTracker';
import { Architecture } from './pages/Architecture';
import { DemoMode } from './pages/DemoMode';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'events', element: <LiveEvents /> },
      { path: 'system-health', element: <SystemHealth /> },
      { path: 'order-tracker', element: <OrderTracker /> },
      { path: 'architecture', element: <Architecture /> },
      { path: 'demo', element: <DemoMode /> },
      { path: '*', element: <Dashboard /> }
    ]
  }
]);
