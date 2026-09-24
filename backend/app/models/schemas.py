"""
Pydantic Schemas for API Requests & Responses
Enforces strict contracts and type safety across FastAPI endpoints.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class AssetInfoResponse(BaseModel):
    id: str
    name: str
    symbol_yfinance: str
    symbol_twelve_data: str
    asset_type: str
    currency: str
    exchange: Optional[str]
    description: str

class MarketDataResponse(BaseModel):
    asset_id: str
    asset_name: str
    symbol: str
    currency: str
    timestamp: str
    open: float
    high: float
    low: float
    volume: float
    source: str
    is_delayed: bool

class SingleModelPrediction(BaseModel):
    model_key: str
    model_name: str
    features_used: List[str]
    predicted_close: float
    open_price: float
    diff_from_open: float
    percentage_diff: float

class PredictionResponse(BaseModel):
    asset_id: str
    asset_name: str
    symbol: str
    currency: str
    timestamp: str
    market_data: MarketDataResponse
    recommended_best_model: str
    recommended_best_model_name: str
    predictions: Dict[str, SingleModelPrediction]

class CustomPredictionRequest(BaseModel):
    asset_id: str
    Open: float = Field(..., gt=0, description="Opening price of the stock/crypto asset")
    High: Optional[float] = Field(None, description="Daily high price")
    Low: Optional[float] = Field(None, description="Daily low price")
    Volume: Optional[float] = Field(0.0, description="Trading volume")

class ModelMetricDetail(BaseModel):
    model_key: str
    model_name: str
    r2_percentage: float
    mae: float
    rmse: float
    mape: float
    features_used: List[str]

class AssetComparisonResponse(BaseModel):
    asset_id: str
    asset_name: str
    recommended_best_model: str
    recommended_best_model_name: str
    models: List[ModelMetricDetail]

class HoldoutSamplePoint(BaseModel):
    date: str
    actual: float
    predicted: float
    error: float
    error_percent: float

class ValidationPeriodInfo(BaseModel):
    start: str
    end: str
    sample_count: int

class ValidationMetricsInfo(BaseModel):
    r2: float
    r2_percentage: float
    mae: float
    mse: float
    rmse: float
    mape: float

class HoldoutValidationResponse(BaseModel):
    asset_id: str
    asset_name: str
    symbol: str
    currency: str
    model_key: str
    model_name: str
    validation_period: ValidationPeriodInfo
    data: List[HoldoutSamplePoint]
    metrics: ValidationMetricsInfo
