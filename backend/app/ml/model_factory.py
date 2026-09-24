"""
Model Factory Module
Defines sklearn pipelines and metadata for all 6 regression algorithms.
"""

from typing import List, Tuple
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.pipeline import Pipeline, make_pipeline
from app.ml.feature_engineering import FEATURE_SET_SIMPLE, FEATURE_SET_MULTI

MODEL_KEYS = [
    "linear",
    "multiple_linear",
    "polynomial",
    "svr",
    "random_forest",
    "gradient_boosting"
]

MODEL_METADATA = {
    "linear": {
        "key": "linear",
        "name": "Simple Linear Regression",
        "description": "Basic single-variable linear relationship model predicting Close solely from Open price.",
        "features": FEATURE_SET_SIMPLE,
        "formula_display": "Close = b0 + b1(Open)"
    },
    "multiple_linear": {
        "key": "multiple_linear",
        "name": "Multiple Linear Regression",
        "description": "Multi-variable linear model incorporating Open, High, Low, and Volume.",
        "features": FEATURE_SET_MULTI,
        "formula_display": "Close = b0 + b1(Open) + b2(High) + b3(Low) + b4(Volume)"
    },
    "polynomial": {
        "key": "polynomial",
        "name": "Polynomial Regression (Degree 3)",
        "description": "Non-linear regression capturing curved price trends using degree 3 polynomial feature transformations.",
        "features": FEATURE_SET_MULTI,
        "formula_display": "Close = b0 + b1(X1) + b2(X1^2) + b3(X1^3) + ... + bn(Xn^3)"
    },
    "svr": {
        "key": "svr",
        "name": "Support Vector Regression (SVR - RBF)",
        "description": "Support Vector Machine using Radial Basis Function kernel and StandardScaler pipeline.",
        "features": FEATURE_SET_MULTI,
        "formula_display": "SVR(Kernel=RBF, C=100.0, epsilon=0.1)"
    },
    "random_forest": {
        "key": "random_forest",
        "name": "Random Forest Regressor",
        "description": "Ensemble decision tree regressor averaging predictions across 100 decision trees.",
        "features": FEATURE_SET_MULTI,
        "formula_display": "RandomForestRegressor(n_estimators=100, max_depth=10)"
    },
    "gradient_boosting": {
        "key": "gradient_boosting",
        "name": "Gradient Boosting Regressor",
        "description": "Sequential boosting ensemble building decision trees to minimize residual prediction errors.",
        "features": FEATURE_SET_MULTI,
        "formula_display": "GradientBoostingRegressor(n_estimators=100, lr=0.1, max_depth=5)"
    }
}

def create_model_pipeline(model_key: str) -> Tuple[Pipeline, List[str]]:
    """
    Creates un-fitted sklearn Pipeline instance and associated feature names list.
    """
    if model_key == "linear":
        pipeline = make_pipeline(LinearRegression())
        return pipeline, FEATURE_SET_SIMPLE

    elif model_key == "multiple_linear":
        pipeline = make_pipeline(LinearRegression())
        return pipeline, FEATURE_SET_MULTI

    elif model_key == "polynomial":
        pipeline = make_pipeline(
            PolynomialFeatures(degree=3, include_bias=False),
            StandardScaler(),
            LinearRegression()
        )
        return pipeline, FEATURE_SET_MULTI

    elif model_key == "svr":
        pipeline = make_pipeline(
            StandardScaler(),
            SVR(kernel="rbf", C=100.0, gamma="scale", epsilon=0.1)
        )
        return pipeline, FEATURE_SET_MULTI

    elif model_key == "random_forest":
        pipeline = make_pipeline(
            StandardScaler(),
            RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
        )
        return pipeline, FEATURE_SET_MULTI

    elif model_key == "gradient_boosting":
        pipeline = make_pipeline(
            StandardScaler(),
            GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
        )
        return pipeline, FEATURE_SET_MULTI

    else:
        raise ValueError(f"Unknown model_key '{model_key}'. Supported keys: {MODEL_KEYS}")
