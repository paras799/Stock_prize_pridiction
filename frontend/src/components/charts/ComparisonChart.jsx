import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from 'recharts';
import { Award, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const ComparisonChart = ({ comparisonMetrics }) => {
  if (!comparisonMetrics || !comparisonMetrics.models) {
    return null;
  }

  const chartData = comparisonMetrics.models.map(m => ({
    name: m.model_name.replace(" (Degree 2)", "").replace("Support Vector Regression (SVR)", "SVR"),
    r2: m.r2_test_percentage,
    mae: m.mae,
    rmse: m.rmse
  }));

  return (
    <div className="comparison-charts-container">
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <Award size={18} color="#10b981" />
              R² Accuracy Score Comparison (%)
            </h3>
            <p className="chart-subtitle">Higher is better. Percentage variance explained on test split.</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" domain={[99.5, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="r2" name="R² Test Accuracy (%)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card glass-panel">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              <Activity size={18} color="#3b82f6" />
              Mean Absolute Error (MAE $) Comparison
            </h3>
            <p className="chart-subtitle">Lower is better. Average absolute dollar deviation.</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="mae" name="MAE ($ Error)" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-mae-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
