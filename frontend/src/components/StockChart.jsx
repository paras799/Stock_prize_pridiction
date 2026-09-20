import { LineChart as ChartIcon } from 'lucide-react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip glass-card" style={{ padding: '10px' }}>
        <p className="label" style={{ marginBottom: '5px' }}>{`Date: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: 0, fontWeight: 600 }}>
            {`${entry.name}: $${entry.value.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StockChart = ({ historyData, openPrice, prediction }) => {
  const chartData = [...historyData];
  if (prediction !== null && openPrice !== '') {
    chartData.push({
      Date: 'Next Prediction',
      Open: parseFloat(openPrice),
      PredictedClose: prediction,
      isPrediction: true
    });
  }

  return (
    <section className="glass-panel chart-section" style={{ height: '400px', width: '100%' }}>
      <div className="section-header">
        <ChartIcon size={24} color="var(--accent)" />
        <h2>Trend Analysis</h2>
      </div>
      
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        {historyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="Date" 
                stroke="var(--text-muted)" 
                tick={{ fill: 'var(--text-muted)' }} 
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                tick={{ fill: 'var(--text-muted)' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <Area 
                type="monotone" 
                dataKey="Close" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorClose)" 
                name="Historical Close"
                activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'white' }}
              />
              <Line 
                type="monotone" 
                dataKey="Open" 
                stroke="var(--text-muted)" 
                strokeWidth={2}
                dot={false}
                name="Historical Open"
                strokeDasharray="4 4"
              />
              <Area 
                type="monotone" 
                dataKey="PredictedClose" 
                stroke="var(--success)" 
                strokeWidth={3}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorPred)"
                dot={{ r: 6, fill: 'var(--success)', strokeWidth: 2, stroke: 'var(--bg-dark)' }}
                activeDot={{ r: 8, fill: 'var(--success)', stroke: 'white' }}
                name="Predicted Close"
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading historical data...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default StockChart;
