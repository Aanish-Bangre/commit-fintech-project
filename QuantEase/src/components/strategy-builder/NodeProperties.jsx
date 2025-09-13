import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import useStrategyStore from '@/stores/strategyStore';

const NodeProperties = () => {
  const { selectedNode, updateNode } = useStrategyStore();
  const [properties, setProperties] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setProperties({ ...selectedNode.data });
    } else {
      setProperties({});
    }
  }, [selectedNode]);

  const handlePropertyChange = (key, value) => {
    setProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, properties);
    }
  };

  if (!selectedNode) {
    return (
      <Card className="w-80 p-6">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node to edit its properties</p>
        </div>
      </Card>
    );
  }

  const renderIndicatorProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="indicatorType">Indicator Type</Label>
        <select
          id="indicatorType"
          value={properties.indicatorType || 'SMA'}
          onChange={(e) => handlePropertyChange('indicatorType', e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="SMA">Simple Moving Average</option>
          <option value="EMA">Exponential Moving Average</option>
          <option value="RSI">RSI</option>
          <option value="MACD">MACD</option>
          <option value="BB">Bollinger Bands</option>
        </select>
      </div>

      {(properties.indicatorType === 'SMA' || properties.indicatorType === 'EMA' || properties.indicatorType === 'RSI') && (
        <div>
          <Label htmlFor="window">Period</Label>
          <Input
            id="window"
            type="number"
            value={properties.window || 14}
            onChange={(e) => handlePropertyChange('window', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
      )}

      {properties.indicatorType === 'MACD' && (
        <>
          <div>
            <Label htmlFor="fast">Fast Period</Label>
            <Input
              id="fast"
              type="number"
              value={properties.fast || 12}
              onChange={(e) => handlePropertyChange('fast', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="slow">Slow Period</Label>
            <Input
              id="slow"
              type="number"
              value={properties.slow || 26}
              onChange={(e) => handlePropertyChange('slow', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="signal">Signal Period</Label>
            <Input
              id="signal"
              type="number"
              value={properties.signal || 9}
              onChange={(e) => handlePropertyChange('signal', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        </>
      )}

      {properties.indicatorType === 'BB' && (
        <>
          <div>
            <Label htmlFor="window">Period</Label>
            <Input
              id="window"
              type="number"
              value={properties.window || 20}
              onChange={(e) => handlePropertyChange('window', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="stdDev">Standard Deviations</Label>
            <Input
              id="stdDev"
              type="number"
              step="0.1"
              value={properties.stdDev || 2}
              onChange={(e) => handlePropertyChange('stdDev', parseFloat(e.target.value))}
              className="mt-1"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderConditionProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="conditionType">Condition Type</Label>
        <select
          id="conditionType"
          value={properties.conditionType || 'greater_than'}
          onChange={(e) => handlePropertyChange('conditionType', e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="greater_than">Greater Than (&gt;)</option>
          <option value="less_than">Less Than (&lt;)</option>
          <option value="crossover">Cross Above</option>
          <option value="crossunder">Cross Below</option>
          <option value="equals">Equals</option>
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
      </div>

      {(properties.conditionType === 'greater_than' || properties.conditionType === 'less_than' || properties.conditionType === 'equals') && (
        <div>
          <Label htmlFor="value">Threshold Value</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            value={properties.value || 0}
            onChange={(e) => handlePropertyChange('value', parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );

  const renderActionProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="actionType">Action Type</Label>
        <select
          id="actionType"
          value={properties.actionType || 'buy'}
          onChange={(e) => handlePropertyChange('actionType', e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="buy">Buy Order</option>
          <option value="sell">Sell Order</option>
          <option value="stop_loss">Stop Loss</option>
          <option value="take_profit">Take Profit</option>
        </select>
      </div>

      <div>
        <Label htmlFor="percentage">Position Size (% of Portfolio)</Label>
        <Input
          id="percentage"
          type="number"
          min="1"
          max="100"
          value={properties.percentage || 10}
          onChange={(e) => handlePropertyChange('percentage', parseInt(e.target.value))}
          className="mt-1"
        />
      </div>

      {(properties.actionType === 'stop_loss' || properties.actionType === 'take_profit') && (
        <div>
          <Label htmlFor="price">Target Price (Optional)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={properties.price || ''}
            onChange={(e) => handlePropertyChange('price', e.target.value ? parseFloat(e.target.value) : null)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-80 p-6">
      <div className="flex items-center mb-4">
        <Settings className="w-5 h-5 mr-2" />
        <h3 className="font-semibold">Node Properties</h3>
      </div>

      <div className="mb-4">
        <Label htmlFor="label">Node Label</Label>
        <Input
          id="label"
          value={properties.label || ''}
          onChange={(e) => handlePropertyChange('label', e.target.value)}
          className="mt-1"
        />
      </div>

      {selectedNode.type === 'indicator' && renderIndicatorProperties()}
      {selectedNode.type === 'condition' && renderConditionProperties()}
      {selectedNode.type === 'action' && renderActionProperties()}

      <Button 
        onClick={handleSave} 
        className="w-full mt-6"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </Card>
  );
};

export default NodeProperties;
