import React from 'react';
import { getModelBySlug, MODELS_LIST } from '../data/modelsData';
import ModelHeader from '../components/ModelHeader';
import ModelNavigation from '../components/ModelNavigation';
import AboutModelSection from '../components/AboutModelSection';
import { Link } from '../router/RouterContext';
import { Calculator, ArrowRight } from 'lucide-react';

const ModelAboutPage = ({ slug }) => {
  const model = getModelBySlug(slug) || MODELS_LIST[0];

  return (
    <div className="single-model-about-page">
      {/* Model Navigation Bar */}
      <ModelNavigation modelSlug={model.slug} activeTab="about" />

      {/* Header */}
      <ModelHeader model={model} />

      {/* 9 Detailed Educational Sections */}
      <AboutModelSection model={model} />

      {/* Bottom CTA to test predictions */}
      <div className="about-bottom-cta">
        <div className="cta-box-card">
          <h3>Ready to test predictions using {model.name}?</h3>
          <p>
            Execute live real-time price predictions or test custom market scenarios using the trained {model.name} engine.
          </p>
          <Link to={`/models/${model.slug}`} className="btn btn-primary btn-lg">
            <Calculator size={18} /> Execute {model.name} Prediction <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModelAboutPage;
