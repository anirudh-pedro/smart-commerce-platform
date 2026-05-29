import React from 'react';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';

export const Architecture: React.FC = () => {
  const { events } = useSocket();
  const latestEvent = events[0];

  const isActive = (service: string) => latestEvent?.service === service ? 'shadow-[0_0_30px_rgba(59,130,246,0.6)] border-blue-400 scale-105 bg-blue-900/30' : 'border-slate-700 bg-slate-800';
  const isTopicActive = !!latestEvent;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      
      {/* Client/Order Service */}
      <motion.div className={`transition-all duration-300 w-64 p-6 rounded-xl border-2 text-center relative z-10 ${isActive('Order Service')}`}>
        <div className="text-sm text-blue-400 font-bold tracking-wider mb-2">PRODUCER</div>
        <div className="text-2xl font-black text-white">Order Service</div>
      </motion.div>

      {/* Down Arrow to Kafka */}
      <div className="w-1 h-16 bg-slate-700 relative overflow-hidden">
         {latestEvent?.type === 'ORDER_CREATED' && <motion.div className="absolute inset-0 bg-blue-500" initial={{top: 0, bottom: "100%"}} animate={{bottom: 0}} /> }
      </div>

      {/* Kafka Broker */}
      <motion.div animate={{ rotate: isTopicActive ? [0, -2, 2, 0] : 0 }} className="transition-all duration-300 w-96 p-8 rounded-full border-4 border-slate-600 bg-slate-900 text-center shadow-2xl relative z-10 flex flex-col items-center justify-center aspect-[3/1]">
        <div className="text-sm text-slate-400 font-bold tracking-wider mb-1">EVENT BUS</div>
        <div className="text-3xl font-black text-white">KAFKA</div>
        <div className="text-xs font-mono mt-2 text-blue-400 mt-2">{latestEvent ? `Active Topic: ${latestEvent.topic}` : 'Awaiting Events...'}</div>
      </motion.div>

      {/* Tri-branch lines */}
      <div className="flex w-[800px] justify-between relative h-16 -mt-1">
         <div className="w-1 h-full bg-slate-700 mx-auto" />
         <div className="absolute top-0 w-full flex justify-between">
           <div className="w-1 h-16 bg-slate-700 ml-32" />
           <div className="w-1 h-16 bg-slate-700 mr-32" />
         </div>
         <div className="absolute top-0 left-32 right-32 h-1 bg-slate-700" />
      </div>

      {/* Consumers */}
      <div className="flex w-[1000px] justify-around relative z-10">
        <motion.div className={`transition-all duration-300 w-64 p-6 rounded-xl border-2 text-center ${isActive('Inventory Service')}`}>
          <div className="text-sm text-orange-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Inventory Service</div>
        </motion.div>
        
        <motion.div className={`transition-all duration-300 w-64 p-6 rounded-xl border-2 text-center ${isActive('Analytics Service')}`}>
          <div className="text-sm text-green-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Analytics Service</div>
        </motion.div>

        <motion.div className={`transition-all duration-300 w-64 p-6 rounded-xl border-2 text-center ${isActive('Notification Service')}`}>
          <div className="text-sm text-purple-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Notification Service</div>
        </motion.div>
      </div>

    </div>
  )
}
