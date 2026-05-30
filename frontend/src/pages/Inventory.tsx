import React, { useEffect, useState } from 'react';
import { getInventory } from '../api/inventoryApi';
import type { InventoryItem } from '../types/inventory';
import { Loader } from '../components/Loader';
import { Database, Search, Package, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchInventory = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filtered = inventory.filter(i => i.product?.toLowerCase().includes(search.toLowerCase()));

  const getStockStatus = (stock: number) => {
    if (stock > 10) return { label: 'In Stock', class: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: CheckCircle2 };
    if (stock >= 5) return { label: 'Low Stock', class: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: ShieldAlert };
    return { label: 'Out of Stock', class: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', icon: ShieldAlert };
  };

  const totalProducts = inventory.length;
  const lowStockCount = inventory.filter(i => i.stock < 5).length;
  const totalStockVal = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 select-none">
      
      {/* Header Area */}
      <div className="flex justify-between items-center bg-neutral-900/20 backdrop-blur-xl border border-neutral-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Package className="text-blue-500 w-8 h-8" />
            Inventory Control
          </h1>
          <p className="text-neutral-400 mt-1.5 text-sm font-medium">
            Monitor real-time product stock, critical level alerts, and catalog items.
          </p>
        </div>
        <button 
          onClick={() => fetchInventory(true)} 
          disabled={refreshing}
          className="flex items-center gap-2 text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2.5 rounded-xl font-bold text-neutral-350 transition-all hover:bg-neutral-850 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Unique Products */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-black">Unique Items</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalProducts}</div>
          </div>
        </div>

        {/* Card 2: Total Items */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-black">Total Stock</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalStockVal}</div>
          </div>
        </div>

        {/* Card 3: Alert items */}
        <div className="bg-neutral-900/40 border border-neutral-800 p-5 rounded-2xl shadow-md flex items-center gap-4">
          <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-pulse' : 'bg-neutral-800/40 border border-neutral-800 text-neutral-500'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-black">Low Stock Alerts</div>
            <div className={`text-2xl font-black mt-0.5 ${lowStockCount > 0 ? 'text-rose-400' : 'text-neutral-400'}`}>{lowStockCount}</div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
        
        {/* Search filter */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search catalog products..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-neutral-500 focus:outline-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors"
          />
        </div>

        {/* Table representation */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-sm font-medium">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-900 rounded-2xl">
            <table className="w-full border-collapse text-left text-sm text-neutral-300">
              <thead className="bg-neutral-900/30 border-b border-neutral-900 text-xs font-black uppercase font-mono tracking-wider text-neutral-400">
                <tr>
                  <th className="py-4 px-6">Product Catalog Item</th>
                  <th className="py-4 px-6">Current Stock</th>
                  <th className="py-4 px-6">Status Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filtered.map(i => {
                  const status = getStockStatus(i.stock);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={i._id} className="hover:bg-neutral-900/20 transition-colors">
                      <td className="py-4 px-6 font-bold text-white tracking-tight">{i.product}</td>
                      <td className="py-4 px-6 font-mono font-bold text-neutral-300">{i.stock} units</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none ${status.class}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};