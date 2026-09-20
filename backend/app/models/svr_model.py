import numpy as np
import joblib
from typing import Dict, Any
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
from app.models.base_model import BaseModel

class SVRStockModel(BaseModel):
    def __init__(self, kernel: str = 'rbf', C: float = 100.0, gamma: float = 0.1, epsilon: float = 0.1):
        self.kernel = kernel
        self.C = C
        self.gamma = gamma
        self.epsilon = epsilon
        self.model = make_pipeline(StandardScaler(), SVR(kernel=kernel, C=C, gamma=gamma, epsilon=epsilon))

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        self.model.fit(X_train, y_train)

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.model.predict(X)

    def save(self, filepath: str) -> None:
        joblib.dump(self.model, filepath)

    def load(self, filepath: str) -> None:
        self.model = joblib.load(filepath)

    def get_info(self) -> Dict[str, Any]:
        scaler = self.model.named_steps['standardscaler']
        svr = self.model.named_steps['svr']
        return {
            "model_type": "Support Vector Regression (SVR)",
            "features_used": ["Open"],
            "target": "Close",
            "kernel": str(svr.kernel),
            "C": float(svr.C),
            "epsilon": float(svr.epsilon),
            "gamma": str(svr.gamma),
            "scaler_mean": float(round(scaler.mean_[0], 4)),
            "scaler_scale": float(round(scaler.scale_[0], 4))
        }
