import numpy as np
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

class BaseModel(ABC):
    """Abstract Base Class for all Stock Close Price Prediction Models."""
    
    @abstractmethod
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        pass

    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        pass

    @abstractmethod
    def save(self, filepath: str) -> None:
        pass

    @abstractmethod
    def load(self, filepath: str) -> None:
        pass

    @abstractmethod
    def get_info(self) -> Dict[str, Any]:
        pass

    def evaluate(self, X_train: np.ndarray, y_train: np.ndarray, X_test: np.ndarray, y_test: np.ndarray, df_eval: Any = None) -> Dict[str, Any]:
        """Common evaluation metric calculator for regression models."""
        y_pred_train = self.predict(X_train)
        y_pred_test = self.predict(X_test)

        r2_train = float(r2_score(y_train, y_pred_train))
        r2_test = float(r2_score(y_test, y_pred_test))
        mae = float(mean_absolute_error(y_test, y_pred_test))
        mse = float(mean_squared_error(y_test, y_pred_test))
        rmse = float(np.sqrt(mse))
        
        # Avoid zero division in MAPE
        non_zero_mask = y_test != 0
        mape = float(np.mean(np.abs((y_test[non_zero_mask] - y_pred_test[non_zero_mask]) / y_test[non_zero_mask])) * 100)

        comparison_samples: List[Dict[str, Any]] = []
        if df_eval is not None and hasattr(df_eval, 'itertuples'):
            # Predict for evaluation dataframe based on model's feature set
            info = self.get_info()
            needed_features = info.get("features_used", ["Open"])
            X_eval = df_eval[needed_features].values
            preds_eval = self.predict(X_eval)
            
            for i, row in enumerate(df_eval.itertuples()):
                actual = float(row.Close)
                pred = float(round(preds_eval[i], 4))
                comparison_samples.append({
                    "date": str(row.Date) if hasattr(row, 'Date') else f"Day {i}",
                    "open": float(row.Open),
                    "actualClose": actual,
                    "predictedClose": pred,
                    "error": float(round(abs(actual - pred), 4))
                })

        return {
            "status": "success",
            "r2_train": round(r2_train, 4),
            "r2_test": round(r2_test, 4),
            "r2_test_percentage": round(r2_test * 100, 2),
            "mae": round(mae, 4),
            "mse": round(mse, 4),
            "rmse": round(rmse, 4),
            "mape": round(mape, 2),
            "comparison_samples": comparison_samples
        }
