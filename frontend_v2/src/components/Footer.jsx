import React from 'react';
import { Link } from '../router/RouterContext';
import { Sparkles, ShieldCheck, Github, Cpu, Database } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container-xl">
        <div className="footer-grid">
          {/* Col 1: Brand & Info */}
          <div>
            <Link to="/" className="navbar-brand">
              <div className="brand-icon-box">
                <Sparkles size={20} />
              </div>
              <span className="brand-title">
                Quant<span>AI</span> <span className="brand-version">v2.0</span>
              </span>
            </Link>
            <p className="footer-brand-desc">
              Next-generation quantitative machine learning platform for real-time stock price prediction, historical time-series evaluation, and statistical model benchmarking.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links-list">
              <li><Link to="/" className="footer-link">Home Dashboard</Link></li>
              <li><Link to="/models" className="footer-link">Machine Learning Models</Link></li>
              <li><Link to="/about" className="footer-link">System Architecture</Link></li>
            </ul>
          </div>

          {/* Col 3: ML Models */}
          <div>
            <h4 className="footer-col-title">Regressors</h4>
            <ul className="footer-links-list">
              <li><Link to="/models/linear-regression" className="footer-link">Simple Linear</Link></li>
              <li><Link to="/models/multiple-linear-regression" className="footer-link">Multiple Linear</Link></li>
              <li><Link to="/models/polynomial-regression" className="footer-link">Polynomial (Deg 3)</Link></li>
              <li><Link to="/models/svr" className="footer-link">Support Vector (SVR)</Link></li>
              <li><Link to="/models/random-forest" className="footer-link">Random Forest</Link></li>
              <li><Link to="/models/gradient-boosting" className="footer-link">Gradient Boosting</Link></li>
            </ul>
          </div>

          {/* Col 4: Specs & Tech */}
          <div>
            <h4 className="footer-col-title">Technology</h4>
            <ul className="footer-links-list">
              <li><span className="footer-link">FastAPI Python REST Service</span></li>
              <li><span className="footer-link">Scikit-Learn ML Pipelines</span></li>
              <li><span className="footer-link">Lightweight Financial Canvas</span></li>
              <li><span className="footer-link">KaTeX LaTeX Engine</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} QuantAI Predictive Systems. Built for Quantitative Academic Research.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--neon-emerald)' }} />
            <span>Out-of-Sample Holdout Validated (85/15 Split)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
