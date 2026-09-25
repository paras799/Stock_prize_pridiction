// Determine API URL base. Try env var first, or fallback to port 8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Universal fetch wrapper with fallback attempt between direct backend URL and Vite proxy /api
 */
const fetchAPI = async (endpoint, options = {}) => {
  const urlsToTry = [
    `${API_BASE_URL}${endpoint}`,
    `/api${endpoint}`,
    `http://127.0.0.1:8000${endpoint}`,
  ];

  let lastError = null;

  for (const url of urlsToTry) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error(`API call failed for ${endpoint}`);
};

/**
 * 1. Health check endpoint: GET /health
 */
export const checkBackendHealth = async () => {
  try {
    const data = await fetchAPI('/health');
    return data && (data.status === 'ok' || data.service);
  } catch {
    return false;
  }
};

/**
 * 2. Lists all supported financial assets: GET /assets
 */
export const fetchAssets = async () => {
  return await fetchAPI('/assets');
};

/**
 * 3. Real-time predictions for all 6 models: GET /prediction/{asset_id}
 */
export const fetchRealtimePrediction = async (assetId) => {
  return await fetchAPI(`/prediction/${assetId}`);
};

/**
 * 4. Custom prediction endpoint: POST /prediction
 */
export const postCustomPrediction = async (assetId, open, high, low, volume) => {
  const payload = {
    asset_id: assetId,
    Open: parseFloat(open),
    High: high !== undefined && high !== null && high !== '' ? parseFloat(high) : parseFloat(open),
    Low: low !== undefined && low !== null && low !== '' ? parseFloat(low) : parseFloat(open),
    Volume: volume !== undefined && volume !== null && volume !== '' ? parseFloat(volume) : 0.0,
  };

  return await fetchAPI('/prediction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
};

/**
 * 5. Daily historical OHLCV data: GET /historical/{asset_id}?limit={limit}
 */
export const fetchHistoricalData = async (assetId, limit = 100) => {
  return await fetchAPI(`/historical/${assetId}?limit=${limit}`);
};

/**
 * 6. Ranked model comparison metrics: GET /model-comparison/{asset_id}
 */
export const fetchModelComparison = async (assetId) => {
  return await fetchAPI(`/model-comparison/${assetId}`);
};

/**
 * 7. Holdout Validation out-of-sample dataset: GET /validation/holdout/{asset_id}?model_key={modelKey}
 */
export const fetchHoldoutValidation = async (assetId, modelKey = 'svr') => {
  return await fetchAPI(`/validation/holdout/${assetId}?model_key=${modelKey}`);
};

/**
 * 8. Asset model metadata endpoint: GET /models/{asset_id}
 */
export const fetchModelMetadata = async (assetId) => {
  return await fetchAPI(`/models/${assetId}`);
};

/**
 * 9. Evaluation metrics endpoint: GET /evaluation/{asset_id}
 */
export const fetchModelEvaluation = async (assetId) => {
  return await fetchAPI(`/evaluation/${assetId}`);
};
