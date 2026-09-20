import os
import numpy as np
from fastapi import APIRouter, HTTPException
from app.config import SAVED_MODELS_DIR
from app.data.data_loader import get_simple_dataset, load_raw_dataset
from app.models.polynomial import PolynomialStockModel
from app.schemas.prediction import SinglePredictionInput, SinglePredictionOutput

router = APIRouter(prefix="/api/polynomial", tags=["Polynomial Regression"])

model_path = SAVED_MODELS_DIR / "polynomial_model.pkl"
poly_model = PolynomialStockModel(degree=2)
if os.path.exists(model_path):
    poly_model.load(str(model_path))

@router.get("/info")
def get_polynomial_info():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Polynomial Model file not found.")
    return poly_model.get_info()

@router.get("/metrics")
def get_polynomial_metrics():
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Polynomial Model file not found.")
    X_train, X_test, y_train, y_test = get_simple_dataset()
    df_eval = load_raw_dataset().tail(60)
    metrics = poly_model.evaluate(X_train, y_train, X_test, y_test, df_eval)
    metrics["hyperparameters"] = poly_model.get_info()
    metrics["dataset"] = {
        "total_records": len(X_train) + len(X_test),
        "train_records": len(X_train),
        "test_records": len(X_test),
        "split_ratio": "80% Train / 20% Test"
    }
    return metrics

@router.post("/predict", response_model=SinglePredictionOutput)
def predict_polynomial(data: SinglePredictionInput):
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Polynomial Model file not loaded.")
    
    X_new = np.array([[data.Open]])
    pred_val = float(poly_model.predict(X_new)[0])
    price_change = float(pred_val - data.Open)
    pct_change = float((price_change / data.Open) * 100) if data.Open != 0 else 0.0

    info = poly_model.get_info()

    return {
        "model_name": f"Polynomial Regression (Degree {info.get('degree', 2)})",
        "open_price": round(data.Open, 4),
        "predicted_close": round(pred_val, 4),
        "price_change": round(price_change, 4),
        "percentage_change": round(pct_change, 2),
        "details": {
            "degree": info.get("degree", 2),
            "formula": info.get("formula", ""),
            "coefficients": info.get("coefficients", []),
            "intercept": info.get("intercept", 0.0)
        }
    }
