import React, { useState } from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import ModelCard from '../components/ModelCard';
import Chart from '../components/Chart';
import {
  BarChart2,
  Award,
  ArrowUpDown,
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const ModelsOverview = ({
  assets = [],
  selectedAssetId,
  onSelectAsset,
  comparisonData,
  historicalData,
  predictionData,
}) => {
  const [sortField, setSortField] = useState('r2_percentage');
  const [sortDirection, setSortDirection] = useState('desc');

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const currency = predictionData?.currency || selectedAsset?.currency || 'USD';

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'r2_percentage' ? 'desc' : 'asc');
    }
  };

  const sortedModels = comparisonData?.models
    ? [...comparisonData.models].sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortDirection === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      })
    : [];

  return (
    <div className="models-overview-container">
      {/* Page Header */}
      <div className="overview-page-header">
        <div>
          <span className="sub-badge">Model Portfolio</span>
          <h1 className="overview-title">Machine Learning Models Overview</h1>
          <p className="overview-desc">
            Explore and compare all 6 regression algorithms implemented in our prediction suite. Every model has a dedicated live prediction tool and educational documentation page.
          </p>
        </div>

        {assets.length > 0 && (
          <div className="overview-asset-picker">
            <span className="picker-label">Benchmark Asset:</span>
            <select
              className="asset-select-dropdown"
              value={selectedAssetId}
              onChange={(e) => onSelectAsset(e.target.value)}
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.symbol})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Model Cards Grid */}
      <section className="overview-section">
        <h2 className="section-title">Available Models Grid</h2>
        <div className="models-cards-grid">
          {MODELS_LIST.map((model) => {
            const compMetric = comparisonData?.models?.find((m) => m.model_key === model.key);
            const isBest = model.key === comparisonData?.recommended_best_model;

            return (
              <ModelCard
                key={model.key}
                model={model}
                isRecommended={isBest}
                r2Score={compMetric?.r2_percentage}
                mae={compMetric?.mae}
                currency={currency}
              />
            );
          })}
        </div>
      </section>

      {/* Comparison Metrics Section */}
      {comparisonData && comparisonData.models && (
        <section className="overview-section">
          <div className="section-header-with-icon">
            <BarChart2 className="header-icon" size={24} />
            <div>
              <h2 className="section-title">Holdout Test Evaluation & Model Comparison</h2>
              <p className="section-desc">
                Quantitative metrics computed chronologically on 15% holdout test dataset for {comparisonData.asset_name || selectedAssetId}.
              </p>
            </div>
          </div>

          <div className="comparison-table-card">
            <div className="table-responsive">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Model Algorithm</th>
                    <th onClick={() => handleSort('r2_percentage')} className="sortable">
                      Test R² Score (%) <ArrowUpDown size={13} />
                    </th>
                    <th onClick={() => handleSort('mae')} className="sortable">
                      MAE ({currency}) <ArrowUpDown size={13} />
                    </th>
                    <th onClick={() => handleSort('rmse')} className="sortable">
                      RMSE ({currency}) <ArrowUpDown size={13} />
                    </th>
                    <th onClick={() => handleSort('mape')} className="sortable">
                      MAPE (%) <ArrowUpDown size={13} />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedModels.map((m) => {
                    const isBest = m.model_key === comparisonData.recommended_best_model;
                    const modelObj = MODELS_LIST.find((item) => item.key === m.model_key);

                    return (
                      <tr key={m.model_key} className={isBest ? 'best-row-highlight' : ''}>
                        <td className="model-name-cell">
                          <div>
                            <span className="table-model-name">{m.model_name}</span>
                            {isBest && (
                              <span className="best-tag font-badge">
                                <Award size={12} /> Best Validated Model
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`metric-badge ${m.r2_percentage > 95 ? 'excel' : m.r2_percentage > 80 ? 'good' : 'fair'}`}>
                            {formatNumber(m.r2_percentage, 2)}%
                          </span>
                        </td>
                        <td>{formatNumber(m.mae, 4)}</td>
                        <td>{formatNumber(m.rmse, 4)}</td>
                        <td>{formatNumber(m.mape, 2)}%</td>
                        <td>
                          <div className="table-actions-cell">
                            {modelObj && (
                              <>
                                <Link to={`/models/${modelObj.slug}`} className="table-btn btn-primary">
                                  Predict
                                </Link>
                                <Link to={`/models/${modelObj.slug}/about`} className="table-btn btn-secondary">
                                  About
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Visual Chart Comparison */}
      <section className="overview-section">
        <Chart
          historicalData={historicalData}
          metadata={predictionData}
          comparisonData={comparisonData}
          currency={currency}
          assetName={selectedAsset?.name}
        />
      </section>
    </div>
  );
};

export default ModelsOverview;
