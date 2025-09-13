import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Save, Play, RotateCcw, Code } from 'lucide-react';
import useStrategyStore from '@/stores/strategyStore';
import { useAuth } from '@/context/AuthContext';
import StrategyCanvas from './StrategyCanvas';
import NodePalette from './NodePalette';
import NodeProperties from './NodeProperties';

const StrategyBuilderDialog = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    currentStrategy,
    updateStrategy,
    resetStrategy,
    generateConfig,
    isDirty
  } = useStrategyStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSaveStrategy = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const config = generateConfig();
      
      const strategyData = {
        name: currentStrategy.name || 'Untitled Strategy',
        description: currentStrategy.description || '',
        config_json: config,
        visibility: 'private'
      };

      const response = await fetch('http://localhost:8000/api/v1/strategies/save_strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify(strategyData)
      });

      if (!response.ok) {
        throw new Error('Failed to save strategy');
      }

      const savedStrategy = await response.json();
      updateStrategy({ id: savedStrategy.id });
      
      // Show success message or update UI
      alert('Strategy saved successfully!');
      
    } catch (error) {
      console.error('Error saving strategy:', error);
      alert('Failed to save strategy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateCode = async () => {
    try {
      const config = generateConfig();
      
      const response = await fetch('http://localhost:8000/api/v1/strategies/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
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

  const handleReset = () => {
    if (isDirty && !confirm('Are you sure you want to reset? All unsaved changes will be lost.')) {
      return;
    }
    resetStrategy();
  };

  const handleClose = () => {
    if (isDirty && !confirm('Are you sure you want to close? All unsaved changes will be lost.')) {
      return;
    }
    onClose();
    resetStrategy();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Strategy Builder</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCode}
              >
                <Code className="w-4 h-4 mr-1" />
                View Code
              </Button>
              <Button
                size="sm"
                onClick={handleSaveStrategy}
                disabled={isSaving || !currentStrategy.name}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save Strategy'}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full space-y-4">
          {/* Strategy Details */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategyName">Strategy Name</Label>
                <Input
                  id="strategyName"
                  value={currentStrategy.name}
                  onChange={(e) => updateStrategy({ name: e.target.value })}
                  placeholder="Enter strategy name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="strategyDescription">Description</Label>
                <Input
                  id="strategyDescription"
                  value={currentStrategy.description}
                  onChange={(e) => updateStrategy({ description: e.target.value })}
                  placeholder="Brief description of your strategy"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Main Builder Interface */}
          <div className="flex flex-1 space-x-4 min-h-0">
            {/* Left Panel - Node Palette */}
            <div className="flex-shrink-0">
              <NodePalette />
            </div>

            {/* Center - Canvas */}
            <div className="flex-1 min-w-0">
              <Card className="p-4 h-full">
                <h3 className="font-semibold mb-4">Strategy Canvas</h3>
                <StrategyCanvas />
              </Card>
            </div>

            {/* Right Panel - Properties */}
            <div className="flex-shrink-0">
              <NodeProperties />
            </div>
          </div>
        </div>

        {/* Code Preview Dialog */}
        {showCode && (
          <Dialog open={showCode} onOpenChange={setShowCode}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Generated Python Code</DialogTitle>
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

export default StrategyBuilderDialog;
