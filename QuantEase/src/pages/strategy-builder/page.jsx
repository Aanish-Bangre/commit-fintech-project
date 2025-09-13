import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, TrendingUp, Target } from 'lucide-react';

export default function StrategyBuilderPage() {
  return (
    <div className="min-h-screen px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold -900 mb-4">No-Code Strategy Builder</h1>
          <p className="text-xl -600 max-w-3xl mx-auto">
            Build without coding. Drag-and-drop technical indicators, connect with logical operators, 
            and set entry/exit conditions. Automatically converts visual workflows to professional Python algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Puzzle className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold">Drag & Drop Interface</h3>
            </div>
            <p className="-600 mb-4">
              Visual strategy building with intuitive drag-and-drop components for technical indicators.
            </p>
            <Button className="w-full">Start Building</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold">Technical Indicators</h3>
            </div>
            <p className="-600 mb-4">
              Access to RSI, MACD, Bollinger Bands, and 50+ other professional indicators.
            </p>
            <Button className="w-full" variant="outline">View Indicators</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold">Auto Code Generation</h3>
            </div>
            <p className="-600 mb-4">
              Automatically converts your visual workflow to optimized Python trading algorithms.
            </p>
            <Button className="w-full" variant="outline">Learn More</Button>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Strategy Canvas</h2>
          <div className="rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Puzzle className="w-16 h-16 -400 mx-auto mb-4" />
              <p className="-500 text-lg">Drag indicators here to start building your strategy</p>
              <Button className="mt-4">Open Strategy Builder</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
