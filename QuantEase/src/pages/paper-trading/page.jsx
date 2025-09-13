import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  Wallet, Target, Activity, RefreshCw, AlertCircle,
  ArrowUpRight, ArrowDownRight, Eye, EyeOff, Wifi, WifiOff
} from 'lucide-react'
import { API_CONFIG } from '@/config/api'
import { api } from '@/lib/api'
// import marketDataWebSocket from '@/lib/websocket'

export default function PaperTradingPage() {
  const [portfolio, setPortfolio] = useState(null)
  const [positions, setPositions] = useState([])
  const [marketData, setMarketData] = useState({})
  const [tradeHistory, setTradeHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Trade form state
  const [showTradeForm, setShowTradeForm] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [tradeAction, setTradeAction] = useState('buy')
  const [tradeQuantity, setTradeQuantity] = useState('')
  const [tradePrice, setTradePrice] = useState('')
  const [tradeNotes, setTradeNotes] = useState('')
  const [executingTrade, setExecutingTrade] = useState(false)

  // Market data refresh
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)

  useEffect(() => {
    loadPortfolioData()

    // HTTP polling for market data updates
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshMarketData()
      }, 30000) // Refresh every 30 seconds
      setRefreshInterval(interval)
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [autoRefresh])

  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [portfolioData, positionsData, historyData] = await Promise.all([
        api.getPortfolio(),
        api.getPositions(),
        api.getTradeHistory(20)
      ])

      setPortfolio(portfolioData)
      setPositions(positionsData)
      setTradeHistory(historyData)

      // Load market data for all positions
      if (positionsData.length > 0) {
        const symbols = positionsData.map(pos => pos.symbol).join(',')
        const marketDataResponse = await api.getMultipleMarketData(symbols)
        const marketDataMap = {}
        marketDataResponse.forEach(data => {
          marketDataMap[data.symbol] = data
        })
        setMarketData(marketDataMap)
      }

    } catch (err) {
      console.error('Error loading portfolio data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshMarketData = async () => {
    try {
      setRefreshing(true)

      if (positions.length > 0) {
        const symbols = positions.map(pos => pos.symbol).join(',')
        const marketDataResponse = await api.getMultipleMarketData(symbols)
        const marketDataMap = {}
        marketDataResponse.forEach(data => {
          marketDataMap[data.symbol] = data
        })
        setMarketData(marketDataMap)
      }

      // Refresh portfolio to get updated values
      const portfolioData = await api.getPortfolio()
      setPortfolio(portfolioData)

    } catch (err) {
      console.error('Error refreshing market data:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const refreshPortfolioOnly = async () => {
    try {
      const portfolioData = await api.getPortfolio()
      setPortfolio(portfolioData)
    } catch (err) {
      console.error('Error refreshing portfolio:', err)
    }
  }

  const handleTradeSubmit = async (e) => {
    e.preventDefault()

    if (!selectedSymbol || !tradeQuantity) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setExecutingTrade(true)
      setError(null)

      const tradeData = {
        symbol: selectedSymbol,
        action: tradeAction,
        quantity: parseInt(tradeQuantity),
        price: tradePrice ? parseFloat(tradePrice) : null,
        order_type: 'market',
        notes: tradeNotes
      }

      await api.executeTrade(tradeData)

      // Reset form
      setSelectedSymbol('')
      setTradeQuantity('')
      setTradePrice('')
      setTradeNotes('')
      setShowTradeForm(false)

      // Reload portfolio data
      await loadPortfolioData()

    } catch (err) {
      console.error('Error executing trade:', err)
      setError(err.message)
    } finally {
      setExecutingTrade(false)
    }
  }

  const getCurrentPrice = async (symbol) => {
    try {
      const priceData = await api.getCurrentPrice(symbol)
      setTradePrice(priceData.price.toString())
    } catch (err) {
      console.error('Error getting current price:', err)
    }
  }

  const resetPortfolio = async () => {
    if (window.confirm('Are you sure you want to reset your portfolio? This will clear all positions and reset cash to ₹10,00,000.')) {
      try {
        await api.resetPortfolio()
        await loadPortfolioData()
      } catch (err) {
        console.error('Error resetting portfolio:', err)
        setError(err.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading portfolio data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadPortfolioData}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Paper Trading</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-blue-600">
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-sm font-medium">Auto Refresh</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-600">
              Practice trading with virtual money using real-time NSE/BSE market data
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Auto Refresh
            </Button>
            <Button
              variant="outline"
              onClick={refreshMarketData}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={resetPortfolio}
              className="text-red-600 hover:text-red-700"
            >
              Reset Portfolio
            </Button>
          </div>
        </div>

        {/* Portfolio Summary */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{portfolio.total_value.toLocaleString()}
                  </p>
                </div>
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <span className={`text-sm ${portfolio.total_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl.toLocaleString()}
                  ({portfolio.total_pnl_percent.toFixed(2)}%)
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cash Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{portfolio.cash_balance.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Invested Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{portfolio.invested_value.toLocaleString()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trades Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolio.trades_today}
                  </p>
                  <p className="text-sm text-gray-500">
                    {portfolio.trades_total} total
                  </p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
          </div>
        )}

        {/* Trade Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {/* Positions */}
            <Card className="p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Current Positions</h2>
                <Button onClick={() => setShowTradeForm(!showTradeForm)}>
                  {showTradeForm ? 'Cancel' : 'New Trade'}
                </Button>
              </div>

              {showTradeForm && (
                <form onSubmit={handleTradeSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="symbol">Stock Symbol</Label>
                      <select
                        id="symbol"
                        value={selectedSymbol}
                        onChange={(e) => {
                          setSelectedSymbol(e.target.value)
                          if (e.target.value) {
                            getCurrentPrice(e.target.value)
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Stock</option>
                        {API_CONFIG.AVAILABLE_STOCKS.map(stock => (
                          <option key={stock} value={stock}>
                            {stock}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="action">Action</Label>
                      <select
                        id="action"
                        value={tradeAction}
                        onChange={(e) => setTradeAction(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={tradeQuantity}
                        onChange={(e) => setTradeQuantity(e.target.value)}
                        placeholder="Number of shares"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={tradePrice}
                        onChange={(e) => setTradePrice(e.target.value)}
                        placeholder="Leave empty for market price"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={tradeNotes}
                        onChange={(e) => setTradeNotes(e.target.value)}
                        placeholder="Trade notes..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button type="submit" disabled={executingTrade}>
                      {executingTrade ? 'Executing...' : 'Execute Trade'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowTradeForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Positions</h3>
                  <p className="text-gray-500">Start trading to build your portfolio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => {
                    const marketInfo = marketData[position.symbol]
                    const currentPrice = marketInfo?.price || position.current_price
                    const change = marketInfo?.change || 0
                    const changePercent = marketInfo?.change_percent || 0

                    return (
                      <div key={position.symbol} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{position.symbol}</h3>
                            <span className="text-sm text-gray-500">{position.quantity} shares</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div>
                              <span className="text-sm text-gray-600">Avg Price: </span>
                              <span className="font-medium">₹{position.avg_price.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Current: </span>
                              <span className="font-medium">₹{currentPrice.toFixed(2)}</span>
                              {change !== 0 && (
                                <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ₹{position.market_value.toLocaleString()}
                          </div>
                          <div className={`text-sm ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.unrealized_pnl >= 0 ? '+' : ''}₹{position.unrealized_pnl.toLocaleString()}
                            ({position.unrealized_pnl_percent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Trade History */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Trades</h2>

              {tradeHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">No trades yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tradeHistory.slice(0, 10).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {trade.action === 'buy' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">{trade.symbol}</div>
                          <div className="text-sm text-gray-600">
                            {trade.action.toUpperCase()} {trade.quantity} @ ₹{trade.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{trade.total_value.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(trade.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}