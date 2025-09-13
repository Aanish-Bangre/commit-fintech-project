import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, TrendingDown, Target, Activity, DollarSign } from 'lucide-react';
import { generateRiskMetrics, generatePortfolioSummary, generateRecentEvents, simulateApiCall } from '@/utils/riskDemoData';

const RiskOverview = ({ onNavigate, isLoading }) => {
  const [metrics, setMetrics] = useState([]);
  const [portfolioData, setPortfolioData] = useState({});
  const [recentEvents, setRecentEvents] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      await simulateApiCall(1500);
      
      const riskMetrics = generateRiskMetrics();
      const portfolio = generatePortfolioSummary();
      const events = generateRecentEvents();
      
      setMetrics([
        {
          label: 'Sharpe Ratio',
          value: riskMetrics.sharpeRatio.value.toString(),
          target: `>${riskMetrics.sharpeRatio.target}`,
          status: riskMetrics.sharpeRatio.status,
          icon: Target,
          change: riskMetrics.sharpeRatio.change
        },
        {
          label: 'Max Drawdown',
          value: `${riskMetrics.maxDrawdown.value}%`,
          target: `>${riskMetrics.maxDrawdown.target}%`,
          status: riskMetrics.maxDrawdown.status,
          icon: TrendingDown,
          change: riskMetrics.maxDrawdown.change
        },
        {
          label: 'Win Rate',
          value: `${riskMetrics.winRate.value}%`,
          target: `>${riskMetrics.winRate.target}%`,
          status: riskMetrics.winRate.status,
          icon: Shield,
          change: riskMetrics.winRate.change
        },
        {
          label: 'Volatility',
          value: `${riskMetrics.volatility.value}%`,
          target: `<${riskMetrics.volatility.target}%`,
          status: riskMetrics.volatility.status,
          icon: Activity,
          change: riskMetrics.volatility.change
        }
      ]);
      
      setPortfolioData(portfolio);
      setRecentEvents(events);
      setDataLoading(false);
    };

    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'moderate': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:/20';
    }
  };

  const getTextColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 dark:text-green-400';
      case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
      case 'high': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Risk Dashboard</h2>
            <p className="text-gray-400">Fetching your portfolio risk metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Risk Management Dashboard</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor your portfolio's risk profile in real-time with comprehensive analytics and alerts
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Portfolio Value</p>
                <p className="text-2xl font-bold text-white">${portfolioData.totalValue?.toLocaleString()}</p>
                <p className="text-sm text-green-400">+{portfolioData.dailyChange}% today</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Risk Score</p>
                <p className="text-2xl font-bold text-green-400">{portfolioData.overallRiskScore}</p>
                <p className="text-sm text-gray-400">Well balanced</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">{portfolioData.activeAlerts}</p>
                <p className="text-sm text-gray-400">Requires attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {/* Key Risk Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Key Risk Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card 
                  key={index} 
                  className={`p-6 border-l-4 bg-gray-800 border-gray-700 ${getStatusColor(metric.status)} transition-all hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-6 h-6 ${getTextColor(metric.status)}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.status === 'safe' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      metric.status === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                    <p className={`text-2xl font-bold ${getTextColor(metric.status)}`}>{metric.value}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">Target: {metric.target}</p>
                      <p className={`text-xs ${
                        metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Detailed Analysis</h3>
              <p className="text-sm text-gray-400 mb-4">Deep dive into risk components and correlations</p>
              <Button 
                onClick={() => onNavigate('analysis')}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Loading...' : 'View Analysis'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Risk Alerts</h3>
              <p className="text-sm text-gray-400 mb-4">Monitor active alerts and notifications</p>
              <Button 
                onClick={() => onNavigate('alerts')}
                disabled={isLoading}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {isLoading ? 'Loading...' : 'View Alerts'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Risk Controls</h3>
              <p className="text-sm text-gray-400 mb-4">Configure automated risk management settings</p>
              <Button 
                onClick={() => onNavigate('controls')}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Loading...' : 'Manage Controls'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Risk Events</h3>
          <div className="space-y-3">
            {recentEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    event.type === 'positive' ? 'bg-green-400' :
                    event.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}></div>
                  <span className="text-gray-300">{event.message}</span>
                </div>
                <span className="text-xs text-gray-500">{event.timestamp}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskOverview;
