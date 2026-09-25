import React from 'react';
import { Database, Sliders, Cpu, LineChart, ArrowRight } from 'lucide-react';

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Market Data Sync',
    desc: 'Ingests real-time daily Open, High, Low, Volume data from exchange APIs.',
    icon: Database,
  },
  {
    step: '02',
    title: 'Feature Normalization',
    desc: 'Cleanses data & normalizes scale differences using StandardScaler.',
    icon: Sliders,
  },
  {
    step: '03',
    title: 'Multi-Model Inference',
    desc: 'Executes predictions across 6 ML regressors simultaneously.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Analytical Benchmark',
    desc: 'Outputs estimated closing prices & holdout test R² accuracy metrics.',
    icon: LineChart,
  },
];

const WorkflowDiagram = ({ title = 'End-to-End Market Prediction Pipeline' }) => {
  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
        {title}
      </h3>
      <div className="workflow-pipeline">
        {PIPELINE_STEPS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={item.step} className="workflow-node">
              <div className="workflow-step-num">{item.step}</div>
              <div style={{ color: 'var(--neon-cyan)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <IconComp size={24} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowDiagram;
