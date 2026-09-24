import React from 'react';
import { Link } from '../router/RouterContext';
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react';

const ModelNavigation = ({ modelSlug, activeTab }) => {
  return (
    <div className="model-navigation-bar">
      <Link to="/models" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Models</span>
      </Link>

      <div className="model-tab-buttons">
        <Link
          to={`/models/${modelSlug}`}
          className={`model-nav-tab ${activeTab === 'prediction' ? 'active' : ''}`}
        >
          <Sparkles size={15} />
          <span>Prediction</span>
        </Link>
        <Link
          to={`/models/${modelSlug}/about`}
          className={`model-nav-tab ${activeTab === 'about' ? 'active' : ''}`}
        >
          <BookOpen size={15} />
          <span>About Model</span>
        </Link>
      </div>
    </div>
  );
};

export default ModelNavigation;
