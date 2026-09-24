"""
FastAPI Main Application Entrypoint
Configures CORS, routes, logging, startup events, and API documentation.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-Grade Multi-Asset Stock & Crypto Price Prediction API with 6 ML Algorithms",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits Vercel frontend & local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include main router
app.include_router(router)

@app.get("/")
def root_endpoint():
    return {
        "status": "online",
        "title": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "supported_assets": ["reliance", "bitcoin", "google"],
        "docs": "/docs",
        "endpoints": {
            "Assets": "/assets",
            "Real-time Prediction": "/prediction/{asset_id}",
            "Historical Data": "/historical/{asset_id}",
            "Model Evaluation": "/evaluation/{asset_id}",
            "Model Comparison": "/model-comparison/{asset_id}"
        }
    }
