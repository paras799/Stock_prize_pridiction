from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.data.data_loader import get_recent_history
from app.api.routes_svr import router as svr_router, get_svr_info, get_svr_metrics, predict_svr
from app.api.routes_simple_linear import router as simple_router
from app.api.routes_multiple_linear import router as multi_router
from app.api.routes_polynomial import router as poly_router
from app.api.routes_comparison import router as comp_router
from app.schemas.prediction import SinglePredictionInput

app = FastAPI(
    title="Stock Close Price Prediction API",
    description="Multi-model machine learning regression suite featuring SVR, Simple Linear, Multiple Linear, and Polynomial Regression.",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include structured routers
app.include_router(svr_router)
app.include_router(simple_router)
app.include_router(multi_router)
app.include_router(poly_router)
app.include_router(comp_router)

# Shared historical data route
@app.get("/historical-data")
def get_historical_stock_data(limit: int = 100):
    try:
        return get_recent_history(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Legacy backward-compatibility endpoints (forwarding directly to SVR)
@app.get("/model-info")
def legacy_model_info():
    return get_svr_info()

@app.get("/model-metrics")
def legacy_model_metrics():
    return get_svr_metrics()

@app.post("/predict")
def legacy_predict(data: SinglePredictionInput):
    return predict_svr(data)

@app.get("/")
def api_root():
    return {
        "status": "online",
        "message": "Stock Close Price Multi-Model API Service is running.",
        "endpoints": {
            "SVR Model": "/api/svr/predict",
            "Simple Linear": "/api/simple-linear/predict",
            "Multiple Linear": "/api/multiple-linear/predict",
            "Polynomial": "/api/polynomial/predict",
            "Comparison": "/api/comparison/metrics",
            "Historical Data": "/historical-data"
        }
    }
