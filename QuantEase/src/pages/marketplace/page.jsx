import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, TrendingUp, Download, Share2, Eye } from 'lucide-react';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Community Marketplace</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn collectively. Share strategies, browse performance rankings, collaborate on development. 
            Earn reputation through valuable contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Active Strategies</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-blue-100">Community shared</p>
              </div>
              <Share2 className="w-8 h-8 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Your Reputation</p>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-green-100">Points earned</p>
              </div>
              <Star className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Downloads</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-purple-100">This month</p>
              </div>
              <Download className="w-8 h-8 text-purple-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Community Rank</p>
                <p className="text-2xl font-bold">#156</p>
                <p className="text-xs text-orange-100">Out of 12,450</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-100" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Top Performing Strategies</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Sort</Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">RSI Momentum Pro</h3>
                    <p className="text-sm text-gray-600">by @TradingMaster_01</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">4.8 (234 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Annual Return</p>
                    <p className="font-semibold text-green-600">+45.2%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sharpe Ratio</p>
                    <p className="font-semibold">1.8</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max Drawdown</p>
                    <p className="font-semibold text-red-600">-8.4%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Downloads</p>
                    <p className="font-semibold">1,245</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">MACD Golden Cross</h3>
                    <p className="text-sm text-gray-600">by @QuantAnalyst</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">4.6 (189 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Annual Return</p>
                    <p className="font-semibold text-green-600">+38.7%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sharpe Ratio</p>
                    <p className="font-semibold">1.6</p>
                  </div>
                  <div className="div">
                    <p className="text-gray-500">Max Drawdown</p>
                    <p className="font-semibold text-red-600">-12.1%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Downloads</p>
                    <p className="font-semibold">987</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">Bollinger Band Squeeze</h3>
                    <p className="text-sm text-gray-600">by @MarketWizard</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">4.7 (156 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Annual Return</p>
                    <p className="font-semibold text-green-600">+42.1%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sharpe Ratio</p>
                    <p className="font-semibold">1.7</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Max Drawdown</p>
                    <p className="font-semibold text-red-600">-9.8%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Downloads</p>
                    <p className="font-semibold">756</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline">
                    <Star className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Community Stats</h2>
            <div className="space-y-4">
              <div className="text-center p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-blue-600">12,450</h3>
                <p className="text-sm text-blue-800">Active Members</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-2xl font-bold text-green-600">1,234</h3>
                <p className="text-sm text-green-800">Shared Strategies</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-600">45,678</h3>
                <p className="text-sm text-purple-800">Total Downloads</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="text-2xl font-bold text-orange-600">98.5%</h3>
                <p className="text-sm text-orange-800">Satisfaction Rate</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Top Contributors</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <span className="ml-2 text-sm">@TradingMaster_01</span>
                  </div>
                  <span className="text-sm text-gray-600">15,234 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <span className="ml-2 text-sm">@QuantAnalyst</span>
                  </div>
                  <span className="text-sm text-gray-600">12,876 pts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <span className="ml-2 text-sm">@MarketWizard</span>
                  </div>
                  <span className="text-sm text-gray-600">11,234 pts</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Strategies</h2>
            <div className="space-y-3">
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">My RSI Strategy</h4>
                    <p className="text-sm text-gray-600">Created 2 weeks ago</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Downloads: 23</p>
                    <p>Rating: 4.2/5</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">MACD Crossover V2</h4>
                    <p className="text-sm text-gray-600">Created 1 month ago</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Downloads: 67</p>
                    <p>Rating: 4.5/5</p>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4">
              <Share2 className="w-4 h-4 mr-2" />
              Share New Strategy
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Collaboration Hub</h2>
            <div className="space-y-4">
              <div className="p-3 rounded-lg">
                <h4 className="font-medium text-blue-800">Open Project</h4>
                <p className="text-sm text-blue-600">Multi-timeframe momentum strategy</p>
                <p className="text-xs text-blue-500 mt-1">Looking for backtesting experts</p>
                <Button size="sm" className="mt-2">Join Project</Button>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Code Review</h4>
                <p className="text-sm text-green-600">Options volatility arbitrage</p>
                <p className="text-xs text-green-500 mt-1">Need feedback on risk management</p>
                <Button size="sm" className="mt-2">Review Code</Button>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">Study Group</h4>
                <p className="text-sm text-purple-600">Machine learning in trading</p>
                <p className="text-xs text-purple-500 mt-1">Weekly virtual meetups</p>
                <Button size="sm" className="mt-2">Join Group</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
