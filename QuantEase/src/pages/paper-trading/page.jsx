import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, TrendingUp, DollarSign, BarChart } from 'lucide-react';

export default function PaperTradingPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Paper Trading Mode</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Practice risk-free. Live NSE/BSE feeds with virtual money. 
            Test strategies, build confidence, refine approaches without financial risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Virtual Balance</p>
                <p className="text-2xl font-bold">₹10,50,000</p>
                <p className="text-xs text-blue-100">Starting: ₹10,00,000</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total P&L</p>
                <p className="text-2xl font-bold">+₹50,000</p>
                <p className="text-xs text-green-100">+5.0%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Active Positions</p>
                <p className="text-2xl font-bold">7</p>
                <p className="text-xs text-purple-100">₹4,20,000 invested</p>
              </div>
              <BarChart className="w-8 h-8 text-purple-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Win Rate</p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-orange-100">23 of 34 trades</p>
              </div>
              <Play className="w-8 h-8 text-orange-100" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Live Market Feed</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live NSE/BSE Data</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Change</th>
                    <th className="text-right py-2">Volume</th>
                    <th className="text-center py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">RELIANCE</td>
                    <td className="text-right">₹2,456.75</td>
                    <td className="text-right text-green-600">+12.30 (0.5%)</td>
                    <td className="text-right">2.3M</td>
                    <td className="text-center">
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-green-600">Buy</Button>
                        <Button size="sm" variant="outline" className="text-red-600">Sell</Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">TCS</td>
                    <td className="text-right">₹3,234.50</td>
                    <td className="text-right text-red-600">-45.20 (-1.4%)</td>
                    <td className="text-right">1.8M</td>
                    <td className="text-center">
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-green-600">Buy</Button>
                        <Button size="sm" variant="outline" className="text-red-600">Sell</Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">HDFC BANK</td>
                    <td className="text-right">₹1,542.80</td>
                    <td className="text-right text-green-600">+8.90 (0.6%)</td>
                    <td className="text-right">3.1M</td>
                    <td className="text-center">
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-green-600">Buy</Button>
                        <Button size="sm" variant="outline" className="text-red-600">Sell</Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Trade</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Symbol</label>
                <input type="text" placeholder="e.g., RELIANCE" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input type="number" placeholder="100" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order Type</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                  <option>Stop Loss</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <Pause className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Positions</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">RELIANCE</p>
                  <p className="text-sm text-gray-600">100 shares @ ₹2,440</p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">+₹1,675</p>
                  <p className="text-xs text-gray-500">+0.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">INFY</p>
                  <p className="text-sm text-gray-600">50 shares @ ₹1,520</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">-₹850</p>
                  <p className="text-xs text-gray-500">-1.1%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">HDFC BANK</p>
                  <p className="text-sm text-gray-600">80 shares @ ₹1,535</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-semibold">+₹624</p>
                  <p className="text-xs text-gray-500">+0.5%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Strategy Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Trades</span>
                <span className="font-semibold">34</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Winning Trades</span>
                <span className="font-semibold text-green-600">23 (68%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Win</span>
                <span className="font-semibold">₹3,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Loss</span>
                <span className="font-semibold">₹1,840</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best Trade</span>
                <span className="font-semibold text-green-600">+₹8,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Worst Trade</span>
                <span className="font-semibold text-red-600">-₹4,200</span>
              </div>
              <hr />
              <div className="flex justify-between items-center font-semibold">
                <span>Net Profit</span>
                <span className="text-green-600">+₹50,000</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
