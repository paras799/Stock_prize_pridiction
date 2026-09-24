import React from 'react';
import { Link } from '../router/RouterContext';
import { MODELS_LIST } from '../data/modelsData';
import { Cpu, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-brand-logo">
              <Cpu size={20} className="footer-cpu-icon" />
              <span className="footer-brand-title">QuantAI Stock Predictor</span>
            </div>
            <p className="footer-description">
              Production-grade machine learning platform for time-series stock and cryptocurrency price forecasting across 6 statistical algorithms.
            </p>
            <div className="footer-tech-stack">
              <span className="tech-tag">React 19</span>
              <span className="tech-tag">FastAPI</span>
              <span className="tech-tag">Scikit-Learn</span>
              <span className="tech-tag">Recharts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Platform Home</Link></li>
              <li><Link to="/models">Models Overview & Comparison</Link></li>
              <li><Link to="/about">About Platform & Methodology</Link></li>
            </ul>
          </div>

          {/* Dedicated Models Links */}
          <div className="footer-col">
            <h4 className="footer-heading">ML Algorithms</h4>
            <ul className="footer-links-list">
              {MODELS_LIST.map((m) => (
                <li key={m.key}>
                  <Link to={`/models/${m.slug}`}>{m.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational About Pages */}
          <div className="footer-col">
            <h4 className="footer-heading">Learn Algorithm Specs</h4>
            <ul className="footer-links-list">
              {MODELS_LIST.map((m) => (
                <li key={m.key}>
                  <Link to={`/models/${m.slug}/about`}>About {m.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="footer-disclaimer-banner">
          <ShieldAlert size={16} className="disclaimer-icon" />
          <p>
            <strong>Risk Warning:</strong> Financial asset price prediction involves substantial market risk and uncertainty. Historical patterns do not guarantee future performance. Model predictions are provided strictly for educational and technical analysis research.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} QuantAI Predictor Platform • All Rights Reserved</span>
          <span className="footer-build">Engineered with Scikit-Learn & FastAPI</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
