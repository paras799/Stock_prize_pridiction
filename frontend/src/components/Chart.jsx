import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, LineChart as LineIcon, BarChart2 } from 'lucide-react';
import FinancialChart from './FinancialChart';
import { formatNumber } from '../utils/formatters';

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

  // Model comparison bar data
  const comparisonChartData = comparisonData?.models
    ? comparisonData.models.map((m) => ({
        name: m.model_name.replace(' (Degree 2)', '').replace(' (Degree 3)', '').replace(' (SVR - RBF)', ''),
        r2: m.r2_percentage > 0 ? m.r2_percentage : 0,
        mae: m.mae,
        isRecommended: m.model_key === comparisonData.recommended_best_model,
        isCurrent: m.model_key === currentModelKey,
      }))
    : [];

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
              <BarChart2 size={15} /> Model R² Accuracy Comparison
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
          <div className="bar-comparison-wrapper">
            <h4 className="chart-title">
              Out-of-Sample Test R² Accuracy Score (%) across 6 ML Algorithms
            </h4>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                  <XAxis dataKey="name" stroke="#64748b" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                    formatter={(val) => [`${formatNumber(val, 2)}%`, 'Test R² Score']}
                  />
                  <Bar dataKey="r2" name="Holdout R² Accuracy (%)" radius={[6, 6, 0, 0]}>
                    {comparisonChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isCurrent ? '#2563eb' : entry.isRecommended ? '#059669' : '#64748b'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
