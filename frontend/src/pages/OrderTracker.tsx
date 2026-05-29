import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderTracker: React.FC = () => {
  const { events } = useSocket();
  const latestOrderId = events.find(e => e.type === 'ORDER_CREATED')?.orderId || '';
  const [search, setSearch] = useState(latestOrderId);

  // Group events by order
  const orderEvents = events.filter(e => e.orderId === search).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  const hasEvent = (type: string) => orderEvents.some(e => e.type === type);

  const steps = [
    { title: "Order Created", type: "ORDER_CREATED" },
    { title: "Inventory Updated", type: "INVENTORY_UPDATED" },
    { title: "Analytics Updated", type: "ANALYTICS_UPDATED" },
    { title: "Notification Sent", type: "NOTIFICATIONS_SENT" }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Order Journey Tracker</h1>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex gap-4 shadow-xl">
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Enter Order ID"
          className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 transition px-6 font-bold rounded text-white" onClick={() => {}}>Track</button>
      </div>

      {search && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-xl relative overflow-hidden">
           <div className="absolute left-10 top-14 bottom-14 w-0.5 bg-slate-800"></div>
           
           <div className="space-y-12 relative z-10">
             {steps.map((step, idx) => {
               const ev = orderEvents.find(e => e.type === step.type);
               const done = !!ev;
               return (
                 <motion.div 
                   key={step.type}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   className={`flex items-start gap-8 ${done ? 'opacity-100' : 'opacity-40 grayscale'}`}
                 >
                   <div className={`mt-1 rounded-full bg-slate-900 p-1 ${done ? 'text-green-500' : 'text-slate-600'}`}>
                     {done ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                   </div>
                   <div className="flex-1">
                     <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                     {done ? (
                       <>
                         <div className="text-sm font-mono text-blue-400 mb-3">{new Date(ev.timestamp).toLocaleTimeString()} - Broadcast by {ev.service}</div>
                         <div className="bg-slate-950 p-4 border border-slate-800 rounded text-xs font-mono text-slate-300 break-all">
                           {JSON.stringify(ev.payload)}
                         </div>
                       </>
                     ) : (
                       <div className="text-sm font-mono text-slate-500">Awaiting Kafka event...</div>
                     )}
                   </div>
                 </motion.div>
               )
             })}
           </div>
        </div>
      )}
    </div>
  );
};
