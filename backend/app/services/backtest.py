import os
import pandas as pd
import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime, date
from app.core.config import settings


def load_stock_data(symbol: str, start_date: date, end_date: date) -> pd.DataFrame:
    """
    Load stock data from CSV files in the stock_data directory.
    """
    # Ensure symbol has _NS suffix
    if not symbol.endswith("_NS"):
        symbol = f"{symbol}_NS"
    
    file_path = os.path.join(settings.stock_data_path, f"{symbol}.csv")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Stock data file not found: {file_path}")
    
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.set_index('Date')
    
    # Filter by date range
    df = df[(df.index.date >= start_date) & (df.index.date <= end_date)]
    
    return df


def generate_python_from_config(config: dict) -> str:
    """
    Generate Python code from strategy configuration.
    """
    code_lines = [
        "import pandas as pd",
        "import numpy as np",
        "def run_backtest(df, capital=100000):",
        "    df = df.copy()"
    ]

    # Add indicators based on config
    indicators = config.get("indicators", [])
    sma_windows = []
    rsi_periods = []
    macd_configs = []
    
    for ind in indicators:
        if ind.get("type") == "SMA":
            w = ind.get("window", 50)
            sma_windows.append(w)
            code_lines.append(f"    df['sma_{w}'] = df['Close'].rolling({w}).mean()")
        elif ind.get("type") == "EMA":
            span = ind.get("span", 12)
            code_lines.append(f"    df['ema_{span}'] = df['Close'].ewm(span={span}).mean()")
        elif ind.get("type") == "RSI":
            period = ind.get("window", 14)
            rsi_periods.append(period)
            code_lines.append("    delta = df['Close'].diff()")
            code_lines.append("    up = delta.clip(lower=0)")
            code_lines.append("    down = -1 * delta.clip(upper=0)")
            code_lines.append(f"    ma_up = up.rolling({period}).mean()")
            code_lines.append(f"    ma_down = down.rolling({period}).mean()")
            code_lines.append("    rs = ma_up / ma_down")
            code_lines.append(f"    df['rsi_{period}'] = 100 - (100 / (1 + rs))")
        elif ind.get("type") == "MACD":
            fast = ind.get("fast", 12)
            slow = ind.get("slow", 26)
            signal = ind.get("signal", 9)
            macd_configs.append((fast, slow, signal))
            code_lines.append(f"    exp1 = df['Close'].ewm(span={fast}).mean()")
            code_lines.append(f"    exp2 = df['Close'].ewm(span={slow}).mean()")
            code_lines.append(f"    df['macd_{fast}_{slow}'] = exp1 - exp2")
            code_lines.append(f"    df['macd_signal_{fast}_{slow}'] = df['macd_{fast}_{slow}'].ewm(span={signal}).mean()")
            code_lines.append(f"    df['macd_histogram_{fast}_{slow}'] = df['macd_{fast}_{slow}'] - df['macd_signal_{fast}_{slow}']")
        elif ind.get("type") == "BB":
            window = ind.get("window", 20)
            std = ind.get("std", 2)
            code_lines.append(f"    df['bb_middle_{window}'] = df['Close'].rolling({window}).mean()")
            code_lines.append(f"    bb_std = df['Close'].rolling({window}).std()")
            code_lines.append(f"    df['bb_upper_{window}'] = df['bb_middle_{window}'] + (bb_std * {std})")
            code_lines.append(f"    df['bb_lower_{window}'] = df['bb_middle_{window}'] - (bb_std * {std})")
        elif ind.get("type") == "ATR":
            window = ind.get("window", 14)
            code_lines.append("    high_low = df['High'] - df['Low']")
            code_lines.append("    high_close = np.abs(df['High'] - df['Close'].shift())")
            code_lines.append("    low_close = np.abs(df['Low'] - df['Close'].shift())")
            code_lines.append("    ranges = pd.concat([high_low, high_close, low_close], axis=1)")
            code_lines.append("    true_range = np.max(ranges, axis=1)")
            code_lines.append(f"    df['atr_{window}'] = true_range.rolling({window}).mean()")
        elif ind.get("type") == "ADX":
            window = ind.get("window", 14)
            code_lines.append("    # ADX calculation")
            code_lines.append("    high_low = df['High'] - df['Low']")
            code_lines.append("    high_close = np.abs(df['High'] - df['Close'].shift())")
            code_lines.append("    low_close = np.abs(df['Low'] - df['Close'].shift())")
            code_lines.append("    true_range = np.max(pd.concat([high_low, high_close, low_close], axis=1), axis=1)")
            code_lines.append("    plus_dm = df['High'].diff()")
            code_lines.append("    minus_dm = df['Low'].diff()")
            code_lines.append("    plus_dm[plus_dm < 0] = 0")
            code_lines.append("    minus_dm[minus_dm > 0] = 0")
            code_lines.append("    minus_dm = np.abs(minus_dm)")
            code_lines.append(f"    plus_di = 100 * (plus_dm.rolling({window}).mean() / true_range.rolling({window}).mean())")
            code_lines.append(f"    minus_di = 100 * (minus_dm.rolling({window}).mean() / true_range.rolling({window}).mean())")
            code_lines.append(f"    dx = 100 * np.abs(plus_di - minus_di) / (plus_di + minus_di)")
            code_lines.append(f"    df['adx_{window}'] = dx.rolling({window}).mean()")

    # Add signal generation logic
    code_lines.append("    # Signal generation")
    code_lines.append("    df['signal'] = 0")
    
    # Generate signals based on available indicators
    if len(sma_windows) >= 2:
        # SMA Crossover Strategy
        sma_windows.sort()
        fast_sma = sma_windows[0]
        slow_sma = sma_windows[1]
        code_lines.append(f"    # SMA Crossover Strategy ({fast_sma} vs {slow_sma})")
        code_lines.append(f"    df['signal'] = np.where(df['sma_{fast_sma}'] > df['sma_{slow_sma}'], 1, 0)")
        code_lines.append("    df['signal'] = df['signal'].diff()")
    elif len(rsi_periods) > 0:
        # RSI Strategy
        rsi_period = rsi_periods[0]
        code_lines.append(f"    # RSI Strategy (period {rsi_period})")
        code_lines.append(f"    df['signal'] = np.where(df['rsi_{rsi_period}'] < 30, 1, 0)")  # Oversold
        code_lines.append(f"    df['signal'] = np.where(df['rsi_{rsi_period}'] > 70, -1, df['signal'])")  # Overbought
        code_lines.append("    df['signal'] = df['signal'].diff()")
    elif len(macd_configs) > 0:
        # MACD Strategy
        fast, slow, signal = macd_configs[0]
        code_lines.append(f"    # MACD Strategy ({fast}, {slow}, {signal})")
        code_lines.append(f"    df['signal'] = np.where(df['macd_{fast}_{slow}'] > df['macd_signal_{fast}_{slow}'], 1, 0)")
        code_lines.append("    df['signal'] = df['signal'].diff()")
    else:
        # Default: Simple momentum strategy
        code_lines.append("    # Default momentum strategy")
        code_lines.append("    df['returns'] = df['Close'].pct_change()")
        code_lines.append("    df['signal'] = np.where(df['returns'] > 0.01, 1, 0)")  # 1% threshold
        code_lines.append("    df['signal'] = df['signal'].diff()")
    
    # Clean up NaN values in signal
    code_lines.append("    # Clean up NaN values in signal")
    code_lines.append("    df['signal'] = df['signal'].fillna(0)")
    
    code_lines.append("    return df")

    return "\n".join(code_lines)


def simple_vector_backtest(
    df: pd.DataFrame, 
    entry_signal_col: str = "signal", 
    capital: float = 100000.0, 
    pct_per_trade: float = 0.02
) -> Tuple[Dict, List[float]]:
    """
    Simple vectorized backtest implementation.
    """
    df = df.copy().reset_index(drop=True)
    
    if "Close" not in df.columns:
        raise ValueError("DataFrame must contain 'Close' column")

    position = 0.0
    cash = capital
    equity_curve = []
    trade_count = 0
    win_count = 0
    entry_price = None
    trades = []

    for i, row in df.iterrows():
        price = float(row["Close"])
        signal_val = row.get(entry_signal_col, 0)
        # Handle NaN values in signal
        if pd.isna(signal_val):
            signal = 0
        else:
            signal = int(signal_val)
        
        if signal == 1 and position == 0:
            # Enter long position
            position_size_cash = capital * pct_per_trade
            position = position_size_cash / price
            cash -= position * price
            entry_price = price
        elif signal == -1 and position > 0:
            # Close position
            exit_price = price
            pnl = (exit_price - entry_price) * position
            cash += position * exit_price
            
            trades.append({
                'entry_price': entry_price,
                'exit_price': exit_price,
                'pnl': pnl,
                'return_pct': (exit_price - entry_price) / entry_price
            })
            
            position = 0
            trade_count += 1
            if pnl > 0:
                win_count += 1
            entry_price = None
        
        # Compute current equity
        equity = cash + position * price
        equity_curve.append(equity)

    # Calculate metrics
    equity_series = pd.Series(equity_curve)
    returns = equity_series.pct_change().fillna(0)
    years = max(1e-6, (len(equity_series) / 252))
    final_val = float(equity_series.iloc[-1])
    cagr = (final_val / capital) ** (1 / years) - 1
    sharpe = (returns.mean() / (returns.std() + 1e-9)) * (252 ** 0.5)
    cummax = equity_series.cummax()
    drawdowns = (equity_series / cummax) - 1
    max_drawdown = float(drawdowns.min())
    win_rate = (win_count / trade_count) if trade_count > 0 else 0.0
    
    # Calculate additional metrics
    volatility = returns.std() * (252 ** 0.5)
    total_return = (final_val - capital) / capital
    
    # Calculate trade statistics
    trade_returns = [trade['return_pct'] for trade in trades]
    avg_trade_return = np.mean(trade_returns) if trade_returns else 0
    max_trade_return = max(trade_returns) if trade_returns else 0
    min_trade_return = min(trade_returns) if trade_returns else 0

    metrics = {
        "cagr": float(cagr),
        "sharpe": float(sharpe),
        "max_drawdown": float(max_drawdown),
        "win_rate": float(win_rate),
        "trades": trade_count,
        "total_return": float(total_return),
        "volatility": float(volatility),
        "final_value": float(final_val),
        "avg_trade_return": float(avg_trade_return),
        "max_trade_return": float(max_trade_return),
        "min_trade_return": float(min_trade_return),
        "profit_factor": float(sum([t['pnl'] for t in trades if t['pnl'] > 0]) / 
                              abs(sum([t['pnl'] for t in trades if t['pnl'] < 0])) 
                              if any(t['pnl'] < 0 for t in trades) else float('inf'))
    }
    
    return metrics, equity_curve


def run_backtest_with_strategy(
    strategy_config: dict,
    symbol: str,
    start_date: date,
    end_date: date,
    initial_capital: float = 100000.0
) -> Tuple[Dict, List[float]]:
    """
    Run a complete backtest with strategy configuration.
    """
    # Load stock data
    df = load_stock_data(symbol, start_date, end_date)
    
    # Generate and execute strategy code
    python_code = generate_python_from_config(strategy_config)
    
    # Create a local namespace for executing the strategy
    local_vars = {'pd': pd, 'np': np}
    exec(python_code, local_vars)
    
    # Run the strategy
    df_with_signals = local_vars['run_backtest'](df, initial_capital)
    
    # Run backtest
    metrics, equity_curve = simple_vector_backtest(
        df_with_signals, 
        "signal", 
        initial_capital
    )
    
    return metrics, equity_curve
