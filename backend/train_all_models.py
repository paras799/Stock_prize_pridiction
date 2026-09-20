import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.config import SAVED_MODELS_DIR
from app.data.data_loader import get_simple_dataset, get_multiple_dataset, load_raw_dataset
from app.models.svr_model import SVRStockModel
from app.models.simple_linear import SimpleLinearStockModel
from app.models.multiple_linear import MultipleLinearStockModel
from app.models.polynomial import PolynomialStockModel

def train_all():
    print("==========================================")
    print("Training Stock Close Price Regression Suite")
    print("==========================================")
    
    # 1. Load Data
    X_train_simple, X_test_simple, y_train_simple, y_test_simple = get_simple_dataset()
    X_train_multi, X_test_multi, y_train_multi, y_test_multi = get_multiple_dataset()
    df_eval = load_raw_dataset().tail(60)

    # 2. Train SVR Model
    print("\n[1/4] Training SVR Model (RBF Kernel)...")
    svr_model = SVRStockModel(kernel='rbf', C=100.0, gamma=0.1, epsilon=0.1)
    svr_model.train(X_train_simple, y_train_simple)
    svr_path = SAVED_MODELS_DIR / "svr_model.pkl"
    svr_model.save(str(svr_path))
    # Also save to root backend directory for legacy backward compatibility
    svr_model.save(str(backend_dir / "svr_model.pkl"))
    svr_metrics = svr_model.evaluate(X_train_simple, y_train_simple, X_test_simple, y_test_simple, df_eval)
    print(f" -> SVR Trained. R² Test Score: {svr_metrics['r2_test_percentage']}% | MAE: ${svr_metrics['mae']}")

    # 3. Train Simple Linear Regression
    print("\n[2/4] Training Simple Linear Regression...")
    simple_model = SimpleLinearStockModel()
    simple_model.train(X_train_simple, y_train_simple)
    simple_path = SAVED_MODELS_DIR / "simple_linear_model.pkl"
    simple_model.save(str(simple_path))
    simple_metrics = simple_model.evaluate(X_train_simple, y_train_simple, X_test_simple, y_test_simple, df_eval)
    print(f" -> Simple Linear Trained. R² Test Score: {simple_metrics['r2_test_percentage']}% | MAE: ${simple_metrics['mae']}")

    # 4. Train Multiple Linear Regression
    print("\n[3/4] Training Multiple Linear Regression (Open, High, Low, Volume)...")
    multi_model = MultipleLinearStockModel()
    multi_model.train(X_train_multi, y_train_multi)
    multi_path = SAVED_MODELS_DIR / "multiple_linear_model.pkl"
    multi_model.save(str(multi_path))
    multi_metrics = multi_model.evaluate(X_train_multi, y_train_multi, X_test_multi, y_test_multi, df_eval)
    print(f" -> Multiple Linear Trained. R² Test Score: {multi_metrics['r2_test_percentage']}% | MAE: ${multi_metrics['mae']}")

    # 5. Train Polynomial Regression (Degree 2)
    print("\n[4/4] Training Polynomial Regression (Degree 2)...")
    poly_model = PolynomialStockModel(degree=2)
    poly_model.train(X_train_simple, y_train_simple)
    poly_path = SAVED_MODELS_DIR / "polynomial_model.pkl"
    poly_model.save(str(poly_path))
    poly_metrics = poly_model.evaluate(X_train_simple, y_train_simple, X_test_simple, y_test_simple, df_eval)
    print(f" -> Polynomial Trained. R² Test Score: {poly_metrics['r2_test_percentage']}% | MAE: ${poly_metrics['mae']}")

    print("\n==========================================")
    print("SUCCESS: All 4 models trained and saved to:")
    print(f" -> {SAVED_MODELS_DIR}")
    print("==========================================")

if __name__ == "__main__":
    train_all()
