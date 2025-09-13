import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, BarChart3, Target, DollarSign, Activity } from 'lucide-react'

export default function BacktestResults({ backtest, onViewDetails }) {
  const [riskReport, setRiskReport] = useState(null)
  const [loadingRisk, setLoadingRisk] = useState(false)

  useEffect(() => {
    if (backtest?.id) {
      loadRiskReport()
    }
  }, [backtest?.id])

  const loadRiskReport = async () => {
    if (!backtest?.id) return
    
    setLoadingRisk(true)
    try {
      const { api } = await import('@/lib/api')
      const report = await api.getRiskReport(backtest.id)
      setRiskReport(report)
    } catch (error) {
      console.error('Error loading risk report:', error)
    } finally {
      setLoadingRisk(false)
    }
  }

  if (!backtest) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Backtest Results</h3>
          <p className="text-gray-500">Run a backtest to see performance metrics here.</p>
        </div>
      </Card>
    )
  }

  const metrics = backtest.metrics_json || {}
  const totalReturn = (metrics.total_return || 0) * 100
  const sharpe = metrics.sharpe || 0
  const maxDrawdown = (metrics.max_drawdown || 0) * 100
  const winRate = (metrics.win_rate || 0) * 100
  const trades = metrics.trades || 0
  const finalValue = metrics.final_value || 0
  const volatility = (metrics.volatility || 0) * 100

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Performance Overview</h2>
          {riskReport && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(riskReport.risk_level)}`}>
              {riskReport.risk_level.toUpperCase()} RISK
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">Total Return</span>
            </div>
            <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-1" />
              <span className="text-sm text-gray-600">Sharpe Ratio</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {sharpe.toFixed(2)}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="w-5 h-5 text-red-600 mr-1" />
              <span className="text-sm text-gray-600">Max Drawdown</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {maxDrawdown.toFixed(2)}%
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-purple-600 mr-1" />
              <span className="text-sm text-gray-600">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {winRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trading Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Trades</span>
              <span className="font-semibold">{trades}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Final Portfolio Value</span>
              <span className="font-semibold">₹{finalValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volatility</span>
              <span className="font-semibold">{volatility.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">CAGR</span>
              <span className="font-semibold">{((metrics.cagr || 0) * 100).toFixed(2)}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trade Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Trade Return</span>
              <span className="font-semibold">{((metrics.avg_trade_return || 0) * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Trade</span>
              <span className="font-semibold text-green-600">
                +{((metrics.max_trade_return || 0) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Worst Trade</span>
              <span className="font-semibold text-red-600">
                {((metrics.min_trade_return || 0) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Profit Factor</span>
              <span className="font-semibold">
                {metrics.profit_factor === Infinity ? '∞' : (metrics.profit_factor || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Report */}
      {riskReport && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Risk Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Risk Level</div>
              <div className={`font-semibold ${getRiskLevelColor(riskReport.risk_level)}`}>
                {riskReport.risk_level.toUpperCase()}
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Sharpe Ratio</div>
              <div className="font-semibold">{riskReport.sharpe.toFixed(2)}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Volatility</div>
              <div className="font-semibold">{(riskReport.volatility * 100).toFixed(2)}%</div>
            </div>
          </div>

          {riskReport.recommendations?.notes && (
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {riskReport.recommendations.notes.map((note, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => onViewDetails(backtest)} variant="outline">
          View Detailed Report
        </Button>
        <Button onClick={() => window.print()} variant="outline">
          Export Results
        </Button>
      </div>
    </div>
  )
}
