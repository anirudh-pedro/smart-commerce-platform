import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Monitor, Route, Share2, Package, ShoppingCart } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const Sidebar: React.FC = () => {
  const { events } = useSocket();
  const recent = events.slice(0, 5);

  const getBadgeColor = (type: string) => {
    if (type.includes('ORDER')) return 'bg-blue-500';
    if (type.includes('INVENTORY')) return 'bg-orange-500';
    if (type.includes('ANALYTICS')) return 'bg-green-500';
    return 'bg-purple-500';
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-full flex-shrink-0">
      <div className="p-6 font-bold text-xl text-white tracking-wider flex items-center gap-2">
         <Package className="w-6 h-6 text-blue-500" />
         Smart Commerce
      </div>
      <div className="flex flex-col gap-1 px-4 flex-1">
        <NavLink to="/" end className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 font-medium text-white' : 'hover:bg-slate-800'}`}><LayoutDashboard size={20}/> Dashboard</NavLink>
        <NavLink to="/events" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 font-medium text-white' : 'hover:bg-slate-800'}`}><Activity size={20}/> Live Events</NavLink>
        <NavLink to="/system-health" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 font-medium text-white' : 'hover:bg-slate-800'}`}><Monitor size={20}/> System Health</NavLink>
        <NavLink to="/order-tracker" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 font-medium text-white' : 'hover:bg-slate-800'}`}><Route size={20}/> Order Tracker</NavLink>
        <NavLink to="/architecture" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 font-medium text-white' : 'hover:bg-slate-800'}`}><Share2 size={20}/> Architecture</NavLink>
        <NavLink to="/demo" className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg transition-colors mt-6 text-yellow-400 border border-yellow-500/20 ${isActive ? 'bg-yellow-500/20' : 'hover:bg-slate-800'}`}><Package size={20}/> Interview Demo</NavLink>
      </div>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="flex flex-col gap-2">
          {recent.map((ev, i) => (
            <div key={i} className="flex flex-col bg-slate-800/50 p-2 rounded border border-slate-700/50 text-xs">
              <span className="font-bold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getBadgeColor(ev.type)}`}></span> 
                {ev.type}
              </span>
              <span className="text-slate-500 ml-4">{new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {recent.length === 0 && <span className="text-sm text-slate-500">No events yet...</span>}
        </div>
      </div>
    </div>
  );
};
