import React, { useEffect, useState } from 'react';
import { getInventory } from '../api/inventoryApi';
import type { InventoryItem } from '../types/inventory';
import { Loader } from '../components/Loader';
import '../styles/inventory.css';

export const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getInventory().then(setInventory).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = inventory.filter(i => i.product?.toLowerCase().includes(search.toLowerCase()));

  const getBadgeClass = (stock: number) => {
    if (stock > 10) return 'stock-high';
    if (stock >= 5) return 'stock-med';
    return 'stock-low';
  };

  if (loading) return <Loader />;

  return (
    <div className="inventory-page">
      <h2 style={{marginTop:0}}>Inventory</h2>
      <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} style={{marginBottom: 20, padding: 10, width: '100%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px'}} />
      {filtered.length === 0 ? <p>No items found.</p> : (
        <table>
          <thead><tr><th>Product</th><th>Stock</th></tr></thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i._id}>
                <td>{i.product}</td>
                <td><span className={`stock-badge ${getBadgeClass(i.stock)}`}>{i.stock}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};