import pandas as pd
import numpy as np
import os
from typing import Tuple, Dict, Any, List
from sklearn.model_selection import train_test_split
from app.config import get_csv_path

def load_raw_dataset() -> pd.DataFrame:
    csv_path = get_csv_path()
    df = pd.read_csv(csv_path)
    # Ensure numeric columns are cleanly converted
    for col in ['Open', 'High', 'Low', 'Close', 'Volume']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    df.dropna(subset=['Open', 'Close'], inplace=True)
    return df

def get_simple_dataset(random_state: int = 42) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Returns X_train, X_test, y_train, y_test for single-feature models (Open -> Close)."""
    df = load_raw_dataset()
    X = df[['Open']].values
    y = df['Close'].values
    return train_test_split(X, y, test_size=0.2, random_state=random_state)

def get_multiple_dataset(random_state: int = 42) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Returns X_train, X_test, y_train, y_test for multi-feature models (Open, High, Low, Volume -> Close)."""
    df = load_raw_dataset()
    # Handle Volume if present, fillna with 0 if missing
    if 'Volume' not in df.columns:
        df['Volume'] = 0
    else:
        df['Volume'] = df['Volume'].fillna(0)
    
    feature_cols = ['Open', 'High', 'Low', 'Volume']
    X = df[feature_cols].values
    y = df['Close'].values
    return train_test_split(X, y, test_size=0.2, random_state=random_state)

def get_recent_history(limit: int = 100) -> List[Dict[str, Any]]:
    """Returns recent historical records formatted for frontend stock charts."""
    df = load_raw_dataset()
    df_recent = df.tail(limit).copy()
    
    records = []
    for row in df_recent.itertuples():
        records.append({
            "Date": str(row.Date) if hasattr(row, 'Date') else f"Day {row.Index}",
            "Open": float(round(row.Open, 4)),
            "High": float(round(row.High, 4)) if hasattr(row, 'High') else float(round(row.Open, 4)),
            "Low": float(round(row.Low, 4)) if hasattr(row, 'Low') else float(round(row.Open, 4)),
            "Close": float(round(row.Close, 4)),
            "Volume": int(row.Volume) if hasattr(row, 'Volume') and not np.isnan(row.Volume) else 0
        })
    return records
