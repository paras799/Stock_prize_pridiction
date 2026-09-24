const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchAssets = async () => {
  const response = await fetch(`${API_BASE_URL}/assets`);
  if (!response.ok) throw new Error('Failed to fetch supported assets.');
  return await response.json();
};

export const fetchRealtimePrediction = async (assetId) => {
  const response = await fetch(`${API_BASE_URL}/prediction/${assetId}`);
  if (!response.ok) throw new Error(`Failed to fetch predictions for ${assetId}`);
  return await response.json();
};

export const postCustomPrediction = async (assetId, open, high, low, volume) => {
  const response = await fetch(`${API_BASE_URL}/prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      asset_id: assetId,
      Open: parseFloat(open),
      High: high ? parseFloat(high) : parseFloat(open),
      Low: low ? parseFloat(low) : parseFloat(open),
      Volume: volume ? parseFloat(volume) : 0.0,
    }),
  });
  if (!response.ok) throw new Error('Custom prediction calculation failed.');
  return await response.json();
};

export const fetchHistoricalData = async (assetId, limit = 100) => {
  const response = await fetch(`${API_BASE_URL}/historical/${assetId}?limit=${limit}`);
  if (!response.ok) throw new Error(`Failed to fetch historical data for ${assetId}`);
  return await response.json();
};

export const fetchModelComparison = async (assetId) => {
  const response = await fetch(`${API_BASE_URL}/model-comparison/${assetId}`);
  if (!response.ok) throw new Error(`Failed to fetch comparison metrics for ${assetId}`);
  return await response.json();
};
