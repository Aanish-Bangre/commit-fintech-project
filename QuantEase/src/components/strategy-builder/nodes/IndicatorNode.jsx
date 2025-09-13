import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IndicatorNode = memo(({ data, selected, id }) => {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const indicatorTypes = {
    SMA: { name: 'Simple MA', color: 'bg-blue-500' },
    EMA: { name: 'Exponential MA', color: 'bg-green-500' },
    RSI: { name: 'RSI', color: 'bg-purple-500' },
    MACD: { name: 'MACD', color: 'bg-orange-500' },
    BB: { name: 'Bollinger Bands', color: 'bg-pink-500' }
  };

  const indicator = indicatorTypes[data.indicatorType] || indicatorTypes.SMA;

  return (
    <Card className={`min-w-48 border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} relative`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${indicator.color} mr-2`}></div>
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="font-medium text-sm">{indicator.name}</span>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleDelete}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <X className="w-3 h-3 text-red-500" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          {data.indicatorType === 'RSI' && (
            <div>Period: {data.window || 14}</div>
          )}
          {(data.indicatorType === 'SMA' || data.indicatorType === 'EMA') && (
            <div>Period: {data.window || 20}</div>
          )}
          {data.indicatorType === 'MACD' && (
            <div>
              <div>Fast: {data.fast || 12}</div>
              <div>Slow: {data.slow || 26}</div>
              <div>Signal: {data.signal || 9}</div>
            </div>
          )}
          {data.indicatorType === 'BB' && (
            <div>
              <div>Period: {data.window || 20}</div>
              <div>Std Dev: {data.stdDev || 2}</div>
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
});

IndicatorNode.displayName = 'IndicatorNode';

export default IndicatorNode;
