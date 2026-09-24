import React from 'react';
import AssetSelector from '../components/AssetSelector';
import MarketCard from '../components/MarketCard';
import PredictionCards from '../components/PredictionCards';
import ModelComparisonTable from '../components/ModelComparisonTable';
import ChartsSection from '../components/ChartsSection';
import AlgorithmExplanations from '../components/AlgorithmExplanations';
import { useAssetData } from '../hooks/useAssetData';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const {
    assets,
    selectedAssetId,
    setSelectedAssetId,
    predictionData,
    historicalData,
    comparisonData,
    loading,
    error,
    isCustomInput,
    handleCustomPrediction,
    handleResetToRealtime,
    refreshData,
  } = useAssetData();

  return (
    <div className="dashboard-container">
      <AssetSelector
        assets={assets}
        selectedAssetId={selectedAssetId}
        onSelectAsset={setSelectedAssetId}
      />

      {error && (
        <div className="glass-card error-card">
          <AlertCircle size={22} className="error-icon" />
          <div className="error-text">
            <h4>Connection / Execution Warning</h4>
            <p>{error}</p>
          </div>
          <button className="primary-btn btn-sm" onClick={refreshData}>
            <RefreshCw size={14} /> Retry Request
          </button>
        </div>
      )}

      {loading && !predictionData ? (
        <div className="loading-container glass-card">
          <Loader2 className="spinner" size={40} />
          <p>Fetching real-time market data and generating ML predictions...</p>
        </div>
      ) : (
        <>
          {predictionData && (
            <>
              <MarketCard
                marketData={predictionData.market_data}
                currency={predictionData.currency}
                isCustomInput={isCustomInput}
                onCustomSubmit={handleCustomPrediction}
                onReset={handleResetToRealtime}
              />

              <PredictionCards predictionData={predictionData} />

              <ModelComparisonTable
                comparisonData={comparisonData}
                currency={predictionData.currency}
              />

              <ChartsSection
                historicalData={historicalData}
                metadata={predictionData}
                currency={predictionData.currency}
              />

              <AlgorithmExplanations />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
