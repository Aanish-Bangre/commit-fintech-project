import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Calendar, FileText, History, AlertCircle } from 'lucide-react';
import StrategyBuilder from '@/components/StrategyBuilder';
import BacktestResults from '@/components/BacktestResults';
import { api } from '@/lib/api';

export default function BacktestingPage() {
  const [loading, setLoading] = useState(false);
  const [currentBacktest, setCurrentBacktest] = useState(null);
  const [backtestHistory, setBacktestHistory] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadBacktestHistory();
    loadStrategies();
  }, []);

  const loadBacktestHistory = async () => {
    try {
      const backtests = await api.getBacktests();
      setBacktestHistory(backtests);
    } catch (error) {
      console.error('Error loading backtest history:', error);
    }
  };

  const loadStrategies = async () => {
    try {
      const userStrategies = await api.getStrategies();
      setStrategies(userStrategies);
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  const handleStrategyCreate = async (strategyConfig) => {
    try {
      const strategy = await api.createStrategy(strategyConfig);
      return strategy;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }
  };

  const handleBacktestRun = async (backtestConfig) => {
    setLoading(true);
    setError(null);

    try {
      const backtest = await api.runBacktest(backtestConfig);
      setCurrentBacktest(backtest);
      await loadBacktestHistory(); // Refresh history
      await loadStrategies(); // Refresh strategies
    } catch (error) {
      console.error('Error running backtest:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (backtest) => {
    setCurrentBacktest(backtest);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Backtesting Engine</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Test with 15+ years of data. Institutional-grade validation using NSE historical data
            across all market conditions. Get comprehensive performance reports before risking real capital.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Historical Data</h3>
                <p className="text-sm text-gray-500">15+ Years</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <BarChart className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold">Market Coverage</h3>
                <p className="text-sm text-gray-500">10 NSE Stocks</p>
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

        {/* Error Display */}
        {error && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={!showHistory ? "default" : "outline"}
            onClick={() => setShowHistory(false)}
            className="flex items-center gap-2"
          >
            <BarChart className="w-4 h-4" />
            Strategy Builder
          </Button>
          <Button
            variant={showHistory ? "default" : "outline"}
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Backtest History ({backtestHistory.length})
          </Button>
        </div>

        {/* Main Content */}
        {!showHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strategy Builder */}
            <div>
              <StrategyBuilder
                onStrategyCreate={handleStrategyCreate}
                onBacktestRun={handleBacktestRun}
                loading={loading}
                existingStrategies={strategies}
              />
            </div>

            {/* Results */}
            <div>
              <BacktestResults
                backtest={currentBacktest}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        ) : (
          /* Backtest History */
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Backtest History</h2>
              {backtestHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No backtests found. Create and run your first backtest to see results here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backtestHistory.map((backtest) => {
                    const metrics = backtest.metrics_json || {};
                    const totalReturn = (metrics.total_return || 0) * 100;
                    const sharpe = metrics.sharpe || 0;
                    const maxDrawdown = (metrics.max_drawdown || 0) * 100;

                    return (
                      <Card key={backtest.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(backtest)}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold">{backtest.dataset}</h3>
                              <span className="text-sm text-gray-500">
                                {new Date(backtest.start_date).toLocaleDateString()} - {new Date(backtest.end_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Return:</span>
                                <span className={`ml-1 font-medium ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Sharpe:</span>
                                <span className="ml-1 font-medium">{sharpe.toFixed(2)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Drawdown:</span>
                                <span className="ml-1 font-medium text-red-600">{maxDrawdown.toFixed(2)}%</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Trades:</span>
                                <span className="ml-1 font-medium">{metrics.trades || 0}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
