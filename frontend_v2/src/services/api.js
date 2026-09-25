const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://stock-price-prediction-api-x76e.onrender.com";

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

/**
 * 1. Health check
 * GET /health
 */
export const checkBackendHealth = async () => {
  try {
    const data = await fetchAPI("/health");
    return data && (data.status === "ok" || data.service);
  } catch {
    return false;
  }
};

/**
 * 2. Get all supported assets
 * GET /assets
 */
export const fetchAssets = async () => {
  return await fetchAPI("/assets");
};

/**
 * 3. Real-time prediction
 * GET /prediction/{asset_id}
 */
export const fetchRealtimePrediction = async (assetId) => {
  return await fetchAPI(`/prediction/${assetId}`);
};

/**
 * 4. Custom prediction
 * POST /prediction
 */
export const postCustomPrediction = async (
  assetId,
  open,
  high,
  low,
  volume
) => {
  const payload = {
    asset_id: assetId,

    Open: parseFloat(open),

    High:
      high !== undefined && high !== null && high !== ""
        ? parseFloat(high)
        : parseFloat(open),

    Low:
      low !== undefined && low !== null && low !== ""
        ? parseFloat(low)
        : parseFloat(open),

    Volume:
      volume !== undefined && volume !== null && volume !== ""
        ? parseFloat(volume)
        : 0.0,
  };

  return await fetchAPI("/prediction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

/**
 * 5. Historical OHLCV data
 * GET /historical/{asset_id}?limit={limit}
 */
export const fetchHistoricalData = async (assetId, limit = 100) => {
  return await fetchAPI(`/historical/${assetId}?limit=${limit}`);
};

/**
 * 6. Model comparison
 * GET /model-comparison/{asset_id}
 */
export const fetchModelComparison = async (assetId) => {
  return await fetchAPI(`/model-comparison/${assetId}`);
};

/**
 * 7. Holdout validation
 * GET /validation/holdout/{asset_id}?model_key={modelKey}
 */
export const fetchHoldoutValidation = async (
  assetId,
  modelKey = "svr"
) => {
  return await fetchAPI(
    `/validation/holdout/${assetId}?model_key=${modelKey}`
  );
};

/**
 * 8. Model metadata
 * GET /models/{asset_id}
 */
export const fetchModelMetadata = async (assetId) => {
  return await fetchAPI(`/models/${assetId}`);
};

/**
 * 9. Evaluation metrics
 * GET /evaluation/{asset_id}
 */
export const fetchModelEvaluation = async (assetId) => {
  return await fetchAPI(`/evaluation/${assetId}`);
};