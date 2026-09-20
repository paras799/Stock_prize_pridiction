import { Activity, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <Activity size={20} color="var(--primary)" />
          <span>StockX Machine Learning Intelligence Engine</span>
        </div>
        <p className="footer-desc">
          Predicting stock closing prices using SVR, Simple Linear, Multiple Linear, & Polynomial Regression models.
        </p>
        <div className="footer-disclaimer">
          <ShieldAlert size={14} color="#f59e0b" />
          <span>Educational & analytical project built with Scikit-Learn & FastAPI backend.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
