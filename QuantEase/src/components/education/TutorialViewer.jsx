import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, BookOpen, Play, Target } from 'lucide-react';

const TutorialViewer = ({ tutorialId, onComplete, onBack }) => {
  const [tutorial, setTutorial] = useState(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTutorial = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Import and find tutorial
      const { tutorials, getUserProgress } = await import('@/utils/educationData');
      const tutorialData = tutorials.find(t => t.id === tutorialId);
      const progress = getUserProgress();
      
      setTutorial(tutorialData);
      setCompletedModules(progress[tutorialId]?.completedModules || []);
      setIsLoading(false);
    };
    
    loadTutorial();
  }, [tutorialId]);

  const handleCompleteModule = () => {
    const moduleId = tutorial.modules[currentModule].id;
    if (!completedModules.includes(moduleId)) {
      const updated = [...completedModules, moduleId];
      setCompletedModules(updated);
      
      // Update progress in localStorage
      const { updateUserProgress } = require('@/utils/educationData');
      updateUserProgress(tutorialId, moduleId);
    }
  };

  const handleNext = () => {
    handleCompleteModule();
    if (currentModule < tutorial.modules.length - 1) {
      setCurrentModule(currentModule + 1);
    } else {
      // Tutorial completed, move to quiz
      onComplete(tutorialId);
    }
  };

  const handlePrevious = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  const renderModuleContent = (module) => {
    switch (module.type) {
      case 'content':
        return (
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {module.content.text}
              </div>
            </div>
            
            {module.content.keyPoints && (
              <Card className="p-6 bg-blue-900/20 border-blue-500/30">
                <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {module.content.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {module.content.interpretations && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Interpretation Guide</h4>
                <div className="grid gap-3">
                  {module.content.interpretations.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      item.color === 'red' ? 'border-l-red-500 bg-red-900/20' :
                      item.color === 'orange' ? 'border-l-orange-500 bg-orange-900/20' :
                      item.color === 'yellow' ? 'border-l-yellow-500 bg-yellow-900/20' :
                      item.color === 'lightgreen' ? 'border-l-lime-500 bg-lime-900/20' :
                      'border-l-green-500 bg-green-900/20'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{item.range}</span>
                        <span className="text-gray-300">{item.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {module.content.realWorldExamples && (
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Real-World Examples</h4>
                <div className="space-y-3">
                  {module.content.realWorldExamples.map((example, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                      <div>
                        <span className="font-medium text-white">{example.name}</span>
                        <p className="text-sm text-gray-400">{example.description}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-400">{example.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="text-gray-300 leading-relaxed text-lg mb-6">
              {module.content.text}
            </div>

            {module.content.components && (
              <div className="grid gap-6">
                {module.content.components.map((component, index) => (
                  <Card key={index} className="p-6 bg-gray-800 border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">{component.name}</h4>
                    <p className="text-gray-300 mb-2">{component.description}</p>
                    <div className="text-sm text-green-400 font-medium">
                      Example: {component.example}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {module.content.calculation && (
              <Card className="p-6 bg-green-900/20 border-green-500/30">
                <h4 className="text-lg font-semibold text-green-300 mb-4">Live Calculation</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{module.content.calculation.portfolioReturn}%</div>
                      <div className="text-sm text-gray-400">Portfolio Return</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{module.content.calculation.riskFreeRate}%</div>
                      <div className="text-sm text-gray-400">Risk-free Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{module.content.calculation.standardDeviation}%</div>
                      <div className="text-sm text-gray-400">Standard Deviation</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Sharpe Ratio =</div>
                    <div className="text-xl text-white mb-1">
                      ({module.content.calculation.portfolioReturn}% - {module.content.calculation.riskFreeRate}%) / {module.content.calculation.standardDeviation}%
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      = {module.content.calculation.result}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {module.content.chartTypes && (
              <div className="grid gap-4">
                {module.content.chartTypes.map((chart, index) => (
                  <Card key={index} className="p-6 bg-gray-800 border-gray-700">
                    <h4 className="text-lg font-semibold text-blue-400 mb-2">{chart.name}</h4>
                    <p className="text-gray-300 mb-2">{chart.description}</p>
                    <div className="text-sm text-green-400">✓ {chart.benefits}</div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-gray-400">Content type not supported</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Tutorial</h2>
            <p className="text-gray-400">Preparing your learning content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-semibold text-white mb-2">Tutorial Not Found</h2>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Center
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((currentModule + 1) / tutorial.modules.length) * 100);
  const currentModuleData = tutorial.modules[currentModule];
  const isModuleCompleted = completedModules.includes(currentModuleData.id);

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="border-gray-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Center
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{tutorial.title}</h1>
            <p className="text-gray-400">{tutorial.category} • {tutorial.difficulty}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Module {currentModule + 1} of {tutorial.modules.length}</div>
            <div className="text-lg font-semibold text-blue-400">{progress}% Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-2">
            {tutorial.modules.map((module, index) => (
              <div 
                key={module.id}
                className={`w-3 h-3 rounded-full ${
                  index === currentModule 
                    ? 'bg-blue-500' 
                    : completedModules.includes(module.id)
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Module Content */}
        <Card className="p-8 bg-gray-800 border-gray-700 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">{currentModuleData.title}</h2>
              {isModuleCompleted && (
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Completed
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {currentModuleData.type === 'interactive' ? 'Interactive' : 'Reading'}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                ~5 minutes
              </div>
            </div>
          </div>

          {renderModuleContent(currentModuleData)}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            onClick={handlePrevious}
            disabled={currentModule === 0}
            variant="outline"
            className="border-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button 
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentModule === tutorial.modules.length - 1 ? 'Take Quiz' : 'Next Module'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorialViewer;
