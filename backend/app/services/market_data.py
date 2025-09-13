import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging

logger = logging.getLogger(__name__)

class MarketDataService:
    """Service for fetching real-time market data using yfinance"""
    
    def __init__(self):
        self.executor = ThreadPoolExecutor(max_workers=10)
        self.cache = {}
        self.cache_duration = timedelta(minutes=1)  # Cache for 1 minute
    
    def _get_nse_symbol(self, symbol: str) -> str:
        """Convert symbol to NSE format for yfinance"""
        if not symbol.endswith('.NS'):
            return f"{symbol}.NS"
        return symbol
    
    async def get_current_price(self, symbol: str) -> float:
        """Get current market price for a symbol"""
        try:
            nse_symbol = self._get_nse_symbol(symbol)
            
            # Check cache first
            cache_key = f"price_{nse_symbol}"
            if cache_key in self.cache:
                cached_data, timestamp = self.cache[cache_key]
                if datetime.now() - timestamp < self.cache_duration:
                    return cached_data
            
            # Fetch from yfinance
            loop = asyncio.get_event_loop()
            ticker = await loop.run_in_executor(
                self.executor, 
                lambda: yf.Ticker(nse_symbol)
            )
            
            info = await loop.run_in_executor(
                self.executor,
                lambda: ticker.info
            )
            
            current_price = info.get('currentPrice') or info.get('regularMarketPrice')
            
            if current_price is None:
                # Fallback to last close price
                hist = await loop.run_in_executor(
                    self.executor,
                    lambda: ticker.history(period="1d")
                )
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                else:
                    raise ValueError(f"No price data available for {symbol}")
            
            # Cache the result
            self.cache[cache_key] = (current_price, datetime.now())
            
            return float(current_price)
            
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {e}")
            raise ValueError(f"Failed to fetch price for {symbol}: {str(e)}")
    
    async def get_market_data(self, symbol: str) -> Dict:
        """Get comprehensive market data for a symbol"""
        try:
            nse_symbol = self._get_nse_symbol(symbol)
            
            # Check cache first
            cache_key = f"data_{nse_symbol}"
            if cache_key in self.cache:
                cached_data, timestamp = self.cache[cache_key]
                if datetime.now() - timestamp < self.cache_duration:
                    return cached_data
            
            # Fetch from yfinance
            loop = asyncio.get_event_loop()
            ticker = await loop.run_in_executor(
                self.executor, 
                lambda: yf.Ticker(nse_symbol)
            )
            
            # Get info and history
            info = await loop.run_in_executor(
                self.executor,
                lambda: ticker.info
            )
            
            hist = await loop.run_in_executor(
                self.executor,
                lambda: ticker.history(period="2d")
            )
            
            if hist.empty:
                raise ValueError(f"No historical data available for {symbol}")
            
            current_price = info.get('currentPrice') or info.get('regularMarketPrice')
            if current_price is None:
                current_price = hist['Close'].iloc[-1]
            
            previous_close = hist['Close'].iloc[-2] if len(hist) > 1 else current_price
            
            market_data = {
                'symbol': symbol,
                'price': float(current_price),
                'change': float(current_price - previous_close),
                'change_percent': float((current_price - previous_close) / previous_close * 100),
                'volume': int(hist['Volume'].iloc[-1]) if 'Volume' in hist.columns else 0,
                'high': float(hist['High'].iloc[-1]),
                'low': float(hist['Low'].iloc[-1]),
                'open': float(hist['Open'].iloc[-1]),
                'previous_close': float(previous_close),
                'timestamp': datetime.now()
            }
            
            # Cache the result
            self.cache[cache_key] = (market_data, datetime.now())
            
            return market_data
            
        except Exception as e:
            logger.error(f"Error fetching market data for {symbol}: {e}")
            raise ValueError(f"Failed to fetch market data for {symbol}: {str(e)}")
    
    async def get_multiple_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get current prices for multiple symbols"""
        try:
            tasks = [self.get_current_price(symbol) for symbol in symbols]
            prices = await asyncio.gather(*tasks, return_exceptions=True)
            
            result = {}
            for symbol, price in zip(symbols, prices):
                if isinstance(price, Exception):
                    logger.error(f"Error fetching price for {symbol}: {price}")
                    result[symbol] = None
                else:
                    result[symbol] = price
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching multiple prices: {e}")
            raise
    
    async def get_historical_data(self, symbol: str, period: str = "1mo") -> pd.DataFrame:
        """Get historical data for a symbol"""
        try:
            nse_symbol = self._get_nse_symbol(symbol)
            
            loop = asyncio.get_event_loop()
            ticker = await loop.run_in_executor(
                self.executor, 
                lambda: yf.Ticker(nse_symbol)
            )
            
            hist = await loop.run_in_executor(
                self.executor,
                lambda: ticker.history(period=period)
            )
            
            if hist.empty:
                raise ValueError(f"No historical data available for {symbol}")
            
            return hist
            
        except Exception as e:
            logger.error(f"Error fetching historical data for {symbol}: {e}")
            raise ValueError(f"Failed to fetch historical data for {symbol}: {str(e)}")
    
    def clear_cache(self):
        """Clear the cache"""
        self.cache.clear()

# Global instance
market_data_service = MarketDataService()
