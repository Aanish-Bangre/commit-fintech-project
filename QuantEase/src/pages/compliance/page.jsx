import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SEBI Compliance Module</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trade legally. Unique algorithm IDs, automated position limits, market manipulation safeguards. 
            Complete regulatory compliance built-in.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Compliance Status</p>
                <p className="text-2xl font-bold">ACTIVE</p>
                <p className="text-xs text-green-100">All checks passed</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Algorithm ID</p>
                <p className="text-lg font-bold">QE-ALG-2024-001</p>
                <p className="text-xs text-blue-100">SEBI Registered</p>
              </div>
              <FileCheck className="w-8 h-8 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Position Limit</p>
                <p className="text-2xl font-bold">₹50L</p>
                <p className="text-xs text-purple-100">Auto-enforced</p>
              </div>
              <Shield className="w-8 h-8 text-purple-100" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Risk Score</p>
                <p className="text-2xl font-bold">LOW</p>
                <p className="text-xs text-orange-100">Within limits</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-100" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">SEBI Compliance Checklist</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Algorithm Registration</p>
                  <p className="text-sm text-green-600">Unique ID assigned and verified</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Position Monitoring</p>
                  <p className="text-sm text-green-600">Automated limits active</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Market Manipulation Check</p>
                  <p className="text-sm text-green-600">Real-time monitoring enabled</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Audit Trail</p>
                  <p className="text-sm text-green-600">Complete transaction logging</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Risk Disclosure</p>
                  <p className="text-sm text-green-600">User acknowledgment recorded</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Real-time Monitoring</h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-800">Position Limits</h4>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Exposure</span>
                    <span>₹42,00,000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '84%'}}></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">84% of limit used</p>
                </div>
              </div>
              
              <div className="p-4 border-l-4 border-l-green-500 bg-green-50">
                <h4 className="font-semibold text-green-800">Market Impact</h4>
                <p className="text-sm text-green-600 mt-1">
                  Current trading activity: 0.02% of market volume
                </p>
                <p className="text-xs text-green-600">Well within acceptable limits</p>
              </div>
              
              <div className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50">
                <h4 className="font-semibold text-yellow-800">Velocity Checks</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  Order frequency: 12 orders/minute
                </p>
                <p className="text-xs text-yellow-600">Monitoring for unusual patterns</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Algorithm Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Registration ID</span>
                <span className="font-medium">QE-ALG-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Strategy Type</span>
                <span className="font-medium">Statistical Arbitrage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Category</span>
                <span className="font-medium">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Date</span>
                <span className="font-medium">15-Jan-2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valid Until</span>
                <span className="font-medium">14-Jan-2025</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Risk Controls</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Position Size</span>
                <span className="font-medium">₹50,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Loss Limit</span>
                <span className="font-medium">₹2,00,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Rate Limit</span>
                <span className="font-medium">20/minute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Market Impact</span>
                <span className="font-medium">&lt;0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Circuit Breaker</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Reporting</h3>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <FileCheck className="w-4 h-4 mr-2" />
                Generate Daily Report
              </Button>
              <Button className="w-full" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Compliance Certificate
              </Button>
              <Button className="w-full" variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                Audit Trail Export
              </Button>
              <Button className="w-full" variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                SEBI Filing Status
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Compliance Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Timestamp</th>
                  <th className="text-left py-2">Event Type</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3">2024-01-15 09:30:15</td>
                  <td className="py-3">Position Check</td>
                  <td className="py-3">Daily position limit verification</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Passed</span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3">2024-01-15 10:45:22</td>
                  <td className="py-3">Market Impact</td>
                  <td className="py-3">Order impact assessment</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Compliant</span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline">View Details</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3">2024-01-15 14:20:08</td>
                  <td className="py-3">Algorithm Update</td>
                  <td className="py-3">Strategy parameters modified</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Approved</span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="outline">View Details</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
