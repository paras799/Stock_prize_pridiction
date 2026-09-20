import {
  Activity,
  TrendingUp,
  BarChart2,
  Layers,
  Sparkles,
  Info,
  Sliders,
  Scale
} from 'lucide-react';

const Header = ({ activePage, setActivePage, setAboutSubTab, comparisonMetrics }) => {
  const bestAccuracy = comparisonMetrics?.models?.[0]?.r2_test_percentage || '99.96';

  return (
    <header className="header animate-fade-in">
      <div className="header-brand">
        <div
          className="logo"
          onClick={() => setActivePage('svr')}
          style={{ cursor: 'pointer' }}
        >
          <Activity size={32} color="var(--primary)" />
          <h1>
            StockX <span>Predictor</span>
          </h1>
        </div>
        <p className="subtitle">Multi-Model Machine Learning Intelligence Suite</p>
      </div>

      <div className="header-right">
        <div className="accuracy-badge">
          <Sparkles size={14} color="#10b981" />
          <span>
            Top R² Accuracy: <strong>{bestAccuracy}%</strong>
          </span>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activePage === 'svr' ? 'active' : ''}`}
            onClick={() => setActivePage('svr')}
            title="Support Vector Regression"
          >
            <Sliders size={16} />
            <span>SVR</span>
          </button>

          <button
            className={`nav-tab ${activePage === 'simple-linear' ? 'active' : ''}`}
            onClick={() => setActivePage('simple-linear')}
            title="Simple Linear Regression"
          >
            <TrendingUp size={16} />
            <span>Simple Linear</span>
          </button>

          <button
            className={`nav-tab ${activePage === 'multiple-linear' ? 'active' : ''}`}
            onClick={() => setActivePage('multiple-linear')}
            title="Multiple Linear Regression"
          >
            <BarChart2 size={16} />
            <span>Multiple Linear</span>
          </button>

          <button
            className={`nav-tab ${activePage === 'polynomial' ? 'active' : ''}`}
            onClick={() => setActivePage('polynomial')}
            title="Polynomial Regression"
          >
            <Layers size={16} />
            <span>Polynomial</span>
          </button>

          <button
            className={`nav-tab ${activePage === 'comparison' ? 'active' : ''}`}
            onClick={() => setActivePage('comparison')}
            title="Compare All Models"
          >
            <Scale size={16} />
            <span>Compare</span>
          </button>

          <button
            className={`nav-tab ${activePage === 'about' ? 'active' : ''}`}
            onClick={() => {
              setActivePage('about');
              if (setAboutSubTab) setAboutSubTab('svr');
            }}
            title="About All Models & Math"
          >
            <Info size={16} />
            <span>About Models</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
