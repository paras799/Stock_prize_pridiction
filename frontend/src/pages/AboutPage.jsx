import { useState, useEffect } from 'react';
import { Sliders, TrendingUp, BarChart2, Layers, BookOpen } from 'lucide-react';
import SvrAbout from '../components/models/SvrAbout';
import SimpleLinearAbout from '../components/models/SimpleLinearAbout';
import MultipleLinearAbout from '../components/models/MultipleLinearAbout';
import PolynomialAbout from '../components/models/PolynomialAbout';
import {
  fetchSVRMetrics,
  fetchSimpleLinearMetrics,
  fetchMultipleLinearMetrics,
  fetchPolynomialMetrics
} from '../services/api';

const AboutPage = ({ defaultSubTab = 'svr' }) => {
  const [activeSubTab, setActiveSubTab] = useState(defaultSubTab);
  const [svrMetrics, setSvrMetrics] = useState(null);
  const [simpleMetrics, setSimpleMetrics] = useState(null);
  const [multiMetrics, setMultiMetrics] = useState(null);
  const [polyMetrics, setPolyMetrics] = useState(null);

  useEffect(() => {
    setActiveSubTab(defaultSubTab);
  }, [defaultSubTab]);

  useEffect(() => {
    fetchSVRMetrics().then(setSvrMetrics).catch(console.error);
    fetchSimpleLinearMetrics().then(setSimpleMetrics).catch(console.error);
    fetchMultipleLinearMetrics().then(setMultiMetrics).catch(console.error);
    fetchPolynomialMetrics().then(setPolyMetrics).catch(console.error);
  }, []);

  return (
    <div className="about-page-container animate-fade-in">
      <div className="about-subnav glass-panel">
        <div className="subnav-header">
          <BookOpen size={20} color="var(--primary)" />
          <span>Select Model Architecture Explanation:</span>
        </div>
        <div className="subnav-tabs">
          <button
            className={`subnav-btn ${activeSubTab === 'svr' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('svr')}
          >
            <Sliders size={15} />
            <span>SVR Model</span>
          </button>

          <button
            className={`subnav-btn ${activeSubTab === 'simple-linear' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('simple-linear')}
          >
            <TrendingUp size={15} />
            <span>Simple Linear</span>
          </button>

          <button
            className={`subnav-btn ${activeSubTab === 'multiple-linear' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('multiple-linear')}
          >
            <BarChart2 size={15} />
            <span>Multiple Linear</span>
          </button>

          <button
            className={`subnav-btn ${activeSubTab === 'polynomial' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('polynomial')}
          >
            <Layers size={15} />
            <span>Polynomial</span>
          </button>
        </div>
      </div>

      <div className="about-tab-content">
        {activeSubTab === 'svr' && <SvrAbout metrics={svrMetrics} />}
        {activeSubTab === 'simple-linear' && <SimpleLinearAbout metrics={simpleMetrics} />}
        {activeSubTab === 'multiple-linear' && <MultipleLinearAbout metrics={multiMetrics} />}
        {activeSubTab === 'polynomial' && <PolynomialAbout metrics={polyMetrics} />}
      </div>
    </div>
  );
};

export default AboutPage;
