import { useState, useEffect, useCallback } from 'react';
import {
  fetchAssets,
  fetchRealtimePrediction,
  fetchHistoricalData,
  fetchModelComparison,
  postCustomPrediction,
  checkBackendHealth,
} from '../services/api';

export const useAssetData = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('reliance');
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Check health & fetch supported assets list on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendOnline);

    fetchAssets()
      .then((data) => {
        setAssets(data);
        if (data && data.length > 0) {
          // If current selectedAssetId is not in assets, fallback to first
          const exists = data.some((a) => a.id === selectedAssetId);
          if (!exists) setSelectedAssetId(data[0].id);
        }
      })
      .catch((err) => {
        console.error('Error fetching assets:', err);
        setBackendOnline(false);
      });
  }, []);

  const loadAssetData = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    setIsCustomInput(false);
    try {
      const [pred, hist, comp] = await Promise.all([
        fetchRealtimePrediction(assetId),
        fetchHistoricalData(assetId, 100),
        fetchModelComparison(assetId),
      ]);
      setPredictionData(pred);
      setHistoricalData(hist);
      setComparisonData(comp);
      setBackendOnline(true);
    } catch (err) {
      console.error(`Error loading data for ${assetId}:`, err);
      setError(err.message || 'Failed to connect to ML Backend Server.');
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedAssetId) {
      loadAssetData(selectedAssetId);
    }
  }, [selectedAssetId, loadAssetData]);

  const handleCustomPrediction = async (open, high, low, volume) => {
    setLoading(true);
    setError(null);
    try {
      const customPred = await postCustomPrediction(selectedAssetId, open, high, low, volume);
      setPredictionData(customPred);
      setIsCustomInput(true);
    } catch (err) {
      setError(err.message || 'Failed to calculate custom prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToRealtime = () => {
    loadAssetData(selectedAssetId);
  };

  return {
    assets,
    selectedAssetId,
    setSelectedAssetId,
    predictionData,
    historicalData,
    comparisonData,
    loading,
    error,
    isCustomInput,
    backendOnline,
    handleCustomPrediction,
    handleResetToRealtime,
    refreshData: () => loadAssetData(selectedAssetId),
  };
};
