import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, Award, Brain, Clock, Users, Star, TrendingUp } from 'lucide-react';
import { tutorials, getUserProgress, calculateProgress } from '@/utils/educationData';

const EducationOverview = ({ onStartTutorial }) => {
  const [userProgress, setUserProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const progress = getUserProgress();
      setUserProgress(progress);
      setIsLoading(false);
    };
    loadProgress();
  }, []);

  const getOverallProgress = () => {
    const totalTutorials = tutorials.length;
    const completedTutorials = Object.keys(userProgress).filter(
      key => userProgress[key].completed
    ).length;
    return Math.round((completedTutorials / totalTutorials) * 100);
  };

  const getTutorialProgress = (tutorial) => {
    const progress = userProgress[tutorial.id];
    if (!progress) return 0;
    return calculateProgress(progress.completedModules.length, tutorial.modules.length);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Risk Management': return Brain;
      case 'Trading': return TrendingUp;
      case 'Technical Analysis': return BookOpen;
      default: return Star;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Learning Center</h2>
            <p className="text-gray-400">Preparing your personalized learning experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Interactive Learning Center</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master trading and risk management through interactive tutorials, quizzes, and hands-on exercises
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-400">{getOverallProgress()}%</p>
                <p className="text-sm text-gray-400">Tutorials completed</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Learning Streak</p>
                <p className="text-2xl font-bold text-green-400">7</p>
                <p className="text-sm text-gray-400">Days in a row</p>
              </div>
              <PlayCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Certificates</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Object.keys(userProgress).filter(key => userProgress[key].completed).length}
                </p>
                <p className="text-sm text-gray-400">Earned</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Quiz Average</p>
                <p className="text-2xl font-bold text-purple-400">87%</p>
                <p className="text-sm text-gray-400">Success rate</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Featured Tutorial */}
        <Card className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Featured Tutorial</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">What is Sharpe Ratio?</h3>
              <p className="text-gray-300 mb-4">
                Learn the most important metric for measuring risk-adjusted returns. Perfect for beginners!
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  15 minutes
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  Beginner
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  1,234 completed
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => onStartTutorial('sharpe-ratio')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Start Learning
              </Button>
              <p className="text-xs text-gray-400 mt-2">Interactive tutorial with quiz</p>
            </div>
          </div>
        </Card>

        {/* Tutorial Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Available Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => {
              const CategoryIcon = getCategoryIcon(tutorial.category);
              const progress = getTutorialProgress(tutorial);
              const isCompleted = userProgress[tutorial.id]?.completed || false;
              
              return (
                <Card key={tutorial.id} className="p-6 bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <CategoryIcon className="w-5 h-5 text-blue-400 mr-2" />
                        <span className="text-xs text-gray-400">{tutorial.category}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs text-white ${getDifficultyColor(tutorial.difficulty)}`}>
                        {tutorial.difficulty}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{tutorial.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {tutorial.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {tutorial.modules.length} modules
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => onStartTutorial(tutorial.id)}
                      className={`flex-1 ${
                        isCompleted 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : progress > 0 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {isCompleted ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                    {isCompleted && (
                      <Button variant="outline" size="sm" className="border-green-500 text-green-400">
                        <Award className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Learning Path Recommendation */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Recommended Learning Path</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">Risk Management Track</h4>
                <p className="text-gray-400">Master risk management from basics to advanced strategies</p>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span>3 tutorials</span>
                  <span>•</span>
                  <span>~60 minutes</span>
                  <span>•</span>
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Start Track
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EducationOverview;
