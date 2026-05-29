import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';
import { getAnalytics } from '../api/analyticsApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { events } = useSocket();
  const [initialData, setInitialData] = useState<any>({ totalOrders: 0, totalProductsSold: 0 });

  useEffect(() => {
    getAnalytics().then(setInitialData).catch(e => console.error("Base analytics failed to load", e));
  }, []);

  const totalOrders = initialData.totalOrders + events.filter(e => e.type === 'ORDER_CREATED').length;
  const totalProductsSold = initialData.totalProductsSold + events.filter(e => e.type === 'ORDER_CREATED').reduce((acc, e) => acc + (e.payload.quantity || 0), 0);
  const inventoryEvents = events.filter(e => e.type === 'INVENTORY_UPDATED').length;
  const notificationEvents = events.filter(e => e.type === 'NOTIFICATIONS_SENT').length;

  const chartData = events.slice(0, 10).reverse().map((e, i) => ({
    time: new Date(e.timestamp).toLocaleTimeString(),
    type: e.type,
    index: i
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Real-Time Metrics Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Orders" value={totalOrders} color="border-blue-500" />
        <MetricCard title="Total Products Sold" value={totalProductsSold} color="border-green-500" />
        <MetricCard title="Inventory Events" value={inventoryEvents} color="border-orange-500" />
        <MetricCard title="Notifications Sent" value={notificationEvents} color="border-purple-500" />
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-6 text-slate-300">Live Architecture Activity</h2>
        <div style={{ width: '100%', height: 300, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" hide />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="index" stroke="#3b82f6" strokeWidth={3} isAnimationActive={false} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: number, color: string}> = ({title, value, color}) => (
  <motion.div 
    key={value}
    initial={{ scale: 0.9, opacity: 0.5 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`bg-slate-900 border-l-4 ${color} p-6 rounded-r-xl shadow-xl flex flex-col justify-center border border-y-slate-800 border-r-slate-800`}
  >
    <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</div>
    <div className="text-4xl font-black text-white">{value}</div>
  </motion.div>
);
