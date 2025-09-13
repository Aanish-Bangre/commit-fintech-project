import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Shield, Bell, CheckCircle, XCircle, Clock } from 'lucide-react';
import { generateRiskAlerts, simulateApiCall } from '@/utils/riskDemoData';

const RiskAlerts = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Simulate loading with dummy data
    const loadAlerts = async () => {
      setIsLoading(true);
      await simulateApiCall(1500);
      
      setAlerts(generateRiskAlerts());
      setIsLoading(false);
    };

    loadAlerts();
  }, []);

  const getAlertIcon = (type, severity) => {
    if (type === 'resolved') return CheckCircle;
    if (severity === 'high') return XCircle;
    if (severity === 'moderate') return AlertTriangle;
    return Bell;
  };

  const getAlertColor = (type, severity) => {
    if (type === 'resolved') return 'text-green-400 bg-green-900/20 border-green-500';
    if (severity === 'high') return 'text-red-400 bg-red-900/20 border-red-500';
    if (severity === 'moderate') return 'text-yellow-400 bg-yellow-900/20 border-yellow-500';
    return 'text-blue-400 bg-blue-900/20 border-blue-500';
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      monitoring: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      acknowledged: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    };
    
    return colors[status] || colors.active;
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleResolve = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved', type: 'resolved' } : alert
    ));
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
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Loading Risk Alerts</h2>
            <p className="text-gray-400">Checking for active risk notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'high' && alert.status === 'active').length;

  return (
    <div className="min-h-screen  text-white px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <Button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Risk Alerts & Notifications</h1>
          <p className="text-gray-400">Monitor and manage your portfolio risk alerts</p>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-400">{activeAlerts}</p>
                <p className="text-sm text-gray-400">Require attention</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-400">{criticalAlerts}</p>
                <p className="text-sm text-gray-400">High priority</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Resolved Today</p>
                <p className="text-2xl font-bold text-green-400">
                  {alerts.filter(alert => alert.status === 'resolved' && alert.timestamp.includes('hour')).length}
                </p>
                <p className="text-sm text-gray-400">Issues fixed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {alerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.type, alert.severity);
            return (
              <Card key={alert.id} className={`p-6 bg-gray-800 border-l-4 ${getAlertColor(alert.type, alert.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${getAlertColor(alert.type, alert.severity)}`}>
                      <AlertIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(alert.status)}`}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {alert.timestamp}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{alert.description}</p>
                      <div className="p-3 bg-gray-700 rounded-lg mb-3">
                        <p className="text-sm text-gray-300">
                          <strong>Recommended Action:</strong> {alert.action}
                        </p>
                      </div>
                      {alert.status === 'active' && (
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcknowledge(alert.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Acknowledge
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleResolve(alert.id)}
                            className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                          >
                            Mark Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Alert Settings */}
        <Card className="p-6 bg-gray-800 border-gray-700 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Alert Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Notification Preferences</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <span className="text-gray-300">Email notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded bg-gray-700 border-gray-600" />
                  <span className="text-gray-300">Browser notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                  <span className="text-gray-300">SMS alerts (critical only)</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Alert Thresholds</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Position size limit (%)</label>
                  <input 
                    type="number" 
                    defaultValue="5" 
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Correlation threshold</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    defaultValue="0.8" 
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskAlerts;
