"""
Trainer Module
Orchestrates downloading historical asset data, preprocessing, chronological splitting,
model fitting, metric evaluation, artifact saving (Joblib), and metadata JSON generation.
"""

import json
from datetime import datetime, timezone
from typing import Dict, Any, List
import joblib
from app.assets.asset_config import get_asset_config
from app.core.config import settings
from app.ml.preprocessing import download_historical_data, split_time_series_chronologically
from app.ml.feature_engineering import extract_features, extract_target
from app.ml.model_factory import MODEL_KEYS, MODEL_METADATA, create_model_pipeline
from app.ml.evaluator import evaluate_model

def train_and_save_asset_models(asset_id: str, years: int = 7) -> Dict[str, Any]:
    """
    Trains all 6 ML models for the specified asset, evaluates chronologically,
    and persists artifacts into models/{asset_id}/latest/.
    """
    asset = get_asset_config(asset_id)
    print(f"==================================================")
    print(f" Training Models for Asset: {asset.name} ({asset.symbol_yfinance})")
    print(f"==================================================")

    # 1. Download & Clean Data
    df = download_historical_data(asset, years=years)
    print(f" -> Downloaded {len(df)} daily records from yfinance ({df['Date_str'].iloc[0]} to {df['Date_str'].iloc[-1]})")

    # 2. Chronological Split (70% Train, 15% Val, 15% Test)
    df_train, df_val, df_test = split_time_series_chronologically(df, train_ratio=0.70, val_ratio=0.15)
    print(f" -> Chronological Split: Train={len(df_train)}, Val={len(df_val)}, Test={len(df_test)}")

    # Create Asset Model Save Path
    asset_model_dir = settings.MODELS_DIR / asset_id / "latest"
    asset_model_dir.mkdir(parents=True, exist_ok=True)

    results: Dict[str, Any] = {}
    comparison_list: List[Dict[str, Any]] = []

    y_train = extract_target(df_train, "Close")
    y_test = extract_target(df_test, "Close")

    for model_key in MODEL_KEYS:
        meta = MODEL_METADATA[model_key]
        feature_names = meta["features"]
        
        # Extract features using identical pipeline logic
        X_train = extract_features(df_train, feature_names)
        X_test = extract_features(df_test, feature_names)

        # Build & Fit Sklearn Pipeline
        pipeline, _ = create_model_pipeline(model_key)
        pipeline.fit(X_train, y_train)

        # Save Pipeline Artifact via Joblib
        model_filename = f"{model_key}.pkl"
        model_path = asset_model_dir / model_filename
        joblib.dump(pipeline, model_path)

        # Evaluate Model Chronologically
        eval_res = evaluate_model(pipeline, X_train, y_train, X_test, y_test, df_test=df_test)

        metric_summary = {
            "model_key": model_key,
            "model_name": meta["name"],
            "description": meta["description"],
            "features_used": feature_names,
            "formula_display": meta["formula_display"],
            "r2": eval_res["r2"],
            "r2_percentage": eval_res["r2_percentage"],
            "mae": eval_res["mae"],
            "mse": eval_res["mse"],
            "rmse": eval_res["rmse"],
            "mape": eval_res["mape"],
            "test_samples": eval_res["test_samples"]
        }

        results[model_key] = metric_summary
        comparison_list.append(metric_summary)

        print(f" -> [{meta['name']}] Trained & Saved. Test R²: {eval_res['r2_percentage']}% | MAE: {eval_res['mae']} {asset.currency} | MAPE: {eval_res['mape']}%")

    # Determine Recommended Best Model (Strategy: Lowest MAE & RMSE with positive R2)
    valid_models = [m for m in comparison_list if m["r2"] > 0]
    if valid_models:
        best_model = min(valid_models, key=lambda m: (m["mae"], m["mape"]))
    else:
        best_model = max(comparison_list, key=lambda m: m["r2"])

    best_model_name = best_model["model_name"]
    best_model_key = best_model["model_key"]

    print(f"\n RECOMMENDED BEST MODEL for {asset.name}: {best_model_name} (Key: {best_model_key})")

    # Create Full Model Metadata JSON
    metadata_content = {
        "asset_id": asset.id,
        "asset_name": asset.name,
        "symbol_yfinance": asset.symbol_yfinance,
        "symbol_twelve_data": asset.symbol_twelve_data,
        "currency": asset.currency,
        "training_period": {
            "start_date": str(df["Date_str"].iloc[0]),
            "end_date": str(df["Date_str"].iloc[-1]),
            "total_records": len(df),
            "train_count": len(df_train),
            "test_count": len(df_test)
        },
        "recommended_best_model": best_model_key,
        "recommended_best_model_name": best_model_name,
        "selection_strategy": "Multi-metric optimization prioritizing lowest test set MAE & MAPE with positive R²",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "models": results
    }

    metadata_path = asset_model_dir / "metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata_content, f, indent=2)

    # Create Simplified Comparison JSON
    comparison_content = {
        "asset_id": asset.id,
        "asset_name": asset.name,
        "recommended_best_model": best_model_key,
        "recommended_best_model_name": best_model_name,
        "models": [
            {
                "model_key": m["model_key"],
                "model_name": m["model_name"],
                "r2_percentage": m["r2_percentage"],
                "mae": m["mae"],
                "rmse": m["rmse"],
                "mape": m["mape"],
                "features_used": m["features_used"]
            }
            for m in comparison_list
        ]
    }

    comparison_path = asset_model_dir / "comparison.json"
    with open(comparison_path, "w", encoding="utf-8") as f:
        json.dump(comparison_content, f, indent=2)

    return metadata_content
