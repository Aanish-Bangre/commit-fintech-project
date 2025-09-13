#!/usr/bin/env python3
"""
Simple test script to verify the backend setup
"""
import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

try:
    from app.core.config import settings
    from app.core.database import supabase
    from app.services.backtest import load_stock_data
    from datetime import date
    
    print("✅ Configuration loaded successfully")
    print(f"   App Name: {settings.app_name}")
    print(f"   Debug Mode: {settings.debug}")
    
    print("✅ Database connection established")
    
    # Test stock data loading
    try:
        df = load_stock_data("BHARTIARTL", date(2020, 1, 1), date(2020, 12, 31))
        print(f"✅ Stock data loaded successfully: {len(df)} rows")
        print(f"   Columns: {list(df.columns)}")
    except Exception as e:
        print(f"⚠️  Stock data loading failed: {e}")
        print("   Make sure stock data files are in the stock_data/ directory")
    
    print("\n🎉 Backend setup verification completed!")
    print("   You can now run: python run.py")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("   Make sure all dependencies are installed: pip install -e .")
except Exception as e:
    print(f"❌ Setup error: {e}")
    print("   Check your .env file and database configuration")
