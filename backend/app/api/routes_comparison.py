from fastapi import APIRouter
from app.api.routes_svr import get_svr_metrics
from app.api.routes_simple_linear import get_simple_linear_metrics
from app.api.routes_multiple_linear import get_multiple_linear_metrics
from app.api.routes_polynomial import get_polynomial_metrics
from app.schemas.prediction import ComparisonMetricsResponse, ComparisonModelMetric

router = APIRouter(prefix="/api/comparison", tags=["Model Comparison"])

@router.get("/metrics", response_model=ComparisonMetricsResponse)
def get_all_comparison_metrics():
    svr_m = get_svr_metrics()
    simple_m = get_simple_linear_metrics()
    multi_m = get_multiple_linear_metrics()
    poly_m = get_polynomial_metrics()

    models_list = [
        ComparisonModelMetric(
            model_key="svr",
            model_name="Support Vector Regression (SVR)",
            r2_test_percentage=svr_m["r2_test_percentage"],
            mae=svr_m["mae"],
            rmse=svr_m["rmse"],
            mape=svr_m["mape"],
            features_used=["Open"]
        ),
        ComparisonModelMetric(
            model_key="simple_linear",
            model_name="Simple Linear Regression",
            r2_test_percentage=simple_m["r2_test_percentage"],
            mae=simple_m["mae"],
            rmse=simple_m["rmse"],
            mape=simple_m["mape"],
            features_used=["Open"]
        ),
        ComparisonModelMetric(
            model_key="multiple_linear",
            model_name="Multiple Linear Regression",
            r2_test_percentage=multi_m["r2_test_percentage"],
            mae=multi_m["mae"],
            rmse=multi_m["rmse"],
            mape=multi_m["mape"],
            features_used=["Open", "High", "Low", "Volume"]
        ),
        ComparisonModelMetric(
            model_key="polynomial",
            model_name="Polynomial Regression (Degree 2)",
            r2_test_percentage=poly_m["r2_test_percentage"],
            mae=poly_m["mae"],
            rmse=poly_m["rmse"],
            mape=poly_m["mape"],
            features_used=["Open", "Open^2"]
        )
    ]

    # Find best model by highest R2 score
    best_model_obj = max(models_list, key=lambda m: m.r2_test_percentage)

    return ComparisonMetricsResponse(
        models=models_list,
        best_model=best_model_obj.model_name
    )
