import React, { useEffect, useRef } from 'react';
import katex from 'katex';

const MathFormula = ({ math, displayMode = true, fallback }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false,
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    }
  }, [math, displayMode]);

  return (
    <div
      style={{
        background: 'rgba(5, 9, 18, 0.75)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: displayMode ? '1.25rem' : '0.5rem 0.75rem',
        margin: displayMode ? '1rem 0' : '0',
        overflowX: 'auto',
        color: 'var(--neon-cyan)',
        fontFamily: 'var(--font-mono)',
        textAlign: displayMode ? 'center' : 'left',
      }}
    >
      <span ref={containerRef}>{fallback || math}</span>
    </div>
  );
};

export default MathFormula;
