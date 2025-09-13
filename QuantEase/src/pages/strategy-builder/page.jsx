import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, TrendingUp, Target } from 'lucide-react';
import BasicStrategyBuilderDialog from '@/components/strategy-builder/BasicStrategyBuilderDialog';

export default function StrategyBuilderPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenBuilder = () => {
    console.log('Opening strategy builder...');
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">No-Code Strategy Builder</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Build without coding. Drag-and-drop technical indicators, connect with logical operators, 
            and set entry/exit conditions. Automatically converts visual workflows to professional Python algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Puzzle className="w-8 h-8 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Drag & Drop Interface</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Visual strategy building with intuitive drag-and-drop components for technical indicators.
            </p>
            <Button className="w-full" onClick={handleOpenBuilder}>Start Building</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Technical Indicators</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Access to RSI, MACD, Bollinger Bands, and 50+ other professional indicators.
            </p>
            <Button className="w-full" variant="outline">View Indicators</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Auto Code Generation</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Automatically converts your visual workflow to optimized Python trading algorithms.
            </p>
            <Button className="w-full" variant="outline">Learn More</Button>
          </Card>
        </div>

        <Card className="p-8 bg-gray-800">
          <h2 className="text-2xl font-semibold mb-6 text-white">Strategy Canvas</h2>
          <div className="bg-gray-700 rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-600">
            <div className="text-center">
              <Puzzle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg">Drag indicators here to start building your strategy</p>
              <Button className="mt-4" onClick={handleOpenBuilder}>Open Strategy Builder</Button>
            </div>
          </div>
        </Card>
      </div>
      
      <BasicStrategyBuilderDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
}
