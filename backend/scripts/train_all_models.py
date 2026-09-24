"""
Master Training Command
Trains all 6 machine learning algorithms for Reliance, Bitcoin, and Google.
Saves models, pipelines, metrics, and comparison files.
Usage: python scripts/train_all_models.py
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.assets.asset_config import list_all_assets
from app.ml.trainer import train_and_save_asset_models

def main():
    print("==================================================")
    print(" REAL-TIME MULTI-ASSET PRICE PREDICTION SUITE")
    print(" Automated Model Training & Artifact Generation")
    print("==================================================")
    
    assets = list_all_assets()
    for asset in assets:
        try:
            train_and_save_asset_models(asset.id, years=7)
        except Exception as e:
            print(f" ERROR training models for {asset.name}: {e}")
            import traceback
            traceback.print_exc()

    print("\n==================================================")
    print(" [SUCCESS] All asset models trained and persisted!")
    print("==================================================")

if __name__ == "__main__":
    main()
