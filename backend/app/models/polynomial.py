import numpy as np
import joblib
from typing import Dict, Any
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from app.models.base_model import BaseModel

class PolynomialStockModel(BaseModel):
    def __init__(self, degree: int = 2):
        self.degree = degree
        self.model = make_pipeline(PolynomialFeatures(degree=degree), LinearRegression())

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        self.model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)

    def save(self, filepath: str) -> None:
        joblib.dump(self.model, filepath)

    def load(self, filepath: str) -> None:
        self.model = joblib.load(filepath)

    def get_info(self) -> Dict[str, Any]:
        poly = self.model.named_steps['polynomialfeatures']
        lin_reg = self.model.named_steps['linearregression']
        
        coefs = [float(c) for c in lin_reg.coef_]
        intercept = float(lin_reg.intercept_)
        
        terms = []
        for d, coef in enumerate(coefs):
            if d == 0:
                continue # Intercept handled separately
            elif d == 1:
                terms.append(f"({round(coef, 4)} * Open)")
            else:
                terms.append(f"({round(coef, 4)} * Open^{d})")
                
        formula = f"Close = {' + '.join(terms)} + ({round(intercept, 4)})"
        
        return {
            "model_type": f"Polynomial Regression (Degree {self.degree})",
            "features_used": ["Open"],
            "target": "Close",
            "degree": self.degree,
            "formula": formula,
            "coefficients": [round(c, 6) for c in coefs],
            "intercept": round(intercept, 6)
        }
