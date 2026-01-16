import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import { authService } from '../services/authService';
import { Navigate, Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <Navbar />
            <div className="flex">
                <Sidebar userRole={user.role} />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;
