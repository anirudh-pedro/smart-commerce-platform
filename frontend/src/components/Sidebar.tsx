import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Route, Share2, Package, ShoppingCart } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const Sidebar: React.FC = () => {
  const { events } = useSocket();
  const recent = events.slice(0, 5);

  return (
    <div className="w-64 bg-black border-r border-neutral-800 text-neutral-300 flex flex-col h-full flex-shrink-0">
      <div className="p-6 font-bold text-xl text-white tracking-wider flex items-center gap-2">
         <Package className="w-6 h-6 text-white" />
         Smart Commerce
      </div>
      <div className="flex flex-col gap-1 px-4 flex-1 mt-4">
        <NavLink to="/" end className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors font-medium border border-transparent ${isActive ? 'bg-white text-black border-white' : 'hover:bg-neutral-900 hover:text-white'}`}><LayoutDashboard size={18}/> Dashboard</NavLink>
        <NavLink to="/shop" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors font-medium border border-transparent ${isActive ? 'bg-white text-black border-white' : 'hover:bg-neutral-900 hover:text-white'}`}><ShoppingCart size={18}/> Shop</NavLink>
        <NavLink to="/order-tracker" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors font-medium border border-transparent ${isActive ? 'bg-white text-black border-white' : 'hover:bg-neutral-900 hover:text-white'}`}><Route size={18}/> Order Tracker</NavLink>
        <NavLink to="/architecture" className={({isActive}) => `flex items-center gap-3 p-3 rounded-md transition-colors font-medium border border-transparent ${isActive ? 'bg-white text-black border-white' : 'hover:bg-neutral-900 hover:text-white'}`}><Share2 size={18}/> Architecture</NavLink>
      </div>

      <div className="p-4 border-t border-neutral-800 shrink-0">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Recent Activity</h3>
        <div className="flex flex-col gap-2">
          {recent.map((ev, i) => (
            <div key={i} className="flex flex-col bg-neutral-950 p-3 rounded-md border border-neutral-800 text-xs">
              <span className="font-bold flex items-center gap-2 text-white">
                <span className={`w-2 h-2 rounded-full bg-white`}></span> 
                {ev.type}
              </span>
              <span className="text-neutral-500 ml-4 font-mono mt-1">{new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {recent.length === 0 && <span className="text-sm text-neutral-500">No events yet...</span>}
        </div>
      </div>
    </div>
  );
};
