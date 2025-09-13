import React, { useState } from 'react';
import RiskOverview from '@/components/risk-management/RiskOverview';
import RiskAnalysis from '@/components/risk-management/RiskAnalysis';
import RiskAlerts from '@/components/risk-management/RiskAlerts';
import RiskControls from '@/components/risk-management/RiskControls';

export default function RiskDashboardPage() {
  const [currentView, setCurrentView] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async (view) => {
    setIsLoading(true);
    // Simulate navigation delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentView(view);
    setIsLoading(false);
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'analysis':
        return <RiskAnalysis onBack={handleBackToOverview} />;
      case 'alerts':
        return <RiskAlerts onBack={handleBackToOverview} />;
      case 'controls':
        return <RiskControls onBack={handleBackToOverview} />;
      default:
        return <RiskOverview onNavigate={handleNavigation} isLoading={isLoading} />;
    }
  };

  return renderCurrentView();
}
