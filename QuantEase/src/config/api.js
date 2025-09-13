// API Configuration for QuantEase Frontend
export const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  
  // Available stock symbols for backtesting
  AVAILABLE_STOCKS: [
    'BHARTIARTL', 'HDFCBANK', 'HINDUNILVR', 'ICICIBANK', 
    'INFY', 'ITC', 'KOTAKBANK', 'RELIANCE', 'SBIN', 'TCS'
  ],
  
  // Default backtest parameters
  DEFAULT_BACKTEST: {
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    initialCapital: 100000
  }
}
