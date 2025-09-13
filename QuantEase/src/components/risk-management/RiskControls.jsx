import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Settings, ToggleLeft, Sliders, AlertTriangle, CheckCircle } from 'lucide-react';
import { generateRiskControls, simulateApiCall } from '@/utils/riskDemoData';

const RiskControls = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [controls, setControls] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate loading with dummy data
    const loadControls = async () => {
      setIsLoading(true);
      await simulateApiCall(1800);
      
      setControls(generateRiskControls());
      setIsLoading(false);
    };

    loadControls();
  }, []);

  const handleToggleControl = (controlName) => {
    setControls(prev => ({
      ...prev,
      [controlName]: {
        ...prev[controlName],
        enabled: !prev[controlName].enabled
      }
    }));
  };

  const handleValueChange = (controlName, field, value) => {
    setControls(prev => ({
      ...prev,
      [controlName]: {
        ...prev[controlName],
        [field]: parseFloat(value) || value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await simulateApiCall(1000);
    setIsSaving(false);
    // Show success message - could add toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  text-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Button>
          
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Risk Controls</h2>
            <p className="text-gray-400">Fetching current risk management settings...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Risk Control Settings</h1>
          <p className="text-gray-400">Configure automated risk management rules and thresholds</p>
        </div>

        {/* Control Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Controls</p>
                <p className="text-2xl font-bold text-green-400">
                  {Object.values(controls).filter(control => control.enabled).length}
                </p>
                <p className="text-sm text-gray-400">Out of {Object.keys(controls).length}</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Protection Level</p>
                <p className="text-2xl font-bold text-blue-400">High</p>
                <p className="text-sm text-gray-400">Conservative setup</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Auto Actions</p>
                <p className="text-2xl font-bold text-yellow-400">3</p>
                <p className="text-sm text-gray-400">Automated responses</p>
              </div>
              <Settings className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {/* Risk Control Panels */}
        <div className="space-y-6">
          {/* Stop Loss Control */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Auto Stop Loss</h3>
                  <p className="text-sm text-gray-400">{controls.autoStopLoss?.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.autoStopLoss?.enabled}
                  onChange={() => handleToggleControl('autoStopLoss')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {controls.autoStopLoss?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Stop Loss Threshold (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={controls.autoStopLoss?.threshold}
                    onChange={(e) => handleValueChange('autoStopLoss', 'threshold', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div className="flex items-end">
                  <div className="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-300 text-sm">
                    Positions will be automatically closed when loss exceeds {controls.autoStopLoss?.threshold}%
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Position Sizing Control */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-900/30 rounded-lg">
                  <Sliders className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Position Sizing Limits</h3>
                  <p className="text-sm text-gray-400">{controls.positionSizing?.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.positionSizing?.enabled}
                  onChange={() => handleToggleControl('positionSizing')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {controls.positionSizing?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Single Position (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={controls.positionSizing?.maxSinglePosition}
                    onChange={(e) => handleValueChange('positionSizing', 'maxSinglePosition', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Sector Allocation (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={controls.positionSizing?.maxSectorAllocation}
                    onChange={(e) => handleValueChange('positionSizing', 'maxSectorAllocation', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Volatility Filter */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-900/30 rounded-lg">
                  <ToggleLeft className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Volatility Filter</h3>
                  <p className="text-sm text-gray-400">{controls.volatilityFilter?.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.volatilityFilter?.enabled}
                  onChange={() => handleToggleControl('volatilityFilter')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {controls.volatilityFilter?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Volatility Threshold (%)</label>
                  <input
                    type="number"
                    step="1"
                    value={controls.volatilityFilter?.threshold}
                    onChange={(e) => handleValueChange('volatilityFilter', 'threshold', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Action</label>
                  <select
                    value={controls.volatilityFilter?.action}
                    onChange={(e) => handleValueChange('volatilityFilter', 'action', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="reduce_exposure">Reduce Exposure</option>
                    <option value="pause_trading">Pause Trading</option>
                    <option value="alert_only">Alert Only</option>
                  </select>
                </div>
              </div>
            )}
          </Card>

          {/* Correlation Limits */}
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Correlation Limits</h3>
                  <p className="text-sm text-gray-400">{controls.correlationLimits?.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.correlationLimits?.enabled}
                  onChange={() => handleToggleControl('correlationLimits')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {controls.correlationLimits?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Max Correlation</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={controls.correlationLimits?.maxCorrelation}
                    onChange={(e) => handleValueChange('correlationLimits', 'maxCorrelation', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Action</label>
                  <select
                    value={controls.correlationLimits?.action}
                    onChange={(e) => handleValueChange('correlationLimits', 'action', e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white"
                  >
                    <option value="alert_only">Alert Only</option>
                    <option value="block_trades">Block New Trades</option>
                    <option value="suggest_diversification">Suggest Diversification</option>
                  </select>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Settings...
              </>
            ) : (
              'Save Risk Control Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiskControls;
