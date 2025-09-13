import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Settings, Code, Eye } from 'lucide-react'
import { API_CONFIG } from '@/config/api'

const AVAILABLE_INDICATORS = [
    { type: 'SMA', name: 'Simple Moving Average', params: ['window'] },
    { type: 'EMA', name: 'Exponential Moving Average', params: ['span'] },
    { type: 'RSI', name: 'Relative Strength Index', params: ['window'] },
    { type: 'MACD', name: 'MACD', params: ['fast', 'slow', 'signal'] },
    { type: 'BB', name: 'Bollinger Bands', params: ['window', 'std'] },
    { type: 'ATR', name: 'Average True Range', params: ['window'] },
    { type: 'ADX', name: 'Average Directional Index', params: ['window'] },
]

const AVAILABLE_STOCKS = API_CONFIG.AVAILABLE_STOCKS

export default function StrategyBuilder({ onStrategyCreate, onBacktestRun, loading, existingStrategies = [] }) {
    const [strategyName, setStrategyName] = useState('')
    const [strategyDescription, setStrategyDescription] = useState('')
    const [indicators, setIndicators] = useState([])
    const [selectedStock, setSelectedStock] = useState(API_CONFIG.AVAILABLE_STOCKS[0])
    const [startDate, setStartDate] = useState(API_CONFIG.DEFAULT_BACKTEST.startDate)
    const [endDate, setEndDate] = useState(API_CONFIG.DEFAULT_BACKTEST.endDate)
    const [initialCapital, setInitialCapital] = useState(API_CONFIG.DEFAULT_BACKTEST.initialCapital)
    const [showPythonCode, setShowPythonCode] = useState(false)
    const [pythonCode, setPythonCode] = useState('')
    const [generatingCode, setGeneratingCode] = useState(false)
    const [selectedExistingStrategy, setSelectedExistingStrategy] = useState('')
    const [useExistingStrategy, setUseExistingStrategy] = useState(false)

    const addIndicator = () => {
        setIndicators([...indicators, { type: 'SMA', params: { window: 20 } }])
    }

    const removeIndicator = (index) => {
        setIndicators(indicators.filter((_, i) => i !== index))
    }

    const updateIndicator = (index, field, value) => {
        const updated = [...indicators]
        if (field === 'type') {
            const indicator = AVAILABLE_INDICATORS.find(ind => ind.type === value)
            updated[index] = { type: value, params: {} }
            // Set default values for the new indicator type
            indicator.params.forEach(param => {
                if (param === 'window') updated[index].params[param] = 20
                else if (param === 'span') updated[index].params[param] = 12
                else if (param === 'fast') updated[index].params[param] = 12
                else if (param === 'slow') updated[index].params[param] = 26
                else if (param === 'signal') updated[index].params[param] = 9
                else if (param === 'std') updated[index].params[param] = 2
            })
        } else {
            updated[index].params[field] = parseInt(value) || value
        }
        setIndicators(updated)
    }

    const handleCreateStrategy = async () => {
        if (!strategyName.trim()) {
            alert('Please enter a strategy name')
            return
        }

        if (indicators.length === 0) {
            alert('Please add at least one indicator')
            return
        }

        const strategyConfig = {
            name: strategyName,
            description: strategyDescription,
            config_json: {
                indicators: indicators,
                entry_conditions: {
                    type: 'crossover', // Default to crossover strategy
                    description: 'Buy when fast indicator crosses above slow indicator'
                }
            },
            visibility: 'private'
        }

        try {
            const strategy = await onStrategyCreate(strategyConfig)
            return strategy
        } catch (error) {
            console.error('Error creating strategy:', error)
            alert('Failed to create strategy: ' + error.message)
        }
    }

    const handleGeneratePythonCode = async () => {
        if (indicators.length === 0) {
            alert('Please add at least one indicator before generating code')
            return
        }

        setGeneratingCode(true)
        try {
            const { api } = await import('@/lib/api')
            const strategyConfig = {
                indicators: indicators,
                entry_conditions: {
                    type: 'crossover',
                    description: 'Buy when fast indicator crosses above slow indicator'
                }
            }

            const response = await api.generateCode({ config_json: strategyConfig })
            setPythonCode(response.python_code)
            setShowPythonCode(true)
        } catch (error) {
            console.error('Error generating Python code:', error)
            alert('Failed to generate Python code: ' + error.message)
        } finally {
            setGeneratingCode(false)
        }
    }

    const handleRunBacktest = async () => {
        try {
            let strategyId

            if (useExistingStrategy && selectedExistingStrategy) {
                // Use existing strategy
                strategyId = selectedExistingStrategy
            } else {
                // Create new strategy
                const strategy = await handleCreateStrategy()
                if (!strategy) return
                strategyId = strategy.id
            }

            // Run backtest
            const backtestConfig = {
                strategy_id: strategyId,
                dataset: selectedStock,
                start_date: startDate,
                end_date: endDate,
                initial_capital: parseFloat(initialCapital)
            }

            await onBacktestRun(backtestConfig)
        } catch (error) {
            console.error('Error running backtest:', error)
            alert('Failed to run backtest: ' + error.message)
        }
    }

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">Strategy Builder</h2>
            </div>

            <div className="space-y-6">
                {/* Strategy Selection */}
                {existingStrategies.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="checkbox"
                                id="useExisting"
                                checked={useExistingStrategy}
                                onChange={(e) => setUseExistingStrategy(e.target.checked)}
                                className="rounded"
                            />
                            <Label htmlFor="useExisting" className="font-medium">
                                Use Existing Strategy
                            </Label>
                        </div>
                        {useExistingStrategy && (
                            <div>
                                <Label htmlFor="existingStrategy">Select Strategy</Label>
                                <select
                                    id="existingStrategy"
                                    value={selectedExistingStrategy}
                                    onChange={(e) => setSelectedExistingStrategy(e.target.value)}
                                    className="w-full p-2 border rounded mt-1"
                                >
                                    <option value="">Choose a strategy...</option>
                                    {existingStrategies.map(strategy => (
                                        <option key={strategy.id} value={strategy.id}>
                                            {strategy.name} - {strategy.description || 'No description'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Strategy Basic Info - Only show when not using existing strategy */}
                {!useExistingStrategy && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="strategyName">Strategy Name</Label>
                            <Input
                                id="strategyName"
                                value={strategyName}
                                onChange={(e) => setStrategyName(e.target.value)}
                                placeholder="e.g., RSI Mean Reversion"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="strategyDescription">Description</Label>
                            <Input
                                id="strategyDescription"
                                value={strategyDescription}
                                onChange={(e) => setStrategyDescription(e.target.value)}
                                placeholder="Brief description of your strategy"
                                className="mt-1"
                            />
                        </div>
                    </div>
                )}

                {/* Indicators - Only show when not using existing strategy */}
                {!useExistingStrategy && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <Label>Technical Indicators</Label>
                            <Button onClick={addIndicator} size="sm" variant="outline">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Indicator
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {indicators.map((indicator, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <select
                                            value={indicator.type}
                                            onChange={(e) => updateIndicator(index, 'type', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        >
                                            {AVAILABLE_INDICATORS.map(ind => (
                                                <option key={ind.type} value={ind.type}>
                                                    {ind.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {AVAILABLE_INDICATORS
                                        .find(ind => ind.type === indicator.type)
                                        ?.params.map(param => (
                                            <div key={param} className="flex-1">
                                                <Input
                                                    type="number"
                                                    placeholder={param}
                                                    value={indicator.params[param] || ''}
                                                    onChange={(e) => updateIndicator(index, param, e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        ))}

                                    <Button
                                        onClick={() => removeIndicator(index)}
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {indicators.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No indicators added yet. Click "Add Indicator" to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Backtest Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="stock">Stock Symbol</Label>
                        <select
                            id="stock"
                            value={selectedStock}
                            onChange={(e) => setSelectedStock(e.target.value)}
                            className="w-full p-2 border rounded mt-1"
                        >
                            {AVAILABLE_STOCKS.map(stock => (
                                <option key={stock} value={stock}>{stock}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="capital">Initial Capital</Label>
                        <Input
                            id="capital"
                            type="number"
                            value={initialCapital}
                            onChange={(e) => setInitialCapital(e.target.value)}
                            placeholder="100000"
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    {!useExistingStrategy && (
                        <Button
                            onClick={handleGeneratePythonCode}
                            disabled={generatingCode || indicators.length === 0}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            {generatingCode ? 'Generating...' : 'Show Python Code'}
                        </Button>
                    )}
                    <Button
                        onClick={handleRunBacktest}
                        disabled={loading || (!useExistingStrategy && (!strategyName.trim() || indicators.length === 0)) || (useExistingStrategy && !selectedExistingStrategy)}
                        className="flex-1"
                    >
                        {loading ? 'Running Backtest...' : 'Run Backtest'}
                    </Button>
                </div>

                {/* Python Code Display */}
                {showPythonCode && (
                    <Card className="p-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Generated Python Code
                            </h3>
                            <Button
                                onClick={() => setShowPythonCode(false)}
                                variant="outline"
                                size="sm"
                            >
                                Close
                            </Button>
                        </div>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{pythonCode}</code>
                        </pre>
                    </Card>
                )}
            </div>
        </Card>
    )
}
