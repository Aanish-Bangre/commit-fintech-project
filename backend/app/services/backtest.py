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
    file_path = os.path.join(settings.stock_data_path, f"{symbol}_NS.csv")
    
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
    for ind in indicators:
        if ind.get("type") == "SMA":
            w = ind.get("window", 50)
            code_lines.append(f"    df['sma_{w}'] = df['Close'].rolling({w}).mean()")
        elif ind.get("type") == "RSI":
            period = ind.get("window", 14)
            code_lines.append("    delta = df['Close'].diff()")
            code_lines.append("    up = delta.clip(lower=0)")
            code_lines.append("    down = -1 * delta.clip(upper=0)")
            code_lines.append(f"    ma_up = up.rolling({period}).mean()")
            code_lines.append(f"    ma_down = down.rolling({period}).mean()")
            code_lines.append("    rs = ma_up / ma_down")
            code_lines.append("    df['rsi'] = 100 - (100 / (1 + rs))")
        elif ind.get("type") == "MACD":
            fast = ind.get("fast", 12)
            slow = ind.get("slow", 26)
            signal = ind.get("signal", 9)
            code_lines.append(f"    exp1 = df['Close'].ewm(span={fast}).mean()")
            code_lines.append(f"    exp2 = df['Close'].ewm(span={slow}).mean()")
            code_lines.append("    df['macd'] = exp1 - exp2")
            code_lines.append(f"    df['macd_signal'] = df['macd'].ewm(span={signal}).mean()")
            code_lines.append("    df['macd_histogram'] = df['macd'] - df['macd_signal']")

    # Add signal generation logic
    code_lines.append("    # Signal generation")
    code_lines.append("    df['signal'] = 0")
    
    # Simple SMA crossover strategy as default
    if any(ind.get("type") == "SMA" for ind in indicators):
        code_lines.append("    # SMA Crossover Strategy")
        code_lines.append("    df['signal'] = np.where(df['sma_10'] > df['sma_50'], 1, 0)")
        code_lines.append("    df['signal'] = df['signal'].diff()")
    
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
        signal = int(row.get(entry_signal_col, 0))
        
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
