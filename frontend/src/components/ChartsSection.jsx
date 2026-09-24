import React from 'react';
import Chart from './Chart';

const ChartsSection = ({ historicalData, metadata, comparisonData, currency }) => {
  return (
    <Chart
      historicalData={historicalData}
      metadata={metadata}
      comparisonData={comparisonData}
      currency={currency}
    />
  );
};

export default ChartsSection;
