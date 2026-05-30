import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { SocketProvider } from '../context/SocketContext';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout: React.FC = () => {
  return (
    <SocketProvider>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-[#09090b] text-neutral-200 overflow-hidden font-sans selection:bg-white selection:text-black">
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
