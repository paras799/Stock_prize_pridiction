"""
Model Evaluator Module
Standardized metrics calculator for financial time-series regression models.
Computes R², MAE, MSE, RMSE, and MAPE metrics on train/test datasets.
"""

from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Calculates fundamental regression metrics: R², MAE, MSE, RMSE, MAPE.
    """
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)

    r2 = float(r2_score(y_true, y_pred))
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))

    # MAPE calculation with zero-division safeguard
    non_zero_mask = y_true != 0
    if np.any(non_zero_mask):
        mape = float(np.mean(np.abs((y_true[non_zero_mask] - y_pred[non_zero_mask]) / y_true[non_zero_mask])) * 100)
    else:
        mape = 0.0

    return {
        "r2": round(r2, 4),
        "r2_percentage": round(r2 * 100, 2),
        "mae": round(mae, 4),
        "mse": round(mse, 4),
        "rmse": round(rmse, 4),
        "mape": round(mape, 2)
    }

def evaluate_model(
    model: Any, 
    X_train: np.ndarray, 
    y_train: np.ndarray, 
    X_test: np.ndarray, 
    y_test: np.ndarray, 
    df_test: Optional[pd.DataFrame] = None
) -> Dict[str, Any]:
    """
    Evaluates model on train and test datasets, and generates sample actual vs predicted points.
    """
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_metrics = calculate_metrics(y_train, y_pred_train)
    test_metrics = calculate_metrics(y_test, y_pred_test)

    # Comparison samples for actual vs predicted visualization
    samples: List[Dict[str, Any]] = []
    if df_test is not None:
        dates = df_test["Date_str"].tolist() if "Date_str" in df_test.columns else [f"Index {i}" for i in range(len(df_test))]
        opens = df_test["Open"].tolist() if "Open" in df_test.columns else [0.0] * len(df_test)
        
        # Take up to last 100 test points for clean chart display
        num_points = min(100, len(y_test))
        start_idx = len(y_test) - num_points

        for i in range(start_idx, len(y_test)):
            actual = float(y_test[i])
            pred = float(round(y_pred_test[i], 4))
            samples.append({
                "date": str(dates[i]),
                "open": float(round(opens[i], 4)),
                "actualClose": float(round(actual, 4)),
                "predictedClose": pred,
                "error": float(round(abs(actual - pred), 4))
            })

    return {
        "train_metrics": train_metrics,
        "test_metrics": test_metrics,
        "r2": test_metrics["r2"],
        "r2_percentage": test_metrics["r2_percentage"],
        "mae": test_metrics["mae"],
        "mse": test_metrics["mse"],
        "rmse": test_metrics["rmse"],
        "mape": test_metrics["mape"],
        "test_samples": samples
    }
