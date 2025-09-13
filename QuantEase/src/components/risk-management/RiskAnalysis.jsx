import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingDown, TrendingUp, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import { 
  generateRiskDecomposition, 
  generateCorrelationMatrix, 
  generateVarAnalysis, 
  generateStressTests, 
  simulateApiCall 
} from '@/utils/riskDemoData';

const RiskAnalysis = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Simulate loading with dummy data
    const loadAnalysis = async () => {
      setIsLoading(true);
      await simulateApiCall(2000);
      
      setAnalysisData({
        riskDecomposition: generateRiskDecomposition(),
        correlationMatrix: generateCorrelationMatrix(),
        varAnalysis: generateVarAnalysis(),
        stressTests: generateStressTests()
      });
      setIsLoading(false);
    };

    loadAnalysis();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Analyzing Risk Profile</h2>
            <p className="text-gray-400">Calculating correlations, VaR, and stress test scenarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <Button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Detailed Risk Analysis</h1>
          <p className="text-gray-400">Comprehensive breakdown of your portfolio's risk components</p>
        </div>

        {/* Risk Decomposition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center mb-4">
              <PieChart className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Risk Decomposition</h3>
            </div>
            <div className="space-y-4">
              {analysisData.riskDecomposition.map((factor, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">{factor.factor}</span>
                    <span className="text-white font-semibold">{factor.value}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${factor.contribution}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{factor.contribution}% contribution</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Value at Risk (VaR)</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1-Day VaR</span>
                  <span className="text-red-400 font-bold">{analysisData.varAnalysis.oneDay.value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{analysisData.varAnalysis.oneDay.confidence} confidence level</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1-Week VaR</span>
                  <span className="text-red-400 font-bold">{analysisData.varAnalysis.oneWeek.value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{analysisData.varAnalysis.oneWeek.confidence} confidence level</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">1-Month VaR</span>
                  <span className="text-red-400 font-bold">{analysisData.varAnalysis.oneMonth.value}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{analysisData.varAnalysis.oneMonth.confidence} confidence level</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Correlation Analysis */}
        <Card className="p-6 bg-gray-800 border-gray-700 mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Asset Correlation Analysis</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData.correlationMatrix.map((correlation, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                correlation.risk === 'high' ? 'border-l-red-500 bg-red-900/20' :
                correlation.risk === 'moderate' ? 'border-l-yellow-500 bg-yellow-900/20' :
                'border-l-green-500 bg-green-900/20'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{correlation.asset1} × {correlation.asset2}</span>
                  <span className={`font-bold ${
                    correlation.risk === 'high' ? 'text-red-400' :
                    correlation.risk === 'moderate' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {correlation.correlation}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  correlation.risk === 'high' ? 'text-red-300' :
                  correlation.risk === 'moderate' ? 'text-yellow-300' :
                  'text-green-300'
                }`}>
                  {correlation.risk.charAt(0).toUpperCase() + correlation.risk.slice(1)} risk correlation
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Stress Test Results */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-red-400 mr-3" />
            <h3 className="text-xl font-semibold text-white">Stress Test Scenarios</h3>
          </div>
          <div className="space-y-4">
            {analysisData.stressTests.map((test, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 font-medium">{test.scenario}</span>
                  <div className="text-right">
                    <span className="text-red-400 font-bold">{test.impact}</span>
                    <p className="text-xs text-gray-500">Expected Impact</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Probability: {test.probability}</span>
                  </div>
                  <div className="w-32 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.abs(parseFloat(test.impact))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskAnalysis;
