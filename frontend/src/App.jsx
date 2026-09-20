import { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SvrPage from './pages/SvrPage';
import SimpleLinearPage from './pages/SimpleLinearPage';
import MultipleLinearPage from './pages/MultipleLinearPage';
import PolynomialPage from './pages/PolynomialPage';
import ComparisonPage from './pages/ComparisonPage';
import AboutPage from './pages/AboutPage';
import { fetchComparisonMetrics } from './services/api';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('svr');
  const [aboutSubTab, setAboutSubTab] = useState('svr');
  const [comparisonMetrics, setComparisonMetrics] = useState(null);

  useEffect(() => {
    fetchComparisonMetrics()
      .then(setComparisonMetrics)
      .catch((err) => console.error('Failed to fetch comparison metrics', err));
  }, []);

  const handleNavigateToAbout = (modelKey) => {
    setAboutSubTab(modelKey);
    setActivePage('about');
  };

  const handleSelectModelFromComparison = (modelKey) => {
    setActivePage(modelKey);
  };

  return (
    <div className="container">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        setAboutSubTab={setAboutSubTab}
        comparisonMetrics={comparisonMetrics}
      />

      <main className="main-content">
        {activePage === 'svr' && (
          <SvrPage onNavigateToAbout={handleNavigateToAbout} />
        )}

        {activePage === 'simple-linear' && (
          <SimpleLinearPage onNavigateToAbout={handleNavigateToAbout} />
        )}

        {activePage === 'multiple-linear' && (
          <MultipleLinearPage onNavigateToAbout={handleNavigateToAbout} />
        )}

        {activePage === 'polynomial' && (
          <PolynomialPage onNavigateToAbout={handleNavigateToAbout} />
        )}

        {activePage === 'comparison' && (
          <ComparisonPage onSelectModel={handleSelectModelFromComparison} />
        )}

        {activePage === 'about' && (
          <AboutPage defaultSubTab={aboutSubTab} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
