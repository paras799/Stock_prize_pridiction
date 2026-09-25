import React, { useState } from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import { ArrowUpDown, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

const ModelComparisonTable = ({ comparisonData, currency = 'USD' }) => {
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
    const valA = a[sortField];
    const valB = b[sortField];
    if (sortDirection === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  return (
    <div className="comparison-table-card">
      <div className="table-responsive">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Model Algorithm</th>
              <th onClick={() => handleSort('r2_percentage')} style={{ cursor: 'pointer' }}>
                Test R² Score (%) <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('mae')} style={{ cursor: 'pointer' }}>
                MAE ({currency}) <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('rmse')} style={{ cursor: 'pointer' }}>
                RMSE ({currency}) <ArrowUpDown size={12} />
              </th>
              <th onClick={() => handleSort('mape')} style={{ cursor: 'pointer' }}>
                MAPE (%) <ArrowUpDown size={12} />
              </th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((m) => {
              const isBest = m.model_key === comparisonData.recommended_best_model;
              const modelObj = MODELS_LIST.find((item) => item.key === m.model_key);

              return (
                <tr key={m.model_key} className={isBest ? 'best-row-highlight' : ''}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.model_name}</span>
                      {isBest && (
                        <span className="best-ribbon font-badge">
                          <Award size={11} /> Best Model
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: m.r2_percentage > 95 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 240, 255, 0.12)',
                        color: m.r2_percentage > 95 ? 'var(--neon-emerald)' : 'var(--neon-cyan)',
                        border: `1px solid ${m.r2_percentage > 95 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 240, 255, 0.3)'}`,
                      }}
                    >
                      {formatNumber(m.r2_percentage, 2)}%
                    </span>
                  </td>
                  <td className="mono-font">{formatNumber(m.mae, 4)}</td>
                  <td className="mono-font">{formatNumber(m.rmse, 4)}</td>
                  <td className="mono-font">{formatNumber(m.mape, 2)}%</td>
                  <td style={{ textAlign: 'right' }}>
                    {modelObj && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to={`/models/${modelObj.slug}`} className="btn btn-primary btn-sm">
                          Predict
                        </Link>
                        <Link to={`/models/${modelObj.slug}/about`} className="btn btn-secondary btn-sm">
                          Specs
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelComparisonTable;
