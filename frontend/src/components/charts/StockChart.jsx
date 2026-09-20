import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const StockChart = ({ historyData = [], openPrice, prediction, modelName = "Model" }) => {
  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];
    
    const formatted = historyData.map((item) => ({
      date: item.Date,
      open: item.Open,
      close: item.Close,
    }));

    if (prediction && openPrice) {
      formatted.push({
        date: 'Predict Signal',
        open: parseFloat(openPrice),
        predictedClose: parseFloat(prediction),
        isPrediction: true
      });
    }

    return formatted;
  }, [historyData, openPrice, prediction]);

  return (
    <div className="chart-card glass-panel animate-fade-in">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">
            <TrendingUp size={20} color="var(--primary)" />
            Historical Stock Data & {modelName} Prediction Target
          </h2>
          <p className="chart-subtitle">
            Market Open vs. Close prices over time. Input a value to visualize prediction.
          </p>
        </div>
        {prediction && (
          <div className="prediction-tag animate-pulse">
            <span>Target Predicted Close: <strong>${parseFloat(prediction).toFixed(2)}</strong></span>
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 350, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="open" name="Open Price ($)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOpen)" strokeWidth={2} />
            <Area type="monotone" dataKey="close" name="Close Price ($)" stroke="#10b981" fillOpacity={1} fill="url(#colorClose)" strokeWidth={2} />
            {prediction && (
              <ReferenceLine y={parseFloat(prediction)} label={`Predicted: $${parseFloat(prediction).toFixed(2)}`} stroke="#f59e0b" strokeDasharray="5 5" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
