import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { SocketProvider } from '../context/SocketContext';

export const DashboardLayout: React.FC = () => {
  return (
    <SocketProvider>
      <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-1 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};
