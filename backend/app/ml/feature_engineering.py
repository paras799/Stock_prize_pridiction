"""
Feature Engineering Module
Unified feature creation pipeline used identically during model training and real-time prediction.
"""

from typing import List, Dict, Any, Tuple, Union
import pandas as pd
import numpy as np

# Defined Feature Sets for Models
FEATURE_SET_SIMPLE = ["Open"]
FEATURE_SET_MULTI = ["Open", "High", "Low", "Volume"]

def prepare_feature_dataframe(data: Union[pd.DataFrame, Dict[str, Any], List[Dict[str, Any]]]) -> pd.DataFrame:
    """
    Standardizes input (DataFrame, single dict, or list of dicts) into a clean pandas DataFrame.
    """
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, list):
        df = pd.DataFrame(data)
    elif isinstance(data, pd.DataFrame):
        df = data.copy()
    else:
        raise TypeError(f"Unsupported data type for feature extraction: {type(data)}")

    # Ensure essential columns exist and are numeric
    cols = ["Open", "High", "Low", "Volume"]
    for col in cols:
        if col not in df.columns:
            if col == "Volume":
                df[col] = 0.0
            elif col in ["High", "Low"] and "Open" in df.columns:
                df[col] = df["Open"]
            else:
                df[col] = 0.0
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    return df

def extract_features(
    data: Union[pd.DataFrame, Dict[str, Any]], 
    feature_names: List[str]
) -> np.ndarray:
    """
    Extracts specific feature matrix (X) matching feature_names from dataframe or single dictionary input.
    Guarantees feature ordering and structure compatibility between training & prediction.
    """
    df = prepare_feature_dataframe(data)

    # Check that requested feature names exist
    for f in feature_names:
        if f not in df.columns:
            raise KeyError(f"Feature '{f}' requested by model not found in dataset columns: {list(df.columns)}")

    X = df[feature_names].values
    return X

def extract_target(df: pd.DataFrame, target_col: str = "Close") -> np.ndarray:
    """Extracts target vector y."""
    if target_col not in df.columns:
        raise KeyError(f"Target column '{target_col}' not found in DataFrame.")
    return df[target_col].values
