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
  LabelList,
} from 'recharts';
import { HelpCircle, Award, CheckCircle2, Info } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const CustomR2Tooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="r2-custom-tooltip">
        <div className="r2-tt-header">
          <span>{data.full_name || data.name}</span>
        </div>
        <div className="r2-tt-body">
          <div className="r2-tt-row">
            <span className="r2-tt-label">Out-of-Sample R² Score:</span>
            <span className="r2-tt-val font-mono">{data.r2Formatted}</span>
          </div>
          {data.mae !== undefined && data.mae !== null && (
            <div className="r2-tt-row">
              <span className="r2-tt-label">MAE:</span>
              <span className="r2-tt-val font-mono">{formatNumber(data.mae, 4)}</span>
            </div>
          )}
          <div className="r2-tt-row">
            <span className="r2-tt-label">Validation Method:</span>
            <span className="r2-tt-val">Chronological Holdout</span>
          </div>
          {data.isRecommended && (
            <div className="r2-tt-badge badge-recommended">
              <Award size={12} /> Best Validated Fit
            </div>
          )}
          {data.isCurrent && !data.isRecommended && (
            <div className="r2-tt-badge badge-active">
              <CheckCircle2 size={12} /> Selected Model
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const ModelR2Chart = ({ comparisonData, selectedModelKey, currency = 'USD' }) => {
  const [showInfo, setShowInfo] = useState(false);

  if (!comparisonData || !comparisonData.models || comparisonData.models.length === 0) {
    return (
      <div className="r2-chart-empty-state">
        <Info size={24} className="text-muted" />
        <p>No model comparison metrics are available for this asset.</p>
      </div>
    );
  }

  const currentModelKey = selectedModelKey || comparisonData.recommended_best_model || 'svr';

  // Sort models descending by R2 score for clean visual ordering
  const modelsList = [...comparisonData.models].sort(
    (a, b) => (b.r2_percentage || 0) - (a.r2_percentage || 0)
  );

  const highestR2Model = modelsList[0];
  const highestR2Val = highestR2Model
    ? formatNumber(highestR2Model.r2_percentage > 0 ? highestR2Model.r2_percentage : 0, 2)
    : '0.00';

  const chartData = modelsList.map((m) => {
    const r2Val = m.r2_percentage > 0 ? m.r2_percentage : 0;
    // Clean name for chart YAxis label
    const shortName = m.model_name
      .replace(' (Degree 2)', '')
      .replace(' (Degree 3)', '')
      .replace(' (SVR - RBF)', '');

    return {
      key: m.model_key,
      full_name: m.model_name,
      name: shortName,
      r2: r2Val,
      r2Formatted: `${formatNumber(r2Val, 2)}%`,
      mae: m.mae,
      isRecommended: m.model_key === comparisonData.recommended_best_model,
      isCurrent: m.model_key === currentModelKey,
    };
  });

  // Calculate dynamic responsive height based on model count
  const dynamicHeight = Math.max(280, chartData.length * 48);

  return (
    <div className="r2-comparison-card">
      {/* Header Section */}
      <div className="r2-card-header">
        <div className="r2-title-block">
          <div className="r2-title-row">
            <h3 className="r2-card-title">Model Performance — Out-of-Sample R² Score</h3>
            <div className="r2-info-wrapper">
              <button
                className={`r2-info-btn ${showInfo ? 'active' : ''}`}
                onClick={() => setShowInfo(!showInfo)}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                aria-label="R² Metric Info"
                type="button"
              >
                <HelpCircle size={15} />
              </button>
              {showInfo && (
                <div className="r2-info-popover">
                  <div className="r2-info-popover-title">
                    <Info size={14} /> Understanding R² (Coefficient of Determination)
                  </div>
                  <p>
                    R² measures how much of the variance in closing stock prices is explained by the regression model on <strong>unseen holdout test data</strong>.
                  </p>
                  <p>
                    Values closer to <strong>100%</strong> indicate superior predictive accuracy and lower generalization error.
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="r2-card-subtitle">
            Performance of machine learning regression models evaluated on unseen chronological test data.
          </p>
        </div>

        {/* Summary Metric Pills */}
        <div className="r2-summary-bar">
          <div className="r2-summary-pill">
            <span className="r2-pill-label">Models Evaluated</span>
            <span className="r2-pill-value">{chartData.length}</span>
          </div>
          <div className="r2-summary-pill highlight">
            <span className="r2-pill-label">Highest Observed R²</span>
            <span className="r2-pill-value emerald-text">{highestR2Val}%</span>
          </div>
          <div className="r2-summary-pill">
            <span className="r2-pill-label">Metric</span>
            <span className="r2-pill-value">R² (Out-of-Sample)</span>
          </div>
          <div className="r2-summary-pill">
            <span className="r2-pill-label">Validation</span>
            <span className="r2-pill-value">15% Holdout Split</span>
          </div>
        </div>
      </div>

      {/* Main Horizontal Bar Chart */}
      <div className="r2-chart-body" style={{ width: '100%', height: dynamicHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 12, right: 75, left: 10, bottom: 12 }}
          >
            <defs>
              <linearGradient id="r2ActiveGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="r2BestGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="r2DefaultGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} opacity={0.8} />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#475569"
              tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }}
              width={200}
            />
            <Tooltip content={<CustomR2Tooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.8)' }} />
            <Bar dataKey="r2" name="Holdout R² (%)" radius={[0, 6, 6, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isCurrent
                      ? 'url(#r2ActiveGradient)'
                      : entry.isRecommended
                      ? 'url(#r2BestGradient)'
                      : 'url(#r2DefaultGradient)'
                  }
                  className="r2-bar-cell"
                />
              ))}
              <LabelList
                dataKey="r2Formatted"
                position="right"
                fill="#1e293b"
                fontSize={12}
                fontWeight={700}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>


      {/* Compact Breakdown List / Accessibility Table */}
      <div className="r2-breakdown-table-wrapper">
        <table className="r2-breakdown-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Out-of-Sample R² (%)</th>
              <th>MAE ({currency})</th>
              <th>Validation Status</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr
                key={item.key}
                className={`${item.isCurrent ? 'row-selected' : ''} ${
                  item.isRecommended ? 'row-best' : ''
                }`}
              >
                <td className="model-name-cell">
                  <span className="font-semibold">{item.full_name}</span>
                </td>
                <td>
                  <span
                    className={`r2-badge ${
                      item.r2 > 95 ? 'badge-r2-high' : item.r2 > 80 ? 'badge-r2-med' : 'badge-r2-low'
                    }`}
                  >
                    {item.r2Formatted}
                  </span>
                </td>
                <td className="font-mono text-muted-dark">
                  {item.mae !== undefined ? formatNumber(item.mae, 4) : 'N/A'}
                </td>
                <td>
                  {item.isRecommended ? (
                    <span className="status-pill emerald">
                      <Award size={12} /> Top Validated Model
                    </span>
                  ) : item.isCurrent ? (
                    <span className="status-pill blue">
                      <CheckCircle2 size={12} /> Active Selection
                    </span>
                  ) : (
                    <span className="status-pill gray">Holdout Tested</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelR2Chart;
