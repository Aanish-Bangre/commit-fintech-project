import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import LoginPage from './pages/login/page';
import SignupPage from './pages/signup/page';
import HomePage from './pages/home/page';
import DashboardPage from './pages/dashboard/page';
import StrategyBuilderPage from './pages/strategy-builder/page';
import BacktestingPage from './pages/backtesting/page';
import RiskDashboardPage from './pages/risk-dashboard/page';
import AIAssistantPage from './pages/ai-assistant/page';
import PaperTradingPage from './pages/paper-trading/page';
import CompliancePage from './pages/compliance/page';
import MarketplacePage from './pages/marketplace/page';
import EducationPage from './pages/education/page';
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
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
              </header>
              <DashboardPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/strategy-builder" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Strategy Builder</h1>
                </div>
              </header>
              <StrategyBuilderPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/backtesting" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Backtesting</h1>
                </div>
              </header>
              <BacktestingPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/risk-dashboard" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Risk Dashboard</h1>
                </div>
              </header>
              <RiskDashboardPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/ai-assistant" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">AI Assistant</h1>
                </div>
              </header>
              <AIAssistantPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/paper-trading" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Paper Trading</h1>
                </div>
              </header>
              <PaperTradingPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/compliance" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Compliance</h1>
                </div>
              </header>
              <CompliancePage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/marketplace" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Marketplace</h1>
                </div>
              </header>
              <MarketplacePage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />

      <Route path="/education" element={
        <ProtectedRoute>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                  <h1 className="text-lg font-semibold">Education</h1>
                </div>
              </header>
              <EducationPage />
            </SidebarInset>
          </SidebarProvider>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        <>
          <div className="Navbar">
            {/* Simple header for homepage */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
              <div className="flex items-center gap-4 bg-[#1d1d1d] rounded-full shadow-lg px-8 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-lg">QuantEase</span>
                </div>
                <button
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
          <HomePage />
        </>
      } />
      
      <Route path="/*" element={
        <>
          <div className="Navbar">
            {/* Simple header for 404/catch-all */}
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
              <div className="flex items-center gap-4 bg-[#1d1d1d] rounded-full shadow-lg px-8 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-lg">QuantEase</span>
                </div>
                <button
                  className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2 shadow transition-colors"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
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
