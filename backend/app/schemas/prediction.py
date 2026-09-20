from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SinglePredictionInput(BaseModel):
    Open: float = Field(..., description="Opening market price of the stock", gt=0)

class MultiplePredictionInput(BaseModel):
    Open: float = Field(..., description="Opening price of the stock", gt=0)
    High: float = Field(..., description="Highest price of the trading day", gt=0)
    Low: float = Field(..., description="Lowest price of the trading day", gt=0)
    Volume: float = Field(0.0, description="Total shares traded volume", ge=0)

class SinglePredictionOutput(BaseModel):
    model_name: str
    open_price: float
    predicted_close: float
    price_change: float
    percentage_change: float
    details: Optional[Dict[str, Any]] = None

class MultiplePredictionOutput(BaseModel):
    model_name: str
    open_price: float
    high_price: float
    low_price: float
    volume: float
    predicted_close: float
    price_change: float
    percentage_change: float
    details: Optional[Dict[str, Any]] = None

class ComparisonModelMetric(BaseModel):
    model_key: str
    model_name: str
    r2_test_percentage: float
    mae: float
    rmse: float
    mape: float
    features_used: List[str]

class ComparisonMetricsResponse(BaseModel):
    models: List[ComparisonModelMetric]
    best_model: str
