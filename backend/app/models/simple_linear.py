import numpy as np
import joblib
from typing import Dict, Any
from sklearn.linear_model import LinearRegression
from app.models.base_model import BaseModel

class SimpleLinearStockModel(BaseModel):
    def __init__(self):
        self.model = LinearRegression()

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        self.model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)

    def save(self, filepath: str) -> None:
        joblib.dump(self.model, filepath)

    def load(self, filepath: str) -> None:
        self.model = joblib.load(filepath)

    def get_info(self) -> Dict[str, Any]:
        slope = float(self.model.coef_[0]) if hasattr(self.model, 'coef_') else 0.0
        intercept = float(self.model.intercept_) if hasattr(self.model, 'intercept_') else 0.0
        return {
            "model_type": "Simple Linear Regression",
            "features_used": ["Open"],
            "target": "Close",
            "formula": f"Close = ({round(slope, 4)} * Open) + ({round(intercept, 4)})",
            "slope": round(slope, 6),
            "intercept": round(intercept, 6)
        }
