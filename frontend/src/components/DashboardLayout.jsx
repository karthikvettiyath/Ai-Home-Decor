import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <Navbar />
            <div className="flex">
                <Sidebar userRole={currentUser.role || 'user'} />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
            <Chatbot />
        </div>
    );
};

export default DashboardLayout;
