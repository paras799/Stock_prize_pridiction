import React from 'react';
import { Database, Filter, Cpu, Zap, Radio, CheckCircle2, ArrowRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Historical Data Ingestion',
    desc: 'Daily market price records (Date, Open, High, Low, Close, Volume).',
    icon: Database,
  },
  {
    step: 2,
    title: 'Data Preprocessing',
    desc: 'Handling missing values, chronologically sorting, and 85/15 train/test splitting.',
    icon: Filter,
  },
  {
    step: 3,
    title: 'Feature Engineering',
    desc: 'Feature selection & standardization via StandardScaler pipeline.',
    icon: Cpu,
  },
  {
    step: 4,
    title: 'Model Training',
    desc: 'Fitting regression coefficients & hyperparameter optimization.',
    icon: Zap,
  },
  {
    step: 5,
    title: 'Real-Time Market Data',
    desc: 'Ingesting live market feed or custom user what-if inputs.',
    icon: Radio,
  },
  {
    step: 6,
    title: 'Prediction Result',
    desc: 'Evaluating next trading session estimated closing price.',
    icon: CheckCircle2,
  },
];

const WorkflowDiagram = ({ title = 'Machine Learning Prediction Workflow' }) => {
  return (
    <div className="workflow-diagram-card">
      <div className="workflow-header">
        <h3 className="workflow-title">{title}</h3>
        <p className="workflow-sub">
          End-to-end data pipeline from historical ingestion to real-time market prediction
        </p>
      </div>

      <div className="workflow-steps-container">
        {WORKFLOW_STEPS.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <React.Fragment key={step.step}>
              <div className="workflow-step-item">
                <div className="step-badge">Step {step.step}</div>
                <div className="step-icon-box">
                  <IconComponent size={20} className="step-icon" />
                </div>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-desc">{step.desc}</p>
              </div>

              {idx < WORKFLOW_STEPS.length - 1 && (
                <div className="workflow-connector">
                  <ArrowRight size={18} className="connector-arrow" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowDiagram;
