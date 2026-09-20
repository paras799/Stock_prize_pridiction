import numpy as np
import joblib
from typing import Dict, Any
from sklearn.linear_model import LinearRegression
from app.models.base_model import BaseModel

class MultipleLinearStockModel(BaseModel):
    def __init__(self):
        self.model = LinearRegression()
        self.feature_names = ["Open", "High", "Low", "Volume"]

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        self.model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)

    def save(self, filepath: str) -> None:
        joblib.dump(self.model, filepath)

    def load(self, filepath: str) -> None:
        self.model = joblib.load(filepath)

    def get_info(self) -> Dict[str, Any]:
        coefs = [float(c) for c in self.model.coef_] if hasattr(self.model, 'coef_') else [0.0] * len(self.feature_names)
        intercept = float(self.model.intercept_) if hasattr(self.model, 'intercept_') else 0.0
        
        coefficients_dict = {name: round(coef, 6) for name, coef in zip(self.feature_names, coefs)}
        formula_terms = [f"({round(coef, 4)} * {name})" for name, coef in zip(self.feature_names, coefs)]
        formula = f"Close = {' + '.join(formula_terms)} + ({round(intercept, 4)})"
        
        return {
            "model_type": "Multiple Linear Regression",
            "features_used": self.feature_names,
            "target": "Close",
            "formula": formula,
            "coefficients": coefficients_dict,
            "intercept": round(intercept, 6)
        }
