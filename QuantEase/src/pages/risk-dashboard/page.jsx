import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, TrendingDown, Target } from 'lucide-react';

export default function RiskDashboardPage() {
  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Risk Management Dashboard</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Monitor safety in real-time. Track drawdown (&lt;20%), Sharpe ratio (&gt;1.5), 
            win rate (&gt;60%) with color-coded alerts. Never trade blind with continuous risk monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-green-500 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Current Drawdown</p>
                <p className="text-2xl font-bold text-green-400">-8.2%</p>
                <p className="text-xs text-gray-400">Target: &lt;20%</p>
              </div>
              <TrendingDown className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-green-400">1.8</p>
                <p className="text-xs text-gray-400">Target: &gt;1.5</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Win Rate</p>
                <p className="text-2xl font-bold text-green-400">64%</p>
                <p className="text-xs text-gray-400">Target: &gt;60%</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500 bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Risk Score</p>
                <p className="text-2xl font-bold text-yellow-400">Medium</p>
                <p className="text-xs text-gray-400">Monitor closely</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Health</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Position Sizing</span>
                <span className="text-green-600 font-semibold">✓ Optimal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Diversification</span>
                <span className="text-green-600 font-semibold">✓ Good</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-800">Correlation Risk</span>
                <span className="text-yellow-600 font-semibold">⚠ Medium</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-green-800">Volatility Control</span>
                <span className="text-green-600 font-semibold">✓ Active</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">High Correlation Detected</p>
                  <p className="text-xs text-red-600">3 positions showing 0.8+ correlation</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-l-yellow-500">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Position Size Warning</p>
                  <p className="text-xs text-yellow-600">RELIANCE exceeding 5% allocation</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg border-l-4 border-l-blue-500">
                <Shield className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Stop Loss Triggered</p>
                  <p className="text-xs text-blue-600">HDFC position closed at -2.1%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Risk Controls</h2>
            <Button>Configure Settings</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Auto Stop Loss</h3>
              <p className="text-sm text-gray-600">Automatic position closure at -3% loss</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Position Limits</h3>
              <p className="text-sm text-gray-600">Maximum 5% per single position</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Volatility Filter</h3>
              <p className="text-sm text-gray-600">Reduces exposure during high volatility</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
