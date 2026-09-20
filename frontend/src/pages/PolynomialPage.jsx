import { useState, useEffect } from 'react';
import StockChart from '../components/charts/StockChart';
import PolynomialForm from '../components/forms/PolynomialForm';
import ModelInfoPanel from '../components/models/ModelInfoPanel';
import { fetchPolynomialInfo, fetchHistoricalData } from '../services/api';

const PolynomialPage = ({ onNavigateToAbout }) => {
  const [openPrice, setOpenPrice] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchPolynomialInfo().then(setModelInfo).catch(console.error);
    fetchHistoricalData(50).then(setHistoryData).catch(console.error);
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="upper-section">
        <StockChart
          historyData={historyData}
          openPrice={openPrice}
          prediction={prediction}
          modelName="Polynomial Regression (Degree 2)"
        />
      </div>

      <div className="lower-grid" style={{ marginTop: '2rem' }}>
        <PolynomialForm
          setPrediction={setPrediction}
          setOpenPrice={setOpenPrice}
          onNavigateToAbout={onNavigateToAbout}
        />
        <ModelInfoPanel modelInfo={modelInfo} />
      </div>
    </div>
  );
};

export default PolynomialPage;
