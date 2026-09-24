"""
Standalone script to download and cache historical dataset for all assets.
Usage: python scripts/download_data.py
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.assets.asset_config import list_all_assets
from app.ml.preprocessing import download_historical_data

def main():
    print("==========================================")
    print(" Downloading Historical Data for All Assets")
    print("==========================================")
    assets = list_all_assets()
    for asset in assets:
        print(f"\nFetching {asset.name} ({asset.symbol_yfinance})...")
        df = download_historical_data(asset, years=7)
        print(f" -> Downloaded {len(df)} rows. Saved to data/historical/{asset.id}_historical.csv")
    print("\n[SUCCESS] Historical data collection complete!")

if __name__ == "__main__":
    main()
