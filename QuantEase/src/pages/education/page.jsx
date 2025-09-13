import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, Award, Users, Brain, TrendingUp } from 'lucide-react';

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Educational Integration</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master responsible trading. Interactive tutorials on technical analysis, risk management, 
            market psychology. Contextual help and guided walkthroughs included.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Courses Completed</p>
                <p className="text-2xl font-bold">12/24</p>
                <p className="text-xs text-blue-100">50% Progress</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Skill Level</p>
                <p className="text-2xl font-bold">Intermediate</p>
                <p className="text-xs text-green-100">Level 3 of 5</p>
              </div>
              <Award className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Study Hours</p>
                <p className="text-2xl font-bold">47</p>
                <p className="text-xs text-purple-100">This month</p>
              </div>
              <PlayCircle className="w-8 h-8 text-purple-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Certificates</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-orange-100">Earned</p>
              </div>
              <Award className="w-8 h-8 text-orange-100" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-6">Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="font-semibold">Technical Analysis Fundamentals</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Master chart patterns, indicators, and price action analysis
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>7/10 modules</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Continue Learning</Button>
                  <Button size="sm" variant="outline">View Syllabus</Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <Brain className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="font-semibold">Risk Management Mastery</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Learn position sizing, stop losses, and portfolio protection
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>4/8 modules</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '50%'}}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Continue Learning</Button>
                  <Button size="sm" variant="outline">View Syllabus</Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <Users className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="font-semibold">Market Psychology</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Understand behavioral biases and emotional trading control
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>0/6 modules</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Start Learning</Button>
                  <Button size="sm" variant="outline">View Syllabus</Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <BookOpen className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="font-semibold">Algorithmic Trading</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Build and optimize automated trading strategies
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>1/12 modules</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: '8%'}}></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Continue Learning</Button>
                  <Button size="sm" variant="outline">View Syllabus</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Start Guides</h2>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Setting Up Your First Strategy</h4>
                <p className="text-sm text-gray-600">5 min read</p>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Understanding Backtesting Results</h4>
                <p className="text-sm text-gray-600">8 min read</p>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Risk Management Best Practices</h4>
                <p className="text-sm text-gray-600">12 min read</p>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-medium">Paper Trading Walkthrough</h4>
                <p className="text-sm text-gray-600">6 min read</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Video Tutorials</h3>
            <div className="space-y-2">
              <div className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <PlayCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Platform Overview</p>
                  <p className="text-xs text-gray-500">15:30</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <PlayCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Building Your First Strategy</p>
                  <p className="text-xs text-gray-500">22:45</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <PlayCircle className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Advanced Risk Controls</p>
                  <p className="text-xs text-gray-500">18:20</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Interactive Lessons</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                <h4 className="font-semibold text-blue-800">Currently Active</h4>
                <h3 className="text-lg font-semibold mt-1">RSI Indicator Deep Dive</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Interactive lesson on RSI calculation, interpretation, and trading strategies
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-blue-600">Step 3 of 8</span>
                  <Button size="sm">Continue</Button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Support & Resistance Levels</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Learn to identify key price levels and trade breakouts
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">Not started</span>
                  <Button size="sm" variant="outline">Start Lesson</Button>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Portfolio Diversification</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Understand correlation and build balanced portfolios
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">Not started</span>
                  <Button size="sm" variant="outline">Start Lesson</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Achievements & Certifications</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border">
                <Award className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Technical Analysis Basics</h4>
                  <p className="text-sm text-yellow-600">Completed on Jan 15, 2024</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg border">
                <Award className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-green-800">Risk Management Fundamentals</h4>
                  <p className="text-sm text-green-600">Completed on Dec 22, 2023</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg border">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-blue-800">Strategy Building Expert</h4>
                  <p className="text-sm text-blue-600">Completed on Nov 8, 2023</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Next Certification</p>
                  <p className="font-medium text-gray-600">Advanced Options Trading</p>
                  <p className="text-xs text-gray-500">65% progress required</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Contextual Help System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Tooltips</h3>
              <p className="text-sm text-gray-600">Hover over any indicator or term for instant explanations and context.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PlayCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Guided Walkthroughs</h3>
              <p className="text-sm text-gray-600">Step-by-step guidance for complex tasks and new feature discovery.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">AI Learning Assistant</h3>
              <p className="text-sm text-gray-600">Get personalized learning recommendations based on your progress.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
