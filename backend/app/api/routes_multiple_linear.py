import os
import numpy as np
from fastapi import APIRouter, HTTPException
from app.config import SAVED_MODELS_DIR
from app.data.data_loader import get_multiple_dataset, load_raw_dataset
from app.models.multiple_linear import MultipleLinearStockModel
from app.schemas.prediction import MultiplePredictionInput, MultiplePredictionOutput

router = APIRouter(prefix="/api/multiple-linear", tags=["Multiple Linear Regression"])

model_path = SAVED_MODELS_DIR / "multiple_linear_model.pkl"
multi_model = MultipleLinearStockModel()
if os.path.exists(model_path):
    multi_model.load(str(model_path))

@router.get("/info")
def get_multiple_linear_info():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Multiple Linear Model file not found.")
    return multi_model.get_info()

@router.get("/metrics")
def get_multiple_linear_metrics():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Multiple Linear Model file not found.")
    X_train, X_test, y_train, y_test = get_multiple_dataset()
    df_eval = load_raw_dataset().tail(60)
    metrics = multi_model.evaluate(X_train, y_train, X_test, y_test, df_eval)
    metrics["hyperparameters"] = multi_model.get_info()
    metrics["dataset"] = {
        "total_records": len(X_train) + len(X_test),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "split_ratio": "80% Train / 20% Test"
    }
    return metrics

@router.post("/predict", response_model=MultiplePredictionOutput)
def predict_multiple_linear(data: MultiplePredictionInput):
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Multiple Linear Model file not loaded.")
    
    X_new = np.array([[data.Open, data.High, data.Low, data.Volume]])
    pred_val = float(multi_model.predict(X_new)[0])
    price_change = float(pred_val - data.Open)
    pct_change = float((price_change / data.Open) * 100) if data.Open != 0 else 0.0

    info = multi_model.get_info()

    return {
        "model_name": "Multiple Linear Regression",
        "open_price": round(data.Open, 4),
        "high_price": round(data.High, 4),
        "low_price": round(data.Low, 4),
        "volume": round(data.Volume, 2),
        "predicted_close": round(pred_val, 4),
        "price_change": round(price_change, 4),
        "percentage_change": round(pct_change, 2),
        "details": {
            "formula": info.get("formula", ""),
            "coefficients": info.get("coefficients", {}),
            "intercept": info.get("intercept", 0.0)
        }
    }
