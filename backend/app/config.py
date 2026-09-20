import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
SAVED_MODELS_DIR = BASE_DIR / "saved_models"
SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Primary & Fallback Dataset Paths
PRIMARY_CSV_PATH = "D:/COLLEGE/SEM_5/ML/StockData/Stocks/gogl.us.txt"
FALLBACK_CSV_PATH = BASE_DIR / "data" / "gogl.us.txt"

def get_csv_path() -> str:
    if os.path.exists(PRIMARY_CSV_PATH):
        return PRIMARY_CSV_PATH
    elif os.path.exists(FALLBACK_CSV_PATH):
        return str(FALLBACK_CSV_PATH)
    else:
        raise FileNotFoundError("Stock data CSV file not found.")
