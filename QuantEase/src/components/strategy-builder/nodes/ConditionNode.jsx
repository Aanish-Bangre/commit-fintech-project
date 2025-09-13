import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from '@/components/ui/card';
import { GitBranch, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConditionNode = memo(({ data, selected, id }) => {
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const conditionTypes = {
    greater_than: { name: '>', color: 'bg-green-500' },
    less_than: { name: '<', color: 'bg-red-500' },
    crossover: { name: 'Cross Above', color: 'bg-blue-500' },
    crossunder: { name: 'Cross Below', color: 'bg-purple-500' },
    equals: { name: '=', color: 'bg-gray-500' },
    and: { name: 'AND', color: 'bg-yellow-500' },
    or: { name: 'OR', color: 'bg-orange-500' }
  };

  const condition = conditionTypes[data.conditionType] || conditionTypes.greater_than;

  return (
    <Card className={`min-w-40 border-2 ${selected ? 'border-blue-500' : 'border-gray-300'} relative`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${condition.color} mr-2`}></div>
            <GitBranch className="w-4 h-4 mr-1" />
            <span className="font-medium text-sm">{condition.name}</span>
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
          {data.value !== undefined && (
            <div>Value: {data.value}</div>
          )}
          {data.conditionType === 'crossover' || data.conditionType === 'crossunder' ? (
            <div>Cross condition</div>
          ) : data.conditionType === 'and' || data.conditionType === 'or' ? (
            <div>Logic operator</div>
          ) : (
            <div>Comparison</div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
