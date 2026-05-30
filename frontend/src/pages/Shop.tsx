import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderApi';
import { ShoppingBag, Star, LogOut, CheckCircle2, Laptop, Headphones, Keyboard } from 'lucide-react';
import toast from 'react-hot-toast';

export const Shop: React.FC = () => {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const [loading, setLoading] = useState(false);

    const handleBuy = async (productName: string) => {
        setLoading(true);
        const toastId = toast.loading(`Placing order for ${productName}...`);
        try {
            await createOrder({ product: productName, quantity: 1 });
            toast.success(`Successfully purchased ${productName}!`, { id: toastId });
        } catch (e) {
            toast.error("Failed to place order.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <ShoppingBag className="text-white" /> Marketplace
                    </h1>
                    <p className="text-neutral-400 mt-2">Welcome back, <span className="font-bold text-white">{user}</span>!</p>
                </div>
                <button onClick={logout} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors font-medium text-sm">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {name: "Premium Laptop", price: "$999", icon: Laptop, gradient: "from-emerald-500/20 to-blue-500/20 text-blue-400 border-blue-500/10"},
                    {name: "Wireless Headphones", price: "$199", icon: Headphones, gradient: "from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/10"},
                    {name: "Mechanical Keyboard", price: "$149", icon: Keyboard, gradient: "from-amber-500/20 to-orange-500/20 text-orange-400 border-orange-500/10"}
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl transition-all duration-300 flex flex-col group">
                            <div className={`h-40 bg-gradient-to-br ${item.gradient} border-b border-neutral-800/80 flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                <Icon className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                                    <span className="bg-black border border-neutral-800 text-neutral-300 py-1 px-3 rounded-full text-xs font-bold">{item.price}</span>
                                </div>
                                <ul className="text-xs text-neutral-400 space-y-2 mb-6 flex-1">
                                    <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> In Stock ready to ship</li>
                                    <li className="flex items-center gap-2"><Star size={14} className="text-neutral-500" /> 4.9/5 Average Rating</li>
                                </ul>
                                <button 
                                    onClick={() => handleBuy(item.name)} 
                                    disabled={loading}
                                    className="w-full bg-white hover:bg-neutral-200 text-black font-black py-3 rounded-xl transition-all active:scale-98 disabled:opacity-50"
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
