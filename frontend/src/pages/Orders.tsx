import React, { useEffect, useState } from 'react';
import { getOrders } from '../api/orderApi';
import type { Order } from '../types/order';
import { Loader } from '../components/Loader';
import '../styles/orders.css';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(o => o.product?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader />;

  return (
    <div className="orders-page">
      <h2 style={{marginTop:0}}>Orders</h2>
      <input type="text" placeholder="Search product..." value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom: 20, padding: 10, width: '100%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px'}} />
      {filteredOrders.length === 0 ? <p>No orders found.</p> : (
        <table>
          <thead><tr><th>Product</th><th>Quantity</th><th>Status</th><th>Created At</th></tr></thead>
          <tbody>
            {filteredOrders.map(o => (
              <tr key={o._id}>
                <td>{o.product}</td>
                <td>{o.quantity}</td>
                <td>{o.status}</td>
                <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};