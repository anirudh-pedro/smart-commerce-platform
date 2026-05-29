import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const SERVICES = ['Order Service', 'Inventory Service', 'Analytics Service', 'Notification Service'];

export const SystemHealth: React.FC = () => {
  const { lastHeartbeats, connected } = useSocket();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">System Health</h1>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        
        <div className="flex justify-between items-center bg-slate-800 p-4 border-b border-slate-700">
           <span className="font-bold text-slate-200">Kafka WebSocket Broker</span>
           <StatusBadge isOnline={connected} lastEvent={null} />
        </div>

        <div className="divide-y divide-slate-800/50">
          {SERVICES.map(service => {
             const ts = lastHeartbeats[service];
             const age = ts ? (now - new Date(ts).getTime()) / 1000 : Infinity;
             // We treat < 60s as online for demo purposes since events may be rare
             const isOnline = connected && ts && age < 120; 
             
             return (
               <div key={service} className="p-6 flex justify-between items-center transition-colors hover:bg-slate-800/30">
                 <div className="flex flex-col gap-1">
                   <h3 className="font-bold text-lg text-slate-200">{service}</h3>
                   <span className="text-xs text-slate-500 font-mono">
                     Last Event: {ts ? Math.floor(age) + 's ago' : 'No heartbeat yet'}
                   </span>
                 </div>
                 <StatusBadge isOnline={!!isOnline} lastEvent={ts} />
               </div>
             );
          })}
        </div>

      </div>
    </div>
  );
};

const StatusBadge: React.FC<{isOnline: boolean, lastEvent: any}> = ({isOnline, lastEvent}) => (
  <div className={`px-4 py-2 rounded-full font-bold text-xs tracking-widest ${isOnline ? 'bg-green-500/20 text-green-400 border border-green-500/30' : lastEvent === null ? (isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
    {isOnline ? 'ONLINE' : (lastEvent === null && !isOnline) ? 'OFFLINE' : 'IDLE / AWAITING EVENTS'}
  </div>
)
