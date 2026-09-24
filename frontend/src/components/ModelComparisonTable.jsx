import { useState } from 'react';
import { Award, ArrowUpDown, BarChart2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';
import ModelR2Chart from './ModelR2Chart';

const ModelComparisonTable = ({ comparisonData, currency }) => {
  const [sortField, setSortField] = useState('r2_percentage');
  const [sortDirection, setSortDirection] = useState('desc');

  if (!comparisonData || !comparisonData.models) return null;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'r2_percentage' ? 'desc' : 'asc');
    }
  };

  const sortedModels = [...comparisonData.models].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  return (
    <div className="glass-card comparison-section">
      <div className="section-header">
        <div className="title-with-badge">
          <BarChart2 className="section-icon" size={22} />
          <h2>Model Evaluation & Validation Comparison</h2>
        </div>
        <p className="section-desc">
          Chronological time-series evaluation metrics on 15% holdout test data
        </p>
      </div>

      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th onClick={() => handleSort('r2_percentage')} className="sortable-col">
                Test R² Score (%) <ArrowUpDown size={13} />
              </th>
              <th onClick={() => handleSort('mae')} className="sortable-col">
                MAE ({currency}) <ArrowUpDown size={13} />
              </th>
              <th onClick={() => handleSort('rmse')} className="sortable-col">
                RMSE ({currency}) <ArrowUpDown size={13} />
              </th>
              <th onClick={() => handleSort('mape')} className="sortable-col">
                MAPE (%) <ArrowUpDown size={13} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((m) => {
              const isBest = m.model_key === comparisonData.recommended_best_model;
              return (
                <tr key={m.model_key} className={isBest ? 'best-model-row' : ''}>
                  <td className="model-name-td">
                    <span className="table-model-title">{m.model_name}</span>
                    {isBest && (
                      <span className="badge-best">
                        <Award size={12} /> Best Validated Model
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`metric-tag ${m.r2_percentage > 95 ? 'tag-excel' : m.r2_percentage > 80 ? 'tag-good' : 'tag-warn'}`}>
                      {formatNumber(m.r2_percentage, 2)}%
                    </span>
                  </td>
                  <td>{formatNumber(m.mae, 4)}</td>
                  <td>{formatNumber(m.rmse, 4)}</td>
                  <td>{formatNumber(m.mape, 2)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="chart-wrapper font-chart" style={{ marginTop: '2rem' }}>
        <ModelR2Chart comparisonData={comparisonData} currency={currency} />
      </div>
    </div>
  );
};

export default ModelComparisonTable;

