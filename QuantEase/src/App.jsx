import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import LoginPage from './pages/login/page';
import SignupPage from './pages/signup/page';
import HomePage from './pages/home/page';
import './App.css';


// Protected Route component
function ProtectedRoute({ children }) {
  const { session, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Auth Route component (redirects authenticated users)
function AuthRoute({ children }) {
  const { session, loading } = useAuthContext();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <AuthRoute>
          <LoginPage />
        </AuthRoute>
      } />
      
      <Route path="/signup" element={
        <AuthRoute>
          <SignupPage />
        </AuthRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Navbar />
          <div className="pt-16">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to QuantEase Dashboard!</h1>
              <p className="text-gray-600">You are successfully logged in.</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        <>
          <Navbar />
          <HomePage />
        </>
      } />
      
      <Route path="/*" element={
        <>
          <Navbar />
          <HomePage />
        </>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
