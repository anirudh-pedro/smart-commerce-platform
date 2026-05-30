import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username) {
            localStorage.setItem('user', username);
            navigate('/shop');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-neutral-200">
            <form onSubmit={handleLogin} className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-2xl w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-white/10 border border-white/20 rounded-full">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h1>
                <p className="text-neutral-400 text-center mb-8">Login to place an order</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-neutral-400 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-neutral-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                                placeholder="��������"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 px-4 rounded-lg mt-8 transition-colors">
                    Login to Continue
                </button>
            </form>
        </div>
    );
};
