import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
SAVED_MODELS_DIR = BASE_DIR / "saved_models"
SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Dataset Path inside backend repository (backend/app/data/gogl.us.txt)
DATASET_PATH = BASE_DIR / "app" / "data" / "gogl.us.txt"

def get_csv_path() -> str:
    if os.path.exists(DATASET_PATH):
        return str(DATASET_PATH)
    else:
        raise FileNotFoundError(f"Stock dataset not found at {DATASET_PATH}")
