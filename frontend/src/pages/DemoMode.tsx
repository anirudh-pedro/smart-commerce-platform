import React, { useState } from 'react';
import { createOrder } from '../api/orderApi';
import { Architecture } from './Architecture';

export const DemoMode: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const simulateOrder = async () => {
    setLoading(true);
    try {
      await createOrder({ product: "Special Interview Event " + Math.floor(Math.random()*100), quantity: 2 });
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-yellow-400 mb-2">Interview Demo Mode</h1>
          <p className="text-slate-400">Trigger standard traffic and watch the microservices seamlessly orchestrate over Kafka.</p>
        </div>
        <button 
          onClick={simulateOrder} 
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-black px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition transform hover:scale-105 active:scale-95"
        >
          {loading ? "Generating..." : "Generate Traffic Payload"}
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl min-h-[500px]">
         <Architecture />
      </div>
    </div>
  )
}
