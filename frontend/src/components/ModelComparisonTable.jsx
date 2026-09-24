import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Award, ArrowUpDown, BarChart2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

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

  const chartData = comparisonData.models.map((m) => ({
    name: m.model_name.replace(' (Degree 2)', '').replace(' (SVR - RBF)', ''),
    r2: m.r2_percentage > 0 ? m.r2_percentage : 0,
    mae: m.mae,
    isRecommended: m.model_key === comparisonData.recommended_best_model,
  }));

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

      <div className="chart-wrapper font-chart">
        <h4 className="subchart-title">Visual R² Score Accuracy Comparison (%)</h4>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="r2" name="Test R² Score (%)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isRecommended ? '#10b981' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonTable;
