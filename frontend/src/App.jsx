import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import UserDashboard from './pages/UserDashboard';
import GenerateDesign from './pages/GenerateDesign'; // Import
import StyleQuiz from './pages/StyleQuiz';
import BudgetCalculator from './pages/BudgetCalculator';
import { authService } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route to correct dashboard
const DashboardRedirect = () => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/user-dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-900 text-white">
        <Routes>
          {/* Public Routes - Wrapped in styling handled by pages or specific layouts */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />

          {/* Dashboard Routes - Wrapped in DashboardLayout */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardRedirect />} />

            <Route path="user-dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            <Route path="generate-design" element={
              <ProtectedRoute>
                <GenerateDesign />
              </ProtectedRoute>
            } />

            <Route path="style-quiz" element={
              <ProtectedRoute>
                <StyleQuiz />
              </ProtectedRoute>
            } />

            <Route path="budget-calculator" element={
              <ProtectedRoute>
                <BudgetCalculator />
              </ProtectedRoute>
            } />

            {/* Fallback for other sidebar links to be implemented */}
            <Route path="*" element={<div className="p-8 text-gray-400">Page under construction</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
