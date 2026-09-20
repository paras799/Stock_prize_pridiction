import os
import numpy as np
from fastapi import APIRouter, HTTPException
from app.config import SAVED_MODELS_DIR
from app.data.data_loader import get_simple_dataset, load_raw_dataset
from app.models.simple_linear import SimpleLinearStockModel
from app.schemas.prediction import SinglePredictionInput, SinglePredictionOutput

router = APIRouter(prefix="/api/simple-linear", tags=["Simple Linear Regression"])

model_path = SAVED_MODELS_DIR / "simple_linear_model.pkl"
simple_model = SimpleLinearStockModel()
if os.path.exists(model_path):
    simple_model.load(str(model_path))

@router.get("/info")
def get_simple_linear_info():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Simple Linear Model file not found.")
    return simple_model.get_info()

@router.get("/metrics")
def get_simple_linear_metrics():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Simple Linear Model file not found.")
    X_train, X_test, y_train, y_test = get_simple_dataset()
    df_eval = load_raw_dataset().tail(60)
    metrics = simple_model.evaluate(X_train, y_train, X_test, y_test, df_eval)
    metrics["hyperparameters"] = simple_model.get_info()
    metrics["dataset"] = {
        "total_records": len(X_train) + len(X_test),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "split_ratio": "80% Train / 20% Test"
    }
    return metrics

@router.post("/predict", response_model=SinglePredictionOutput)
def predict_simple_linear(data: SinglePredictionInput):
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Simple Linear Model file not loaded.")
    
    X_new = np.array([[data.Open]])
    pred_val = float(simple_model.predict(X_new)[0])
    price_change = float(pred_val - data.Open)
    pct_change = float((price_change / data.Open) * 100) if data.Open != 0 else 0.0

    info = simple_model.get_info()

    return {
        "model_name": "Simple Linear Regression",
        "open_price": round(data.Open, 4),
        "predicted_close": round(pred_val, 4),
        "price_change": round(price_change, 4),
        "percentage_change": round(pct_change, 2),
        "details": {
            "formula": info.get("formula", ""),
            "slope": info.get("slope", 0.0),
            "intercept": info.get("intercept", 0.0)
        }
    }
