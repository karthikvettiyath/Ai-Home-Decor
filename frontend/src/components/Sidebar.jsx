import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, PenTool, LayoutDashboard, MessageSquare, ShieldCheck, Palette, Calculator } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const links = [
        { name: 'Dashboard', path: '/user-dashboard', icon: LayoutDashboard },
        { name: 'Generate Design', path: '/generate-design', icon: PenTool },
        { name: 'Style Quiz', path: '/style-quiz', icon: Palette },
        { name: 'Budget Estimator', path: '/budget-calculator', icon: Calculator },
    ];

    // Since we only have one role, we show all links
    const activeLinks = links;

    return (
        <div className="flex h-[calc(100vh-64px)] w-64 flex-col bg-neutral-900/50 border-r border-white/10 backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1.5 px-3">
                    {activeLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-purple-600/20 text-purple-300'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-purple-400' : ''} />
                                    <span className="font-medium">{link.name}</span>
                                    {isActive && (
                                        <div className="ml-auto h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
