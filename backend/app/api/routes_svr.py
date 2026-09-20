import os
import numpy as np
from fastapi import APIRouter, HTTPException
from app.config import SAVED_MODELS_DIR
from app.data.data_loader import get_simple_dataset, load_raw_dataset
from app.models.svr_model import SVRStockModel
from app.schemas.prediction import SinglePredictionInput, SinglePredictionOutput

router = APIRouter(prefix="/api/svr", tags=["Support Vector Regression"])

# Load model instance
model_path = SAVED_MODELS_DIR / "svr_model.pkl"
svr_model = SVRStockModel()
if os.path.exists(model_path):
    svr_model.load(str(model_path))

@router.get("/info")
def get_svr_info():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="SVR Model file not found.")
    return svr_model.get_info()

@router.get("/metrics")
def get_svr_metrics():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="SVR Model file not found.")
    X_train, X_test, y_train, y_test = get_simple_dataset()
    df_eval = load_raw_dataset().tail(60)
    metrics = svr_model.evaluate(X_train, y_train, X_test, y_test, df_eval)
    metrics["hyperparameters"] = svr_model.get_info()
    metrics["dataset"] = {
        "total_records": len(X_train) + len(X_test),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "split_ratio": "80% Train / 20% Test"
    }
    return metrics

@router.post("/predict", response_model=SinglePredictionOutput)
def predict_svr(data: SinglePredictionInput):
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="SVR Model file not loaded.")
    
    X_new = np.array([[data.Open]])
    pred_val = float(svr_model.predict(X_new)[0])
    price_change = float(pred_val - data.Open)
    pct_change = float((price_change / data.Open) * 100) if data.Open != 0 else 0.0

    info = svr_model.get_info()
    scaler_mean = info.get("scaler_mean", 0.0)
    scaler_scale = info.get("scaler_scale", 1.0)
    scaled_open = float((data.Open - scaler_mean) / scaler_scale) if scaler_scale != 0 else 0.0

    return {
        "model_name": "Support Vector Regression (SVR)",
        "open_price": round(data.Open, 4),
        "predicted_close": round(pred_val, 4),
        "price_change": round(price_change, 4),
        "percentage_change": round(pct_change, 2),
        "details": {
            "scaled_open": round(scaled_open, 4),
            "scaler_mean": round(scaler_mean, 4),
            "scaler_scale": round(scaler_scale, 4),
            "kernel": info.get("kernel", "rbf"),
            "C": info.get("C", 100.0)
        }
    }
