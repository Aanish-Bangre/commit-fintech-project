import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Users, Activity, DollarSign, PieChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trading Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive view of portfolio performance, active strategies, and market insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Portfolio</p>
                <p className="text-2xl font-bold">₹12,45,000</p>
                <p className="text-xs text-green-100">+24.5% overall</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Strategies</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-blue-100">3 profitable</p>
              </div>
              <Activity className="w-8 h-8 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Monthly P&L</p>
                <p className="text-2xl font-bold">+₹45,000</p>
                <p className="text-xs text-purple-100">8.2% this month</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Win Rate</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-orange-100">Above target</p>
              </div>
              <BarChart className="w-8 h-8 text-orange-100" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Performance</h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Portfolio performance chart will be displayed here</p>
                <p className="text-sm text-gray-400">Real-time data visualization</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                Deploy New Strategy
              </Button>
              <Button className="w-full" variant="outline">
                <BarChart className="w-4 h-4 mr-2" />
                Run Backtest
              </Button>
              <Button className="w-full" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Risk Analysis
              </Button>
              <Button className="w-full" variant="outline">
                <PieChart className="w-4 h-4 mr-2" />
                Portfolio Rebalance
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Strategies</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">RSI Mean Reversion</p>
                  <p className="text-sm text-gray-600">Running for 15 days</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+12.4%</p>
                  <p className="text-xs text-gray-500">23 trades</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">MACD Crossover</p>
                  <p className="text-sm text-gray-600">Running for 8 days</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">+8.7%</p>
                  <p className="text-xs text-gray-500">12 trades</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Bollinger Bands</p>
                  <p className="text-sm text-gray-600">Running for 22 days</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">-3.2%</p>
                  <p className="text-xs text-gray-500">18 trades</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Market Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">NIFTY 50</span>
                <div className="text-right">
                  <span className="font-semibold">22,147.90</span>
                  <span className="text-green-600 text-sm ml-2">+0.8%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">SENSEX</span>
                <div className="text-right">
                  <span className="font-semibold">73,158.24</span>
                  <span className="text-green-600 text-sm ml-2">+0.6%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">BANK NIFTY</span>
                <div className="text-right">
                  <span className="font-semibold">47,892.35</span>
                  <span className="text-red-600 text-sm ml-2">-0.3%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">VIX</span>
                <div className="text-right">
                  <span className="font-semibold">14.25</span>
                  <span className="text-red-600 text-sm ml-2">-2.1%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
