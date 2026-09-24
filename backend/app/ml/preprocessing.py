"""
Data Preprocessing Module
Downloads historical market data via yfinance, cleans financial time series,
and performs chronological train/val/test splits without data leakage.
"""

from pathlib import Path
from typing import Tuple, Optional
import pandas as pd
import yfinance as yf
from app.assets.asset_config import AssetConfig
from app.core.config import settings

def download_historical_data(asset: AssetConfig, years: int = 7) -> pd.DataFrame:
    """
    Downloads ~6-7 years of daily historical data using yfinance.
    Normalizes columns and timestamps.
    """
    period = f"{years}y"
    ticker = yf.Ticker(asset.symbol_yfinance)
    df = ticker.history(period=period, interval="1d")

    if df.empty:
        raise ValueError(f"Failed to download historical data for {asset.name} ({asset.symbol_yfinance})")

    # Reset index to make Date a column
    df = df.reset_index()

    # Standardize column names
    df.rename(columns={
        "Date": "Date",
        "Open": "Open",
        "High": "High",
        "Low": "Low",
        "Close": "Close",
        "Volume": "Volume"
    }, inplace=True)

    # Ensure required columns exist
    required_cols = ["Date", "Open", "High", "Low", "Close", "Volume"]
    for col in required_cols:
        if col not in df.columns:
            raise KeyError(f"Missing required column '{col}' in yfinance payload for {asset.name}")

    df = clean_market_data(df[required_cols])
    
    # Save locally for reproducibility
    save_raw_dataset(df, asset.id)
    return df

def clean_market_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw market dataset:
    - Normalizes dates and timezones
    - Removes duplicate dates
    - Converts numeric columns safely
    - Filters invalid zero/negative prices
    - Sorts chronologically
    """
    df = df.copy()

    # Normalize Date format to YYYY-MM-DD
    df["Date"] = pd.to_datetime(df["Date"]).dt.tz_localize(None)
    df["Date_str"] = df["Date"].dt.strftime("%Y-%m-%d")

    # Drop duplicates by date
    df = df.drop_duplicates(subset=["Date_str"], keep="last")

    # Coerce numeric types
    for col in ["Open", "High", "Low", "Close", "Volume"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Handle missing / NaN values with forward fill then drop remaining
    df.ffill(inplace=True)
    df.bfill(inplace=True)
    df.dropna(subset=["Open", "High", "Low", "Close"], inplace=True)

    # Filter out zero or negative invalid prices
    df = df[(df["Open"] > 0) & (df["Close"] > 0)]

    # Sort strictly chronologically
    df.sort_values(by="Date", ascending=True, inplace=True)
    df.reset_index(drop=True, inplace=True)

    return df

def save_raw_dataset(df: pd.DataFrame, asset_id: str) -> Path:
    """Saves cleaned historical dataset as CSV in data/historical."""
    file_path = settings.DATA_DIR / f"{asset_id}_historical.csv"
    df.to_csv(file_path, index=False)
    return file_path

def load_local_dataset(asset_id: str) -> Optional[pd.DataFrame]:
    """Loads locally cached CSV dataset if available."""
    file_path = settings.DATA_DIR / f"{asset_id}_historical.csv"
    if file_path.exists():
        df = pd.read_csv(file_path)
        df["Date"] = pd.to_datetime(df["Date"])
        return df
    return None

def split_time_series_chronologically(
    df: pd.DataFrame, 
    train_ratio: float = 0.70, 
    val_ratio: float = 0.15
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Chronological time series splitting:
    - 70% Train
    - 15% Validation
    - 15% Test
    DOES NOT shuffle data to prevent data leakage.
    """
    n = len(df)
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))

    df_train = df.iloc[:train_end].copy()
    df_val = df.iloc[train_end:val_end].copy()
    df_test = df.iloc[val_end:].copy()

    return df_train, df_val, df_test
