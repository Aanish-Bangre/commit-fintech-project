import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Play, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionNode = memo(({ data, selected, id }) => {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const actionTypes = {
    buy: { name: 'Buy', color: 'bg-green-500', icon: Play },
    sell: { name: 'Sell', color: 'bg-red-500', icon: Square },
    stop_loss: { name: 'Stop Loss', color: 'bg-red-600', icon: Square },
    take_profit: { name: 'Take Profit', color: 'bg-green-600', icon: Square }
  };

  const action = actionTypes[data.actionType] || actionTypes.buy;
  const Icon = action.icon;

  return (
    <Card className={`min-w-40 border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} relative`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${action.color} mr-2`}></div>
            <Icon className="w-4 h-4 mr-1" />
            <span className="font-medium text-sm">{action.name}</span>
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
        
        <div className="text-xs text-gray-600">
          {data.quantity && (
            <div>Quantity: {data.quantity}%</div>
          )}
          {data.price && (
            <div>Price: {data.price}</div>
          )}
          {data.percentage && (
            <div>Size: {data.percentage}% of portfolio</div>
          )}
        </div>
      </div>
    </Card>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
