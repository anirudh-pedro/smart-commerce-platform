import React from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveEvents: React.FC = () => {
  const { events } = useSocket();

  const getColor = (type: string) => {
    if (type.includes('ORDER')) return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
    if (type.includes('INVENTORY')) return 'bg-orange-500/10 border-orange-500/50 text-orange-400';
    if (type.includes('ANALYTICS')) return 'bg-green-500/10 border-green-500/50 text-green-400';
    return 'bg-purple-500/10 border-purple-500/50 text-purple-400';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Live Event Stream</h1>
      
      <div className="space-y-4">
        <AnimatePresence>
          {events.map(ev => (
            <motion.div
              key={ev._id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className={`border rounded-lg p-5 ${getColor(ev.type)}`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg tracking-wider">[{ev.type}]</span>
                <span className="font-mono text-sm opacity-80">{new Date(ev.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm font-mono opacity-90">
                <div><span className="font-bold uppercase opacity-50 mr-2">Service:</span> {ev.service}</div>
                <div><span className="font-bold uppercase opacity-50 mr-2">Order ID:</span> {ev.orderId}</div>
              </div>
              <div className="mt-4 p-3 bg-slate-950/50 rounded overflow-x-auto text-xs font-mono font-medium text-slate-300 border border-slate-800">
                 {JSON.stringify(ev.payload, null, 2)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {events.length === 0 && <div className="text-center text-slate-500 my-20">Awaiting architectural events...</div>}
      </div>
    </div>
  );
};
