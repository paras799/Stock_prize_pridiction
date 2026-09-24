import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathFormula = ({ latex, fallbackText, title = 'Formal Mathematical Model' }) => {
  let html = '';
  try {
    if (latex) {
      html = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
      });
    }
  } catch (err) {
    console.error('KaTeX render error:', err);
  }

  return (
    <div className="math-concept-paper-card">
      <div className="math-paper-header">
        <span className="math-paper-badge">{title}</span>
      </div>

      <div className="math-paper-body">
        {html ? (
          <div
            className="katex-rendered-output"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="math-fallback-equation">{fallbackText || latex}</div>
        )}
      </div>

      {fallbackText && (
        <div className="math-paper-footer">
          <span className="paper-footnote-label">Expanded Notation:</span>
          <span className="paper-footnote-text">{fallbackText}</span>
        </div>
      )}
    </div>
  );
};

export default MathFormula;
