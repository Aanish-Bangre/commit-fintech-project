// Educational content data for interactive tutorials and quizzes

export const tutorials = [
  {
    id: 'sharpe-ratio',
    title: 'What is Sharpe Ratio?',
    category: 'Risk Management',
    difficulty: 'Beginner',
    duration: '15 minutes',
    description: 'Learn how to measure risk-adjusted returns and evaluate portfolio performance',
    progress: 0,
    modules: [
      {
        id: 1,
        title: 'Introduction to Sharpe Ratio',
        type: 'content',
        content: {
          text: `The Sharpe Ratio is one of the most important metrics in finance for measuring risk-adjusted returns. 
                 
                 Named after Nobel laureate William Sharpe, this ratio helps investors understand how much excess return they receive for the extra volatility they endure.
                 
                 **Formula:** Sharpe Ratio = (Portfolio Return - Risk-free Rate) / Portfolio Standard Deviation
                 
                 A higher Sharpe ratio indicates better risk-adjusted performance.`,
          image: '/api/placeholder/600/300',
          keyPoints: [
            'Measures risk-adjusted returns',
            'Higher ratio = better performance',
            'Compares excess return to volatility',
            'Used for portfolio comparison'
          ]
        }
      },
      {
        id: 2,
        title: 'Understanding the Components',
        type: 'interactive',
        content: {
          text: `Let's break down each component of the Sharpe Ratio formula:`,
          components: [
            {
              name: 'Portfolio Return',
              description: 'The average return of your investment over a specific period',
              example: '12% annual return'
            },
            {
              name: 'Risk-free Rate', 
              description: 'The return of a risk-free investment (typically government bonds)',
              example: '3% treasury bill rate'
            },
            {
              name: 'Standard Deviation',
              description: 'Measures the volatility or risk of the portfolio returns',
              example: '15% annual volatility'
            }
          ],
          calculation: {
            portfolioReturn: 12,
            riskFreeRate: 3,
            standardDeviation: 15,
            result: 0.6
          }
        }
      },
      {
        id: 3,
        title: 'Interpreting Sharpe Ratios',
        type: 'content',
        content: {
          text: `Understanding what different Sharpe Ratio values mean:`,
          interpretations: [
            { range: '< 0', meaning: 'Poor performance - portfolio underperforms risk-free rate', color: 'red' },
            { range: '0 - 1', meaning: 'Below average performance', color: 'orange' },
            { range: '1 - 2', meaning: 'Good performance', color: 'yellow' },
            { range: '2 - 3', meaning: 'Very good performance', color: 'lightgreen' },
            { range: '> 3', meaning: 'Excellent performance (rare)', color: 'green' }
          ],
          realWorldExamples: [
            { name: 'S&P 500 (Historical)', value: 0.5, description: 'Long-term market average' },
            { name: 'Hedge Fund Average', value: 0.8, description: 'Professional management' },
            { name: 'Warren Buffett', value: 0.76, description: 'Legendary investor performance' }
          ]
        }
      }
    ],
    quiz: {
      id: 'sharpe-ratio-quiz',
      title: 'Sharpe Ratio Quiz',
      questions: [
        {
          id: 1,
          question: 'What does the Sharpe Ratio measure?',
          type: 'multiple-choice',
          options: [
            'Total portfolio returns',
            'Risk-adjusted returns',
            'Portfolio volatility only',
            'Risk-free rate comparison'
          ],
          correct: 1,
          explanation: 'The Sharpe Ratio measures risk-adjusted returns by comparing excess return to volatility.'
        },
        {
          id: 2,
          question: 'If a portfolio has 10% return, 2% risk-free rate, and 12% volatility, what is the Sharpe Ratio?',
          type: 'calculation',
          options: ['0.5', '0.67', '0.83', '1.2'],
          correct: 1,
          explanation: 'Sharpe Ratio = (10% - 2%) / 12% = 8% / 12% = 0.67'
        },
        {
          id: 3,
          question: 'A Sharpe Ratio of 1.5 indicates:',
          type: 'multiple-choice',
          options: [
            'Poor performance',
            'Average performance', 
            'Good performance',
            'Risk-free investment'
          ],
          correct: 2,
          explanation: 'A Sharpe Ratio between 1-2 indicates good risk-adjusted performance.'
        }
      ]
    }
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Basics',
    category: 'Trading',
    difficulty: 'Beginner',
    duration: '20 minutes',
    description: 'Master the fundamentals of chart reading and technical indicators',
    progress: 0,
    modules: [
      {
        id: 1,
        title: 'Introduction to Technical Analysis',
        type: 'content',
        content: {
          text: `Technical Analysis is the study of price movements and trading volume to predict future price directions.
                 
                 Unlike fundamental analysis, technical analysis focuses purely on price action and market psychology.
                 
                 **Core Principles:**
                 - Price discounts everything
                 - Prices move in trends  
                 - History tends to repeat itself`,
          keyPoints: [
            'Studies price and volume patterns',
            'Predicts future price movements',
            'Based on market psychology',
            'Uses charts and indicators'
          ]
        }
      },
      {
        id: 2,
        title: 'Chart Types and Patterns',
        type: 'interactive',
        content: {
          text: 'Learn about different chart types and how to read them:',
          chartTypes: [
            {
              name: 'Candlestick Charts',
              description: 'Shows open, high, low, close prices',
              benefits: 'Most informative, shows market sentiment'
            },
            {
              name: 'Line Charts',
              description: 'Connects closing prices',
              benefits: 'Simple trend identification'
            },
            {
              name: 'Bar Charts',
              description: 'Shows OHLC with vertical bars',
              benefits: 'Clear price range visualization'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'technical-analysis-quiz',
      title: 'Technical Analysis Quiz',
      questions: [
        {
          id: 1,
          question: 'What is the main focus of technical analysis?',
          type: 'multiple-choice',
          options: [
            'Company fundamentals',
            'Economic indicators',
            'Price movements and volume',
            'Financial statements'
          ],
          correct: 2,
          explanation: 'Technical analysis focuses on price movements and trading volume patterns.'
        }
      ]
    }
  },
  {
    id: 'risk-management',
    title: 'Risk Management Fundamentals',
    category: 'Risk Management',
    difficulty: 'Intermediate',
    duration: '25 minutes',
    description: 'Learn essential risk management techniques to protect your capital',
    progress: 0,
    modules: [
      {
        id: 1,
        title: 'Introduction to Risk Management',
        type: 'content',
        content: {
          text: `Risk management is the process of identifying, analyzing, and controlling threats to your capital.
                 
                 It's not about avoiding risk entirely, but managing it intelligently to preserve capital while maximizing returns.
                 
                 **Key Concepts:**
                 - Position sizing
                 - Stop losses
                 - Diversification
                 - Risk-reward ratios`,
          keyPoints: [
            'Protects trading capital',
            'Controls downside risk',
            'Enables consistent profits',
            'Reduces emotional decisions'
          ]
        }
      }
    ],
    quiz: {
      id: 'risk-management-quiz',
      title: 'Risk Management Quiz',
      questions: [
        {
          id: 1,
          question: 'What is the primary goal of risk management?',
          type: 'multiple-choice',
          options: [
            'Maximize profits at any cost',
            'Avoid all risks completely',
            'Protect capital while managing risk',
            'Eliminate market volatility'
          ],
          correct: 2,
          explanation: 'Risk management aims to protect capital while intelligently managing risk exposure.'
        }
      ]
    }
  }
];

export const userProgress = {
  completedTutorials: [],
  completedQuizzes: [],
  totalScore: 0,
  level: 1,
  experiencePoints: 0,
  certificates: []
};

export const achievements = [
  {
    id: 'first-tutorial',
    title: 'First Steps',
    description: 'Complete your first tutorial',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Score 100% on 3 quizzes',
    icon: '🧠',
    unlocked: false
  },
  {
    id: 'risk-expert',
    title: 'Risk Management Expert',
    description: 'Complete all risk management tutorials',
    icon: '🛡️',
    unlocked: false
  },
  {
    id: 'technical-analyst',
    title: 'Technical Analyst',
    description: 'Master technical analysis basics',
    icon: '📈',
    unlocked: false
  }
];

// Simulate API calls
export const simulateApiCall = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const calculateProgress = (completedModules, totalModules) => {
  return Math.round((completedModules / totalModules) * 100);
};

export const updateUserProgress = (tutorialId, moduleId, quizScore = null) => {
  // This would normally update backend, but for demo we'll use localStorage
  const progress = JSON.parse(localStorage.getItem('educationProgress') || '{}');
  
  if (!progress[tutorialId]) {
    progress[tutorialId] = {
      completedModules: [],
      quizScore: null,
      completed: false
    };
  }
  
  if (moduleId && !progress[tutorialId].completedModules.includes(moduleId)) {
    progress[tutorialId].completedModules.push(moduleId);
  }
  
  if (quizScore !== null) {
    progress[tutorialId].quizScore = quizScore;
    progress[tutorialId].completed = true;
  }
  
  localStorage.setItem('educationProgress', JSON.stringify(progress));
  return progress;
};

export const getUserProgress = () => {
  return JSON.parse(localStorage.getItem('educationProgress') || '{}');
};
