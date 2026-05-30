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
        <MetricCard title="Total Orders" value={totalOrders} />
        <MetricCard title="Total Products Sold" value={totalProductsSold} />
        <MetricCard title="Inventory Events" value={inventoryEvents} />
        <MetricCard title="Notifications Sent" value={notificationEvents} />
      </div>

      <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-6 text-neutral-300">Live Architecture Activity</h2>
        <div style={{ width: '100%', height: 300, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" />
              <YAxis stroke="#888" hide />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="index" stroke="#fff" strokeWidth={3} isAnimationActive={false} dot={{ fill: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{title: string, value: number}> = ({title, value}) => (
  <motion.div 
    key={value}
    initial={{ scale: 0.9, opacity: 0.5 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-neutral-900 p-6 rounded-xl shadow-xl flex flex-col justify-center border border-neutral-800"
  >
    <div className="text-neutral-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</div>
    <div className="text-4xl font-black text-white">{value}</div>
  </motion.div>
);
