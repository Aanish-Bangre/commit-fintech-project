# QuantEase Backend API Integration Guide

This guide provides comprehensive information for frontend developers to integrate with the QuantEase backend API.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication

All API endpoints (except public ones) require authentication using Supabase JWT tokens.

### Headers
```javascript
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}
```

### Getting JWT Token
Use Supabase client in your frontend:
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get the JWT token
const token = data.session?.access_token
```

## API Endpoints

### 1. Strategies

#### Create Strategy
```http
POST /strategies
```

**Request Body:**
```json
{
  "name": "My Trading Strategy",
  "description": "A simple SMA crossover strategy",
  "config_json": {
    "indicators": [
      {
        "type": "SMA",
        "window": 10
      },
      {
        "type": "SMA", 
        "window": 50
      }
    ]
  },
  "visibility": "private"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "My Trading Strategy",
  "description": "A simple SMA crossover strategy",
  "config_json": {...},
  "python_code": "generated python code",
  "visibility": "private",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### List Strategies
```http
GET /strategies
```

#### Get Strategy
```http
GET /strategies/{strategy_id}
```

#### Update Strategy
```http
PUT /strategies/{strategy_id}
```

#### Delete Strategy
```http
DELETE /strategies/{strategy_id}
```

### 2. Backtests

#### Run Backtest
```http
POST /backtests
```

**Request Body:**
```json
{
  "strategy_id": "uuid",
  "dataset": "BHARTIARTL",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "initial_capital": 100000
}
```

**Response:**
```json
{
  "id": "uuid",
  "strategy_id": "uuid",
  "dataset": "BHARTIARTL",
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "metrics_json": {
    "cagr": 0.15,
    "sharpe": 1.2,
    "max_drawdown": -0.08,
    "win_rate": 0.65,
    "trades": 45,
    "total_return": 0.45,
    "volatility": 0.18,
    "final_value": 145000,
    "avg_trade_return": 0.02,
    "max_trade_return": 0.08,
    "min_trade_return": -0.05,
    "profit_factor": 1.8
  },
  "equity_curve_url": null,
  "created_at": "2024-01-01T00:00:00"
}
```

#### List Backtests
```http
GET /backtests
```

#### Get Backtest
```http
GET /backtests/{backtest_id}
```

#### List Strategy Backtests
```http
GET /backtests/strategy/{strategy_id}
```

### 3. Paper Trading

#### Create Paper Trade
```http
POST /paper-trades
```

**Request Body:**
```json
{
  "strategy_id": "uuid",
  "symbol": "BHARTIARTL",
  "side": "buy",
  "qty": 100,
  "price": 850.50
}
```

#### List Paper Trades
```http
GET /paper-trades
```

#### Update Paper Trade
```http
PUT /paper-trades/{trade_id}
```

**Request Body:**
```json
{
  "status": "closed",
  "pnl": 150.75
}
```

### 4. Risk Reports

#### Get Risk Report
```http
GET /risk-reports/{backtest_id}
```

**Response:**
```json
{
  "id": "uuid",
  "backtest_id": "uuid",
  "risk_level": "moderate",
  "max_drawdown": -0.08,
  "sharpe": 1.2,
  "volatility": 0.18,
  "recommendations": {
    "risk_level": "moderate",
    "notes": [
      "Strategy shows good risk-adjusted returns"
    ]
  },
  "created_at": "2024-01-01T00:00:00"
}
```

### 5. Marketplace

#### Add to Marketplace
```http
POST /marketplace
```

**Request Body:**
```json
{
  "strategy_id": "uuid"
}
```

#### List Marketplace Strategies
```http
GET /marketplace
```

#### Like Strategy
```http
POST /marketplace/{marketplace_id}/like
```

#### Fork Strategy
```http
POST /marketplace/{marketplace_id}/fork
```

### 6. Education

#### List Education Content
```http
GET /education?category=technical&difficulty=beginner
```

#### Get Education Content
```http
GET /education/{education_id}
```

### 7. User Progress

#### Create/Update Progress
```http
POST /user-progress
```

**Request Body:**
```json
{
  "education_id": "uuid",
  "status": "completed"
}
```

#### List User Progress
```http
GET /user-progress?status=completed
```

## Frontend Integration Examples

### React/JavaScript Example

```javascript
// API client setup
const API_BASE = 'http://localhost:8000/api/v1'

class QuantEaseAPI {
  constructor(token) {
    this.token = token
    this.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    const config = {
      headers: this.headers,
      ...options
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    
    return response.json()
  }

  // Strategies
  async createStrategy(strategy) {
    return this.request('/strategies', {
      method: 'POST',
      body: JSON.stringify(strategy)
    })
  }

  async getStrategies() {
    return this.request('/strategies')
  }

  // Backtests
  async runBacktest(backtestConfig) {
    return this.request('/backtests', {
      method: 'POST',
      body: JSON.stringify(backtestConfig)
    })
  }

  async getBacktests() {
    return this.request('/backtests')
  }

  // Paper Trading
  async createPaperTrade(trade) {
    return this.request('/paper-trades', {
      method: 'POST',
      body: JSON.stringify(trade)
    })
  }

  async getPaperTrades() {
    return this.request('/paper-trades')
  }
}

// Usage
const api = new QuantEaseAPI(userToken)

// Create a strategy
const strategy = await api.createStrategy({
  name: "My Strategy",
  description: "Test strategy",
  config_json: {
    indicators: [
      { type: "SMA", window: 20 },
      { type: "RSI", window: 14 }
    ]
  },
  visibility: "private"
})

// Run a backtest
const backtest = await api.runBacktest({
  strategy_id: strategy.id,
  dataset: "BHARTIARTL",
  start_date: "2020-01-01",
  end_date: "2023-12-31",
  initial_capital: 100000
})
```

### Error Handling

```javascript
try {
  const result = await api.createStrategy(strategyData)
  console.log('Strategy created:', result)
} catch (error) {
  if (error.message.includes('401')) {
    // Handle authentication error
    console.log('Please log in again')
  } else if (error.message.includes('404')) {
    // Handle not found error
    console.log('Resource not found')
  } else {
    // Handle other errors
    console.log('Error:', error.message)
  }
}
```

## Available Stock Datasets

The following stock datasets are available for backtesting:

- `BHARTIARTL` - Bharti Airtel
- `HDFCBANK` - HDFC Bank
- `HINDUNILVR` - Hindustan Unilever
- `ICICIBANK` - ICICI Bank
- `INFY` - Infosys
- `ITC` - ITC Limited
- `KOTAKBANK` - Kotak Mahindra Bank
- `RELIANCE` - Reliance Industries
- `SBIN` - State Bank of India
- `TCS` - Tata Consultancy Services

## Strategy Configuration

### Supported Indicators

```json
{
  "indicators": [
    {
      "type": "SMA",
      "window": 20
    },
    {
      "type": "RSI", 
      "window": 14
    },
    {
      "type": "MACD",
      "fast": 12,
      "slow": 26,
      "signal": 9
    }
  ]
}
```

### Signal Generation

The backend automatically generates trading signals based on the configured indicators:
- SMA crossover strategies
- RSI overbought/oversold conditions
- MACD signal line crossovers

## Development Tips

1. **Always handle authentication**: Check if the user is logged in before making API calls
2. **Use proper error handling**: The API returns appropriate HTTP status codes
3. **Cache data when appropriate**: Strategies and backtests don't change frequently
4. **Show loading states**: API calls can take time, especially for backtests
5. **Validate input**: Ensure required fields are present before making requests

## Testing

Use the Swagger UI at `http://localhost:8000/docs` to test API endpoints interactively.

## Support

For issues or questions, refer to the main README.md file or check the API documentation at `/docs`.
