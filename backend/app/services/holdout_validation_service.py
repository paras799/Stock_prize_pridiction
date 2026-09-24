"""
Holdout Validation Service Module
Dedicated flow for chronological time-series holdout evaluation (85% train / 15% test).
Loads trained model pipelines, runs inference across historical holdout observations,
computes test metrics (MAE, RMSE, R²), and returns structured Actual vs Predicted series for chart visualization.
"""

from typing import Dict, Any
import numpy as np
import pandas as pd
from app.assets.asset_config import get_asset_config
from app.core.config import settings
from app.ml.feature_engineering import extract_features
from app.ml.model_factory import MODEL_KEYS, MODEL_METADATA
from app.ml.preprocessing import load_local_dataset, download_historical_data, prepare_train_test_split
from app.ml.evaluator import calculate_metrics
from app.services.model_service import load_trained_model_pipeline, get_asset_metadata

# In-memory cache for holdout validation results: key -> (asset_id, model_key)
_HOLDOUT_CACHE: Dict[str, Dict[str, Any]] = {}

def get_holdout_validation_data(asset_id: str, model_key: str = "svr") -> Dict[str, Any]:
    """
    Executes dedicated holdout validation on out-of-sample historical test dataset.
    Returns clean Actual vs Predicted time-series data and evaluation metrics.
    """
    asset = get_asset_config(asset_id)
    if model_key not in MODEL_KEYS:
        model_key = "svr"

    cache_key = f"{asset.id}_{model_key}"
    if cache_key in _HOLDOUT_CACHE:
        return _HOLDOUT_CACHE[cache_key]

    meta = MODEL_METADATA[model_key]
    feature_names = meta["features"]

    # Load dataset
    df = load_local_dataset(asset.id)
    if df is None:
        df = download_historical_data(asset, years=7)

    # Perform strict chronological 85% train / 15% holdout test split (NO data leakage)
    df_train, df_test = prepare_train_test_split(df, test_ratio=0.15)

    # Extract test feature matrix and target actuals
    X_test = extract_features(df_test, feature_names)
    y_test = df_test["Close"].to_numpy(dtype=float)
    dates_test = df_test["Date_str"].tolist() if "Date_str" in df_test.columns else [str(d)[:10] for d in df_test["Date"]]

    # Load trained model pipeline artifact
    pipeline = load_trained_model_pipeline(asset.id, model_key)

    # Predict Close price for EACH holdout test observation
    y_pred_test = pipeline.predict(X_test)
    y_pred_test = np.array(y_pred_test, dtype=float)

    # Calculate validation metrics on holdout test set
    metrics = calculate_metrics(y_test, y_pred_test)

    # Construct chronological Actual vs Predicted data points
    data_points = []
    for i in range(len(y_test)):
        actual = float(round(y_test[i], 4))
        predicted = float(round(y_pred_test[i], 4))
        error = float(round(abs(actual - predicted), 4))
        error_percent = float(round((error / actual * 100) if actual != 0 else 0.0, 2))

        data_points.append({
            "date": str(dates_test[i]),
            "actual": actual,
            "predicted": predicted,
            "error": error,
            "error_percent": error_percent
        })

    result = {
        "asset_id": asset.id,
        "asset_name": asset.name,
        "symbol": asset.symbol_twelve_data,
        "currency": asset.currency,
        "model_key": model_key,
        "model_name": meta["name"],
        "validation_period": {
            "start": data_points[0]["date"] if data_points else "",
            "end": data_points[-1]["date"] if data_points else "",
            "sample_count": len(data_points)
        },
        "data": data_points,
        "metrics": metrics
    }

    _HOLDOUT_CACHE[cache_key] = result
    return result
