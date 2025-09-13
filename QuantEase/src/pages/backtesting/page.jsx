import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Calendar, FileText } from 'lucide-react';

export default function BacktestingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Backtesting Engine</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test with 10+ years of data. Institutional-grade validation using NSE/BSE historical data 
            across all market conditions. Get comprehensive performance reports before risking real capital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Historical Data</h3>
                <p className="text-sm text-gray-500">10+ Years</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <BarChart className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Market Coverage</h3>
                <p className="text-sm text-gray-500">NSE/BSE</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Accuracy</h3>
                <p className="text-sm text-gray-500">Institutional Grade</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Reports</h3>
                <p className="text-sm text-gray-500">Comprehensive</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Backtest Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Strategy</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Choose a strategy...</option>
                  <option>RSI Mean Reversion</option>
                  <option>MACD Crossover</option>
                  <option>Bollinger Bands Squeeze</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time Period</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Last 5 Years</option>
                  <option>Last 3 Years</option>
                  <option>Last 1 Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Capital</label>
                <input type="number" placeholder="100000" className="w-full p-2 border rounded-lg" />
              </div>
              <Button className="w-full">Run Backtest</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Return</span>
                <span className="font-semibold text-green-600">+45.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sharpe Ratio</span>
                <span className="font-semibold">1.8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Max Drawdown</span>
                <span className="font-semibold text-red-600">-12.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Win Rate</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Trades</span>
                <span className="font-semibold">234</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
