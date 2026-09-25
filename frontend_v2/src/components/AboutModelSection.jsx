import React from 'react';
import MathFormula from './MathFormula';
import {
  BookOpen,
  Calculator,
  ListOrdered,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';

const AboutModelSection = ({ model }) => {
  if (!model) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
      {/* 1. What Is It? */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <BookOpen size={20} style={{ color: 'var(--neon-cyan)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>1. Algorithm Overview & Concept</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
          {model.whatIs}
        </p>
      </div>

      {/* 2. Mathematical Concept & Formula */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Calculator size={20} style={{ color: 'var(--neon-purple)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>2. Mathematical Formulation & Latex Equation</h3>
        </div>
        
        {model.mathConcept?.latex ? (
          <MathFormula math={model.mathConcept.latex} fallback={model.formulaDisplay || model.formula} />
        ) : (
          <div className="model-card-formula" style={{ fontSize: '1rem', padding: '1rem' }}>
            {model.formulaDisplay || model.formula}
          </div>
        )}

        {/* Term definitions */}
        {model.mathConcept?.terms && (
          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', uppercase: 'true', marginBottom: '0.75rem' }}>
              MATHEMATICAL VARIABLE DEFINITIONS:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
              {model.mathConcept.terms.map((t, idx) => (
                <div key={idx} style={{ background: 'rgba(5, 9, 18, 0.6)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span className="mono-font" style={{ color: 'var(--neon-cyan)', fontWeight: 700, marginRight: '0.75rem' }}>
                    {t.symbol}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {t.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Input Features */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <Layers size={20} style={{ color: 'var(--neon-emerald)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>3. Predictor Feature Inputs</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {model.featuresExplanation ? (
            model.featuresExplanation.map((f, idx) => (
              <div key={idx} style={{ background: 'rgba(5, 9, 18, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="sub-badge" style={{ marginBottom: '0.5rem' }}>{f.name}</span>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{f.desc}</p>
              </div>
            ))
          ) : (
            model.features.map((feat, idx) => (
              <div key={idx} className="mono-font" style={{ background: 'rgba(0, 240, 255, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--neon-cyan)' }}>
                {feat}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Step-by-Step Execution Pipeline */}
      {model.howItWorks && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <ListOrdered size={20} style={{ color: 'var(--neon-amber)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>4. Execution Pipeline & Step Breakdown</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {model.howItWorks.map((hw) => (
              <div key={hw.step} style={{ background: 'rgba(5, 9, 18, 0.6)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <span className="mono-font" style={{ background: 'rgba(0, 240, 255, 0.15)', color: 'var(--neon-cyan)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700 }}>
                    Step {hw.step}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{hw.title}</h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{hw.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Advantages & Limitations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Advantages */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--neon-emerald)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Key Advantages</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {model.advantages.map((adv, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--neon-emerald)', marginTop: '2px' }}>✓</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} style={{ color: 'var(--neon-rose)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Limitations & Risk Constraints</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {model.limitations.map((lim, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--neon-rose)', marginTop: '2px' }}>!</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutModelSection;
