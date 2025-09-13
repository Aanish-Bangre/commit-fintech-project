import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Save, Play, RotateCcw, Code, TrendingUp, GitBranch, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const BasicStrategyBuilderDialog = ({ isOpen, onClose }) => {
  const { user, session } = useAuth();
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const indicators = [
    { id: 'sma', name: 'Simple MA', type: 'indicator', color: 'bg-blue-500' },
    { id: 'ema', name: 'Exponential MA', type: 'indicator', color: 'bg-green-500' },
    { id: 'rsi', name: 'RSI', type: 'indicator', color: 'bg-purple-500' },
    { id: 'macd', name: 'MACD', type: 'indicator', color: 'bg-orange-500' }
  ];

  const conditions = [
    { id: 'gt', name: 'Greater Than (>)', type: 'condition', color: 'bg-green-500' },
    { id: 'lt', name: 'Less Than (<)', type: 'condition', color: 'bg-red-500' },
    { id: 'cross', name: 'Cross Above', type: 'condition', color: 'bg-blue-500' }
  ];

  const actions = [
    { id: 'buy', name: 'Buy Order', type: 'action', color: 'bg-green-500' },
    { id: 'sell', name: 'Sell Order', type: 'action', color: 'bg-red-500' }
  ];

  const addNode = (nodeData) => {
    const newNode = {
      ...nodeData,
      id: `${nodeData.id}_${Date.now()}`,
      parameters: getDefaultParameters(nodeData.id)
    };
    setSelectedNodes([...selectedNodes, newNode]);
  };

  const removeNode = (nodeId) => {
    setSelectedNodes(selectedNodes.filter(node => node.id !== nodeId));
  };

  const getDefaultParameters = (nodeType) => {
    switch (nodeType) {
      case 'rsi':
        return { period: 14 };
      case 'sma':
      case 'ema':
        return { period: 20 };
      case 'macd':
        return { fast: 12, slow: 26, signal: 9 };
      case 'gt':
      case 'lt':
        return { value: 30 };
      case 'buy':
      case 'sell':
        return { percentage: 10 };
      default:
        return {};
    }
  };

  const generateStrategyConfig = () => {
    const indicators = selectedNodes.filter(node => node.type === 'indicator');
    const conditions = selectedNodes.filter(node => node.type === 'condition');
    const actions = selectedNodes.filter(node => node.type === 'action');

    return {
      indicators: indicators.map(ind => ({
        type: ind.id.toUpperCase(),
        ...ind.parameters
      })),
      conditions: conditions.map(cond => ({
        type: cond.id,
        ...cond.parameters
      })),
      actions: actions.map(act => ({
        type: act.id,
        ...act.parameters
      })),
      nodes: selectedNodes
    };
  };

  const handleGenerateCode = async () => {
    try {
      const config = generateStrategyConfig();
      
      const response = await fetch('/api/v1/strategies/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ config_json: config })
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const result = await response.json();
      setGeneratedCode(result.python_code);
      setShowCode(true);
      
    } catch (error) {
      console.error('Error generating code:', error);
      alert('Failed to generate code. Please try again.');
    }
  };

  const handleSaveStrategy = async () => {
    if (!user || !strategyName) return;

    console.log('Auth debug:', { user, session, hasToken: !!session?.access_token });

    setIsSaving(true);
    try {
      const config = generateStrategyConfig();
      
      const strategyData = {
        name: strategyName,
        description: strategyDescription,
        config_json: config,
        visibility: 'private'
      };

      const response = await fetch('/api/v1/strategies/save_strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify(strategyData)
      });

      if (!response.ok) {
        throw new Error('Failed to save strategy');
      }

      alert('Strategy saved successfully!');
      
    } catch (error) {
      console.error('Error saving strategy:', error);
      alert('Failed to save strategy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedNodes.length > 0 && !confirm('Are you sure you want to reset? All changes will be lost.')) {
      return;
    }
    setSelectedNodes([]);
    setStrategyName('');
    setStrategyDescription('');
  };

  const NodeButton = ({ item, onAdd }) => (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start text-left h-auto p-3 mb-2"
      onClick={() => onAdd(item)}
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

  const SelectedNode = ({ node, onRemove }) => (
    <Card className="p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${node.color} mr-2`}></div>
          <span className="font-medium text-sm">{node.name}</span>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onRemove(node.id)}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          <X className="w-3 h-3 text-red-500" />
        </Button>
      </div>
      {Object.keys(node.parameters).length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          {Object.entries(node.parameters).map(([key, value]) => (
            <div key={key}>{key}: {value}</div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Strategy Builder</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleGenerateCode}>
                <Code className="w-4 h-4 mr-1" />
                View Code
              </Button>
              <Button
                size="sm"
                onClick={handleSaveStrategy}
                disabled={isSaving || !strategyName}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save Strategy'}
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Build your trading strategy by selecting indicators, conditions, and actions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 py-4">
          {/* Strategy Details */}
          <Card className="p-4 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategyName">Strategy Name</Label>
                <Input
                  id="strategyName"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  placeholder="Enter strategy name"
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
          </Card>

          {/* Main Builder Interface */}
          <div className="flex flex-1 space-x-4 min-h-0 overflow-hidden">
            {/* Left Panel - Node Palette */}
            <div className="w-64 space-y-4 overflow-y-auto max-h-full">
              {/* Indicators */}
              <Card className="p-4">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="font-semibold">Technical Indicators</h3>
                </div>
                <div className="space-y-1">
                  {indicators.map((indicator) => (
                    <NodeButton
                      key={indicator.id}
                      item={indicator}
                      onAdd={addNode}
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
                      key={condition.id}
                      item={condition}
                      onAdd={addNode}
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
                      key={action.id}
                      item={action}
                      onAdd={addNode}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* Center - Selected Components */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <Card className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-4 flex-shrink-0">Selected Strategy Components</h3>
                <div className="flex-1 overflow-y-auto">
                  {selectedNodes.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select components from the left panel to build your strategy</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedNodes.map((node) => (
                        <SelectedNode
                          key={node.id}
                          node={node}
                          onRemove={removeNode}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Code Preview Dialog */}
        {showCode && (
          <Dialog open={showCode} onOpenChange={setShowCode}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Generated Python Code</DialogTitle>
                <DialogDescription>
                  Python code generated from your strategy configuration.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-auto">
                <pre className="p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BasicStrategyBuilderDialog;
