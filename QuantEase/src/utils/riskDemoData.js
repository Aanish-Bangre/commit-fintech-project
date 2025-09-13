// Dummy data for Risk Management features
// This simulates backend API responses

export const generateRiskMetrics = () => ({
  sharpeRatio: {
    value: 1.84,
    target: 1.5,
    status: 'safe',
    change: '+0.12',
    description: 'Risk-adjusted return measure'
  },
  maxDrawdown: {
    value: -8.2,
    target: -20,
    status: 'safe',
    change: '-1.3%',
    description: 'Maximum peak-to-trough decline'
  },
  winRate: {
    value: 67,
    target: 60,
    status: 'safe',
    change: '+4%',
    description: 'Percentage of profitable trades'
  },
  volatility: {
    value: 14.7,
    target: 20,
    status: 'moderate',
    change: '+2.1%',
    description: 'Portfolio volatility measure'
  }
});

export const generatePortfolioSummary = () => ({
  totalValue: 125430,
  dailyChange: 2.4,
  overallRiskScore: 'Low',
  activeAlerts: 2,
  riskLevel: 'Conservative'
});

export const generateRecentEvents = () => [
  {
    id: 1,
    type: 'positive',
    message: 'Portfolio risk score improved to Low',
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    type: 'warning',
    message: 'Position correlation alert triggered',
    timestamp: '1 day ago'
  },
  {
    id: 3,
    type: 'info',
    message: 'Volatility filter activated',
    timestamp: '3 days ago'
  }
];

export const generateRiskDecomposition = () => [
  { factor: 'Market Risk', contribution: 45, value: '12.3%' },
  { factor: 'Sector Risk', contribution: 25, value: '6.8%' },
  { factor: 'Individual Stock Risk', contribution: 20, value: '5.4%' },
  { factor: 'Currency Risk', contribution: 10, value: '2.7%' }
];

export const generateCorrelationMatrix = () => [
  { asset1: 'RELIANCE', asset2: 'ONGC', correlation: 0.78, risk: 'high' },
  { asset1: 'TCS', asset2: 'INFY', correlation: 0.85, risk: 'high' },
  { asset1: 'HDFC', asset2: 'ICICI', correlation: 0.72, risk: 'moderate' },
  { asset1: 'ITC', asset2: 'HUL', correlation: 0.34, risk: 'low' }
];

export const generateVarAnalysis = () => ({
  oneDay: { value: '-2.1%', confidence: '95%' },
  oneWeek: { value: '-4.8%', confidence: '95%' },
  oneMonth: { value: '-8.3%', confidence: '95%' }
});

export const generateStressTests = () => [
  { scenario: 'Market Crash (-20%)', impact: '-18.7%', probability: '5%' },
  { scenario: 'Sector Rotation', impact: '-12.3%', probability: '15%' },
  { scenario: 'Interest Rate Spike', impact: '-8.9%', probability: '25%' },
  { scenario: 'Currency Devaluation', impact: '-5.4%', probability: '20%' }
];

export const generateRiskAlerts = () => [
  {
    id: 1,
    type: 'critical',
    title: 'High Correlation Detected',
    description: 'RELIANCE and ONGC showing correlation of 0.88 (>0.8 threshold)',
    timestamp: '2 minutes ago',
    status: 'active',
    action: 'Consider reducing position in one of these assets',
    severity: 'high'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Position Size Limit Exceeded',
    description: 'TCS position now represents 7.2% of portfolio (>5% limit)',
    timestamp: '15 minutes ago',
    status: 'active',
    action: 'Reduce TCS position to under 5% allocation',
    severity: 'moderate'
  },
  {
    id: 3,
    type: 'info',
    title: 'Volatility Spike Detected',
    description: 'Portfolio volatility increased to 18.3% (from 14.7%)',
    timestamp: '1 hour ago',
    status: 'monitoring',
    action: 'Monitor closely for next 24 hours',
    severity: 'low'
  },
  {
    id: 4,
    type: 'resolved',
    title: 'Stop Loss Triggered',
    description: 'HDFC position closed at -2.1% loss as per risk controls',
    timestamp: '3 hours ago',
    status: 'resolved',
    action: 'Position automatically closed',
    severity: 'low'
  },
  {
    id: 5,
    type: 'warning',
    title: 'Sector Concentration Risk',
    description: 'Banking sector allocation at 28% (>25% threshold)',
    timestamp: '6 hours ago',
    status: 'acknowledged',
    action: 'Diversify into other sectors',
    severity: 'moderate'
  },
  {
    id: 6,
    type: 'resolved',
    title: 'Margin Utilization High',
    description: 'Margin usage dropped to 65% (from 82% earlier)',
    timestamp: '1 day ago',
    status: 'resolved',
    action: 'Risk reduced successfully',
    severity: 'low'
  }
];

export const generateRiskControls = () => ({
  autoStopLoss: {
    enabled: true,
    threshold: 3.0,
    description: 'Automatically close positions when loss exceeds threshold'
  },
  positionSizing: {
    enabled: true,
    maxSinglePosition: 5.0,
    maxSectorAllocation: 25.0,
    description: 'Limit individual position and sector concentration'
  },
  volatilityFilter: {
    enabled: true,
    threshold: 20.0,
    action: 'reduce_exposure',
    description: 'Reduce exposure during high volatility periods'
  },
  correlationLimits: {
    enabled: true,
    maxCorrelation: 0.8,
    action: 'alert_only',
    description: 'Monitor asset correlations and alert when exceeded'
  },
  marginControl: {
    enabled: false,
    maxUtilization: 75.0,
    description: 'Limit margin utilization to prevent over-leverage'
  },
  drawdownProtection: {
    enabled: true,
    maxDrawdown: 15.0,
    action: 'pause_trading',
    description: 'Pause new positions when portfolio drawdown exceeds limit'
  }
});

// Simulate API delay
export const simulateApiCall = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};
