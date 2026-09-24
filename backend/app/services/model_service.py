"""
Model Service Module
Handles loading saved joblib model pipelines and retrieving stored evaluation metadata.
"""

import json
from pathlib import Path
from typing import Dict, Any, Tuple
import joblib
from app.assets.asset_config import get_asset_config
from app.core.config import settings
from app.ml.model_factory import MODEL_KEYS

_LOADED_MODELS_CACHE: Dict[str, Any] = {}

def get_asset_model_dir(asset_id: str) -> Path:
    asset = get_asset_config(asset_id)
    path = settings.MODELS_DIR / asset.id / "latest"
    if not path.exists():
        raise FileNotFoundError(f"Trained models directory for asset '{asset_id}' does not exist at {path}. Please run training script first.")
    return path

def load_trained_model_pipeline(asset_id: str, model_key: str):
    """
    Loads saved Joblib sklearn pipeline artifact for a given asset and model key.
    """
    cache_key = f"{asset_id}_{model_key}"
    if cache_key in _LOADED_MODELS_CACHE:
        return _LOADED_MODELS_CACHE[cache_key]

    model_dir = get_asset_model_dir(asset_id)
    model_file = model_dir / f"{model_key}.pkl"
    
    if not model_file.exists():
        raise FileNotFoundError(f"Model artifact '{model_key}.pkl' not found for asset '{asset_id}' at {model_file}")

    pipeline = joblib.load(model_file)
    _LOADED_MODELS_CACHE[cache_key] = pipeline
    return pipeline

def get_asset_metadata(asset_id: str) -> Dict[str, Any]:
    """Retrieves metadata.json for an asset."""
    model_dir = get_asset_model_dir(asset_id)
    meta_file = model_dir / "metadata.json"
    if not meta_file.exists():
        raise FileNotFoundError(f"Metadata file for asset '{asset_id}' missing at {meta_file}")
    
    with open(meta_file, "r", encoding="utf-8") as f:
        return json.load(f)

def get_asset_comparison(asset_id: str) -> Dict[str, Any]:
    """Retrieves comparison.json for an asset."""
    model_dir = get_asset_model_dir(asset_id)
    comp_file = model_dir / "comparison.json"
    if not comp_file.exists():
        raise FileNotFoundError(f"Comparison file for asset '{asset_id}' missing at {comp_file}")
    
    with open(comp_file, "r", encoding="utf-8") as f:
        return json.load(f)
