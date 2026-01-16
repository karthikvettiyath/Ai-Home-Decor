import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-900/80 backdrop-blur-md text-white">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ai Home Decor
                </Link>

                <div className="flex items-center gap-8 text-sm font-medium">
                    <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>

                    {currentUser ? (
                        <div className="flex items-center gap-6">
                            <Link to="/generate-design" className="text-gray-300 hover:text-purple-400 transition">Design</Link>
                            <Link to="/user-dashboard" className="text-gray-300 hover:text-purple-400 transition">Dashboard</Link>

                            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                                <span className="flex items-center gap-2 text-gray-400">
                                    <User size={16} />
                                    <span className="hidden sm:inline">{currentUser.displayName || currentUser.email}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
                            <Link
                                to="/register"
                                className="rounded-full bg-white px-5 py-2 text-neutral-900 font-bold hover:bg-gray-100 transition"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
