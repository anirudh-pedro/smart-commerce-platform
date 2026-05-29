import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';
import { createOrder } from '../api/orderApi';

export const Architecture: React.FC = () => {
  const { events } = useSocket();
  const latestEvent = events[0];
  
  const [loading, setLoading] = useState(false);
  const [activeSimulatorStep, setSimulatorStep] = useState<number | null>(null);

  const simulateOrder = async () => {
    if (loading) return;
    setLoading(true);
    
    // Step 1: Order Service processing the incoming REST request
    setSimulatorStep(1);
    
    try {
      await createOrder({ product: "Order " + Math.floor(Math.random()*100), quantity: 1 });
      
      // Step 2: The event is injected into Kafka
      setTimeout(() => setSimulatorStep(2), 800);
      
      // Step 3: Kafka broadcasts the events to the Consumer group across the cluster
      setTimeout(() => setSimulatorStep(3), 1600);
      
      // Step 4: Finished simulation, return to normal live-socket listening mode
      setTimeout(() => {
        setSimulatorStep(null);
        setLoading(false);
      }, 3000);

    } catch(e) {
      console.error(e);
      setSimulatorStep(null);
      setLoading(false);
    }
  }

  // Logic to determine what should be highlighted based on either real fast websockets or the slower interview simulator
  const activeService = activeSimulatorStep !== null 
    ? (activeSimulatorStep === 1 ? 'Order Service' : activeSimulatorStep === 3 ? 'ALL_CONSUMERS' : null)
    : latestEvent?.service;

  const isKafkaActive = activeSimulatorStep !== null 
    ? (activeSimulatorStep === 2 || activeSimulatorStep === 3) 
    : !!latestEvent;

  const isActive = (service: string) => {
    if (activeService === 'ALL_CONSUMERS' && ['Inventory Service', 'Notification Service', 'Analytics Service'].includes(service)) return 'shadow-[0_0_30px_rgba(59,130,246,0.6)] border-green-400 scale-110 bg-green-900/30';
    return activeService === service ? 'shadow-[0_0_30px_rgba(59,130,246,0.6)] border-blue-400 scale-110 bg-blue-900/30' : 'border-slate-700 bg-slate-800 text-slate-400 opacity-70';
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-8">
      
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Architecture Flow</h1>
          <p className="text-slate-400">Live event-driven microservices architecture visualization.</p>
        </div>
        <button 
          onClick={simulateOrder} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95"
        >
          {loading ? "Simulating Workflow..." : "Generate Traffic"}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
      {/* Client/Order Service */}
      <motion.div className={`transition-all duration-500 w-64 p-6 rounded-xl border-2 text-center relative z-10 ${isActive('Order Service')}`}>
        <div className="text-sm text-blue-400 font-bold tracking-wider mb-2">PRODUCER</div>
        <div className="text-2xl font-black text-white">Order Service</div>
      </motion.div>

      {/* Down Arrow to Kafka */}
      <div className="w-1 h-20 bg-slate-800 relative overflow-hidden">
         {(activeSimulatorStep === 1 || activeSimulatorStep === 2 || latestEvent?.type === 'ORDER_CREATED') && <motion.div className="absolute inset-0 bg-blue-500" initial={{top: 0, bottom: "100%"}} animate={{bottom: 0}} transition={{ duration: 0.5 }} /> }
      </div>

      {/* Kafka Broker */}
      <motion.div animate={{ rotate: isKafkaActive ? [0, -2, 2, 0] : 0 }} className={`transition-all duration-500 w-96 p-8 rounded-full border-4 ${isKafkaActive ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] bg-slate-800' : 'border-slate-800 bg-slate-900'} text-center relative z-10 flex flex-col items-center justify-center aspect-[3/1]`}>
        <div className="text-sm text-slate-400 font-bold tracking-wider mb-1">EVENT BUS</div>
        <div className="text-3xl font-black text-white">KAFKA</div>
        <div className="text-xs font-mono mt-2 text-blue-400 mt-2">
            {activeSimulatorStep === 2 ? 'Active Topic: orders.created' : (latestEvent ? `Active Topic: ${latestEvent.topic}` : 'Awaiting Events...')}
        </div>
      </motion.div>

      {/* Tri-branch lines */}
      <div className="flex w-[800px] justify-between relative h-20 -mt-1">
         <div className="absolute inset-0 z-0">
             {/* Base inactive lines */}
             <div className="w-1 h-full bg-slate-800 mx-auto" />
             <div className="absolute top-0 w-full flex justify-between">
               <div className="w-1 h-full bg-slate-800 ml-32" />
               <div className="w-1 h-full bg-slate-800 mr-32" />
             </div>
             <div className="absolute top-0 left-32 right-32 h-1 bg-slate-800" />
         </div>
         { /* Animated lines to consumers */ }
         { activeSimulatorStep === 3 && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}} className="absolute inset-0 z-10">
                 <div className="w-1 h-full bg-green-500 mx-auto shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                 <div className="absolute top-0 w-full flex justify-between">
                   <div className="w-1 h-full bg-orange-500 ml-32 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                   <div className="w-1 h-full bg-purple-500 mr-32 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                 </div>
                 <div className="absolute top-0 left-32 right-32 h-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </motion.div>
         )}
      </div>

      {/* Consumers */}
      <div className="flex w-[1000px] justify-around relative z-10">
        <motion.div className={`transition-all duration-500 w-64 p-6 rounded-xl border-2 text-center ${isActive('Inventory Service')}`}>
          <div className="text-sm text-orange-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Inventory Service</div>
        </motion.div>
        
        <motion.div className={`transition-all duration-500 w-64 p-6 rounded-xl border-2 text-center ${isActive('Analytics Service')}`}>
          <div className="text-sm text-green-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Analytics Service</div>
        </motion.div>

        <motion.div className={`transition-all duration-500 w-64 p-6 rounded-xl border-2 text-center ${isActive('Notification Service')}`}>
          <div className="text-sm text-purple-400 font-bold tracking-wider mb-2">CONSUMER</div>
          <div className="text-xl font-black text-white">Notification Service</div>
        </motion.div>
      </div>

      </div>
    </div>
  )
}
