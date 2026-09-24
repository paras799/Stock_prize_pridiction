import React, { useState } from 'react';
import { TrendingUp, LineChart as LineIcon, BarChart2 } from 'lucide-react';
import FinancialChart from './FinancialChart';
import ModelR2Chart from './ModelR2Chart';

const Chart = ({
  historicalData,
  metadata,
  comparisonData,
  currency = 'USD',
  assetName = '',
  selectedModelKey = 'svr',
}) => {
  const [activeTab, setActiveTab] = useState('historical'); // 'historical' | 'validation' | 'comparison'

  const currentModelKey = selectedModelKey || metadata?.recommended_best_model || 'svr';

  return (
    <div className="chart-container-card">
      {/* Tab Switcher Header */}
      <div className="chart-tab-header">
        <div className="chart-tabs">
          {historicalData && (
            <button
              className={`chart-tab-btn ${activeTab === 'historical' ? 'active' : ''}`}
              onClick={() => setActiveTab('historical')}
            >
              <TrendingUp size={15} /> Financial Market Chart ({assetName || historicalData.asset_name})
            </button>
          )}

          {(metadata || comparisonData) && (
            <button
              className={`chart-tab-btn ${activeTab === 'validation' ? 'active' : ''}`}
              onClick={() => setActiveTab('validation')}
            >
              <LineIcon size={15} /> Holdout Validation: Actual vs Predicted
            </button>
          )}

          {comparisonData && (
            <button
              className={`chart-tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparison')}
            >
              <BarChart2 size={15} /> Model R² Comparison
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="chart-body">
        {activeTab === 'historical' && (
          <FinancialChart
            historicalData={historicalData}
            metadata={metadata}
            predictionData={metadata}
            currency={currency}
            assetName={assetName}
            selectedModelKey={currentModelKey}
            activeTab="historical"
          />
        )}

        {activeTab === 'validation' && (
          <FinancialChart
            historicalData={historicalData}
            metadata={metadata}
            predictionData={metadata}
            currency={currency}
            assetName={assetName}
            selectedModelKey={currentModelKey}
            activeTab="validation"
          />
        )}

        {activeTab === 'comparison' && (
          <ModelR2Chart
            comparisonData={comparisonData}
            selectedModelKey={currentModelKey}
            currency={currency}
          />
        )}
      </div>
    </div>
  );
};

export default Chart;

