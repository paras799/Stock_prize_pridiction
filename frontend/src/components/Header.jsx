import { Activity, LayoutDashboard, Info, Sparkles } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, r2Accuracy }) => {
  return (
    <header className="header animate-fade-in">
      <div className="header-brand">
        <div className="logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <Activity size={32} color="var(--primary)" />
          <h1>StockX <span>Predictor</span></h1>
        </div>
        <p className="subtitle">SVR Machine Learning Intelligence Engine</p>
      </div>

      <div className="header-right">
        {r2Accuracy && (
          <div className="accuracy-badge">
            <Sparkles size={14} color="#10b981" />
            <span>Accuracy: <strong>{r2Accuracy}%</strong> ($R^2$)</span>
          </div>
        )}

        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={18} />
            <span>About Model</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

