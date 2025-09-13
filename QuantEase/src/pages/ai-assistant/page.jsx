import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Brain, Lightbulb, Settings } from 'lucide-react';

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold -900 mb-4">AI Assistant</h1>
          <p className="text-xl -600 max-w-3xl mx-auto">
            Prevent costly mistakes. Detects overfitting, optimizes parameters, identifies market changes. 
            ML-powered recommendations for better strategy performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold">Overfitting Detection</h3>
            </div>
            <p className="-600 mb-4">
              Advanced ML algorithms detect when your strategy is too tailored to historical data.
            </p>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">✓ Current Strategy: Low Risk</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Parameter Optimization</h3>
            </div>
            <p className="-600 mb-4">
              Automatically fine-tune strategy parameters for optimal performance.
            </p>
            <Button className="w-full">Optimize Now</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="w-8 h-8 text-yellow-600 mr-3" />
              <h3 className="text-xl font-semibold">Market Insights</h3>
            </div>
            <p className="-600 mb-4">
              Real-time analysis of market conditions and regime changes.
            </p>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">⚠ Market volatility increasing</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Bot className="w-8 h-8 text-blue-600 mr-3" />
              AI Chat Assistant
            </h2>
            <div className="rounded-lg h-64 p-4 mb-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-blue-600 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Hello! I'm your AI trading assistant. How can I help you today?</p>
                </div>
                <div className="bg-[#272727] p-3 rounded-lg max-w-xs ml-auto">
                  <p className="text-sm">Can you analyze my RSI strategy performance?</p>
                </div>
                <div className="bg-blue-600 p-3 rounded-lg max-w-xs">
                  <p className="text-sm">I've analyzed your RSI strategy. The parameters look good, but I recommend adjusting the overbought threshold from 70 to 75 based on current market conditions.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about your strategies..."
                className="flex-1 p-2 border rounded-lg"
              />
              <Button>Send</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-l-blue-500 p-4 bg-blue-50">
                <h4 className="font-semibold text-blue-800">Strategy Optimization</h4>
                <p className="text-sm text-blue-600 mt-1">
                  Your MACD crossover strategy could benefit from volume confirmation. 
                  Expected improvement: +12% annual return.
                </p>
                <Button size="sm" className="mt-2">Apply Suggestion</Button>
              </div>
              
              <div className="border-l-4 border-l-yellow-500 p-4 bg-yellow-50">
                <h4 className="font-semibold text-yellow-800">Market Condition Alert</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  Current market showing increased correlation. Consider reducing position sizes by 20%.
                </p>
                <Button size="sm" variant="outline" className="mt-2">Review Portfolio</Button>
              </div>
              
              <div className="border-l-4 border-l-green-500 p-4 bg-green-50">
                <h4 className="font-semibold text-green-800">New Opportunity</h4>
                <p className="text-sm text-green-600 mt-1">
                  Detected potential mean reversion opportunity in banking sector. 
                  High probability setup forming.
                </p>
                <Button size="sm" variant="outline" className="mt-2">Explore</Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">AI Analytics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">95%</span>
              </div>
              <h3 className="font-semibold mb-1">Strategy Health Score</h3>
              <p className="text-sm -600">Overall strategy performance rating</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">3.2</span>
              </div>
              <h3 className="font-semibold mb-1">AI Confidence</h3>
              <p className="text-sm -600">Model prediction confidence level</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">12</span>
              </div>
              <h3 className="font-semibold mb-1">Active Insights</h3>
              <p className="text-sm -600">Current AI-generated recommendations</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">24/7</span>
              </div>
              <h3 className="font-semibold mb-1">Monitoring</h3>
              <p className="text-sm -600">Continuous market analysis</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
