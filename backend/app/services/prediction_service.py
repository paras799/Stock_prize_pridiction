"""
Prediction Service Module
Extracts real-time market features, invokes trained model pipelines,
computes price differences from Open, and constructs structured prediction contracts.
"""

from typing import Dict, Any, Optional
from app.assets.asset_config import get_asset_config
from app.ml.feature_engineering import extract_features
from app.ml.model_factory import MODEL_KEYS, MODEL_METADATA
from app.services.market_data_service import get_latest_market_data
from app.services.model_service import load_trained_model_pipeline, get_asset_metadata

def generate_multi_model_predictions(
    asset_id: str, 
    custom_market_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Fetches market data (or accepts user input), runs feature extraction,
    and returns predictions from ALL 6 models.
    """
    asset = get_asset_config(asset_id)
    metadata = get_asset_metadata(asset_id)

    # Use provided custom values or fetch real-time market data
    if custom_market_data:
        m_data = {
            "asset_id": asset.id,
            "asset_name": asset.name,
            "symbol": asset.symbol_twelve_data,
            "currency": asset.currency,
            "timestamp": custom_market_data.get("timestamp", "Custom Input"),
            "open": float(custom_market_data["Open"]),
            "high": float(custom_market_data.get("High", custom_market_data["Open"])),
            "low": float(custom_market_data.get("Low", custom_market_data["Open"])),
            "volume": float(custom_market_data.get("Volume", 0.0)),
            "source": "Custom Input",
            "is_delayed": False
        }
    else:
        m_data = get_latest_market_data(asset)

    open_price = m_data["open"]
    input_dict = {
        "Open": m_data["open"],
        "High": m_data["high"],
        "Low": m_data["low"],
        "Volume": m_data["volume"]
    }

    predictions_dict: Dict[str, Any] = {}

    for model_key in MODEL_KEYS:
        meta = MODEL_METADATA[model_key]
        feature_names = meta["features"]
        
        # Unified feature extraction
        X_input = extract_features(input_dict, feature_names)

        # Load trained sklearn pipeline artifact
        pipeline = load_trained_model_pipeline(asset.id, model_key)
        
        # Predict Close price
        pred_array = pipeline.predict(X_input)
        predicted_close = float(round(pred_array[0], 4))

        diff = round(predicted_close - open_price, 4)
        pct_diff = round((diff / open_price * 100) if open_price != 0 else 0.0, 2)

        predictions_dict[model_key] = {
            "model_key": model_key,
            "model_name": meta["name"],
            "features_used": feature_names,
            "predicted_close": predicted_close,
            "open_price": open_price,
            "diff_from_open": diff,
            "percentage_diff": pct_diff
        }

    return {
        "asset_id": asset.id,
        "asset_name": asset.name,
        "symbol": asset.symbol_twelve_data,
        "currency": asset.currency,
        "timestamp": m_data["timestamp"],
        "market_data": m_data,
        "recommended_best_model": metadata.get("recommended_best_model", "svr"),
        "recommended_best_model_name": metadata.get("recommended_best_model_name", "Support Vector Regression"),
        "predictions": predictions_dict
    }
