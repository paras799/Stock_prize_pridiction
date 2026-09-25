import React from 'react';
import { getModelBySlug, MODELS_LIST } from '../data/modelsData';
import AboutModelSection from '../components/AboutModelSection';
import { Link } from '../router/RouterContext';
import { Sliders, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const ModelAboutPage = ({ slug }) => {
  const model = getModelBySlug(slug) || MODELS_LIST[0];

  return (
    <div className="container-xl" style={{ paddingTop: '2rem' }}>
      {/* Sub-Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="sub-badge sub-badge-purple">TECHNICAL SPECIFICATION</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{model.name} Mathematical Breakdown</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/models/${model.slug}`} className="btn btn-secondary btn-sm">
            <Sliders size={14} /> Live Simulator
          </Link>
          <Link to={`/models/${model.slug}/about`} className="btn btn-primary btn-sm">
            <BookOpen size={14} /> Mathematical Specs
          </Link>
        </div>
      </div>

      {/* 9-Section Mathematical Breakdown */}
      <AboutModelSection model={model} />

      {/* Bottom CTA to return to live simulator */}
      <div className="glass-card" style={{ marginTop: '3rem', marginBottom: '2rem', padding: '2.5rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.12) 0%, rgba(15, 23, 42, 0.7) 80%)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Ready to test predictions using {model.name}?
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Execute real-time price predictions or simulate custom what-if market scenarios using the trained {model.name} algorithm.
        </p>
        <Link to={`/models/${model.slug}`} className="btn btn-primary btn-lg">
          <span>Execute {model.name} Live Prediction</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default ModelAboutPage;
