# QuantEase Complete Setup Guide

This guide will help you set up and run the complete QuantEase algorithmic trading platform with both frontend and backend components.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.12 or higher)
- Supabase account with database set up

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd final/commit-fintech-project/backend
```

### 2. Install Dependencies
```bash
pip install -e .
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

APP_NAME=QuantEase Backend
APP_VERSION=1.0.0
DEBUG=true

CORS_ORIGINS=http://localhost:3000,http://localhost:5173

STOCK_DATA_PATH=./stock_data
```

### 4. Test Backend Setup
```bash
python test_setup.py
```

### 5. Run Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at:
- API: http://localhost:8000/api/v1
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd final/commit-fintech-project/QuantEase
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the QuantEase directory:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 4. Run Frontend Development Server
```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Database Setup

### 1. Create Tables in Supabase
Run the following SQL in your Supabase SQL editor:

```sql
-- 1. Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'retail',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 2. Strategies
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    config_json JSONB NOT NULL,
    python_code TEXT,
    visibility TEXT CHECK (visibility IN ('private','public')) DEFAULT 'private',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 3. Backtests
CREATE TABLE backtests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
    dataset TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    metrics_json JSONB,
    equity_curve_url TEXT,
    created_at TIMESTAMP DEFAULT now()
);

-- 4. Paper Trades
CREATE TABLE paper_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES strategies(id) ON DELETE SET NULL,
    symbol TEXT NOT NULL,
    side TEXT CHECK (side IN ('buy','sell')) NOT NULL,
    qty NUMERIC NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('open','closed')) DEFAULT 'open',
    pnl NUMERIC,
    created_at TIMESTAMP DEFAULT now()
);

-- 5. Risk Reports
CREATE TABLE risk_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backtest_id UUID REFERENCES backtests(id) ON DELETE CASCADE,
    risk_level TEXT CHECK (risk_level IN ('low','moderate','high')),
    max_drawdown NUMERIC,
    sharpe NUMERIC,
    volatility NUMERIC,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- 6. Marketplace
CREATE TABLE marketplace (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

-- 7. Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marketplace_id UUID REFERENCES marketplace(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- 8. Education Content
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')),
    created_at TIMESTAMP DEFAULT now()
);

-- 9. User Progress (Education Tracking)
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    education_id UUID REFERENCES education(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not started','in progress','completed')) DEFAULT 'not started',
    completed_at TIMESTAMP
);

-- 10. Compliance Logs
CREATE TABLE compliance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    strategy_id UUID REFERENCES strategies(id) ON DELETE CASCADE,
    algo_id TEXT NOT NULL,
    action TEXT CHECK (action IN ('check_passed','limit_breached')),
    details JSONB,
    created_at TIMESTAMP DEFAULT now()
);
```

## Stock Data

The backend includes 15 years of historical data for 10 NSE stocks:
- BHARTIARTL, HDFCBANK, HINDUNILVR, ICICIBANK, INFY
- ITC, KOTAKBANK, RELIANCE, SBIN, TCS

Data files are located in `backend/stock_data/` and include comprehensive technical indicators.

## Features

### Backend Features
- ✅ Strategy management and storage
- ✅ Backtesting engine with 15+ years of data
- ✅ Risk analysis and reporting
- ✅ Paper trading simulation
- ✅ Marketplace for strategy sharing
- ✅ Education content management
- ✅ Compliance logging
- ✅ RESTful API with comprehensive documentation
- ✅ Python code generation from strategy configs

### Frontend Features
- ✅ Modern React-based UI
- ✅ Strategy builder with drag-and-drop indicators
- ✅ Real-time backtest results
- ✅ Interactive charts and visualizations
- ✅ User authentication and management
- ✅ Responsive design for all devices
- ✅ Dark/light theme support
- ✅ Python code preview

## Usage

### 1. Create Account
- Visit http://localhost:5173
- Sign up for a new account
- Confirm your email address

### 2. Build Strategy
- Navigate to "Strategy Builder"
- Add technical indicators (SMA, RSI, MACD, etc.)
- Configure parameters for each indicator
- Click "Show Python Code" to preview generated code

### 3. Run Backtest
- Go to "Backtesting" page
- Select stock symbol and date range
- Set initial capital
- Click "Run Backtest"

### 4. View Results
- Comprehensive performance metrics
- Risk analysis and recommendations
- Trade statistics and equity curve

### 5. Paper Trading
- Test strategies with simulated trades
- Track performance in real-time
- No real money at risk

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### Backend Issues
1. **Import errors**: Make sure all dependencies are installed with `pip install -e .`
2. **Database connection**: Verify Supabase credentials in `.env`
3. **Stock data not found**: Ensure CSV files are in `backend/stock_data/`

### Frontend Issues
1. **API connection**: Check `VITE_API_BASE_URL` in frontend `.env`
2. **Authentication**: Verify Supabase credentials
3. **Build errors**: Run `npm install` to ensure all dependencies are installed

### Common Solutions
- Clear browser cache and restart both servers
- Check console logs for detailed error messages
- Ensure both backend (port 8000) and frontend (port 5173) are running
- Verify all environment variables are set correctly

## Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure both servers are running
4. Check the API documentation at `/docs`

## Next Steps

1. **Production Deployment**: Set up production environment with proper security
2. **Real-time Data**: Integrate live market data feeds
3. **Advanced Strategies**: Add more complex strategy types
4. **Mobile App**: Develop mobile application
5. **AI Integration**: Enhance with machine learning capabilities
