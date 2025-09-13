import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, GitBranch, Play, Square, Plus } from 'lucide-react';
import useStrategyStore from '@/stores/strategyStore';

const NodePalette = () => {
  const { addNode } = useStrategyStore();

  const indicators = [
    { type: 'SMA', name: 'Simple MA', color: 'bg-blue-500' },
    { type: 'EMA', name: 'Exponential MA', color: 'bg-green-500' },
    { type: 'RSI', name: 'RSI', color: 'bg-purple-500' },
    { type: 'MACD', name: 'MACD', color: 'bg-orange-500' },
    { type: 'BB', name: 'Bollinger Bands', color: 'bg-pink-500' }
  ];

  const conditions = [
    { type: 'greater_than', name: 'Greater Than (>)', color: 'bg-green-500' },
    { type: 'less_than', name: 'Less Than (<)', color: 'bg-red-500' },
    { type: 'crossover', name: 'Cross Above', color: 'bg-blue-500' },
    { type: 'crossunder', name: 'Cross Below', color: 'bg-purple-500' },
    { type: 'and', name: 'AND', color: 'bg-yellow-500' },
    { type: 'or', name: 'OR', color: 'bg-orange-500' }
  ];

  const actions = [
    { type: 'buy', name: 'Buy Order', color: 'bg-green-500' },
    { type: 'sell', name: 'Sell Order', color: 'bg-red-500' },
    { type: 'stop_loss', name: 'Stop Loss', color: 'bg-red-600' },
    { type: 'take_profit', name: 'Take Profit', color: 'bg-green-600' }
  ];

  const handleAddNode = (nodeType, dataType, defaultData = {}) => {
    // Add node at a random position for now
    const position = {
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50
    };

    const nodeData = {
      [`${dataType}Type`]: nodeType,
      ...defaultData
    };

    addNode(dataType, position, nodeData);
  };

  const NodeButton = ({ item, nodeType, dataType, defaultData }) => (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start text-left h-auto p-3 mb-2"
      onClick={() => handleAddNode(item.type, dataType, defaultData)}
    >
      <div className="flex items-center w-full">
        <div className={`w-3 h-3 rounded-full ${item.color} mr-3 flex-shrink-0`}></div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{item.name}</div>
        </div>
        <Plus className="w-4 h-4 ml-2 flex-shrink-0" />
      </div>
    </Button>
  );

  return (
    <div className="w-64 space-y-4">
      {/* Indicators */}
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="font-semibold">Technical Indicators</h3>
        </div>
        <div className="space-y-1">
          {indicators.map((indicator) => (
            <NodeButton
              key={indicator.type}
              item={indicator}
              dataType="indicator"
              defaultData={{
                window: indicator.type === 'RSI' ? 14 : 20,
                ...(indicator.type === 'MACD' && { fast: 12, slow: 26, signal: 9 }),
                ...(indicator.type === 'BB' && { stdDev: 2 })
              }}
            />
          ))}
        </div>
      </Card>

      {/* Conditions */}
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <GitBranch className="w-5 h-5 mr-2 text-purple-600" />
          <h3 className="font-semibold">Conditions</h3>
        </div>
        <div className="space-y-1">
          {conditions.map((condition) => (
            <NodeButton
              key={condition.type}
              item={condition}
              dataType="condition"
              defaultData={{
                value: condition.type.includes('than') ? 30 : undefined
              }}
            />
          ))}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <Play className="w-5 h-5 mr-2 text-green-600" />
          <h3 className="font-semibold">Actions</h3>
        </div>
        <div className="space-y-1">
          {actions.map((action) => (
            <NodeButton
              key={action.type}
              item={action}
              dataType="action"
              defaultData={{
                percentage: action.type === 'buy' || action.type === 'sell' ? 10 : undefined,
                quantity: 100
              }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NodePalette;
