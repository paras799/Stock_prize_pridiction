const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stock-prize-pridiction-mk3p.onrender.com';

export const fetchHistoricalData = async (limit = 100) => {
  const response = await fetch(`${API_BASE_URL}/historical-data?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch historical stock data.');
  return await response.json();
};

export const fetchComparisonMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/comparison/metrics`);
  if (!response.ok) throw new Error('Failed to fetch comparison metrics.');
  return await response.json();
};

// SVR Model API calls
export const predictSVR = async (openPrice) => {
  const response = await fetch(`${API_BASE_URL}/api/svr/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Open: parseFloat(openPrice) }),
  });
  if (!response.ok) throw new Error('SVR Prediction failed.');
  return await response.json();
};

export const fetchSVRInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/svr/info`);
  if (!response.ok) throw new Error('Failed to fetch SVR model info.');
  return await response.json();
};

export const fetchSVRMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/svr/metrics`);
  if (!response.ok) throw new Error('Failed to fetch SVR metrics.');
  return await response.json();
};

// Simple Linear Regression API calls
export const predictSimpleLinear = async (openPrice) => {
  const response = await fetch(`${API_BASE_URL}/api/simple-linear/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Open: parseFloat(openPrice) }),
  });
  if (!response.ok) throw new Error('Simple Linear Prediction failed.');
  return await response.json();
};

export const fetchSimpleLinearInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/simple-linear/info`);
  if (!response.ok) throw new Error('Failed to fetch Simple Linear info.');
  return await response.json();
};

export const fetchSimpleLinearMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/simple-linear/metrics`);
  if (!response.ok) throw new Error('Failed to fetch Simple Linear metrics.');
  return await response.json();
};

// Multiple Linear Regression API calls
export const predictMultipleLinear = async (open, high, low, volume) => {
  const response = await fetch(`${API_BASE_URL}/api/multiple-linear/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Open: parseFloat(open),
      High: parseFloat(high),
      Low: parseFloat(low),
      Volume: parseFloat(volume || 0),
    }),
  });
  if (!response.ok) throw new Error('Multiple Linear Prediction failed.');
  return await response.json();
};

export const fetchMultipleLinearInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/multiple-linear/info`);
  if (!response.ok) throw new Error('Failed to fetch Multiple Linear info.');
  return await response.json();
};

export const fetchMultipleLinearMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/multiple-linear/metrics`);
  if (!response.ok) throw new Error('Failed to fetch Multiple Linear metrics.');
  return await response.json();
};

// Polynomial Regression API calls
export const predictPolynomial = async (openPrice) => {
  const response = await fetch(`${API_BASE_URL}/api/polynomial/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Open: parseFloat(openPrice) }),
  });
  if (!response.ok) throw new Error('Polynomial Prediction failed.');
  return await response.json();
};

export const fetchPolynomialInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/polynomial/info`);
  if (!response.ok) throw new Error('Failed to fetch Polynomial info.');
  return await response.json();
};

export const fetchPolynomialMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/api/polynomial/metrics`);
  if (!response.ok) throw new Error('Failed to fetch Polynomial metrics.');
  return await response.json();
};
