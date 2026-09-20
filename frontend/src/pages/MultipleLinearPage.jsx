import { useState, useEffect } from 'react';
import StockChart from '../components/charts/StockChart';
import MultipleLinearForm from '../components/forms/MultipleLinearForm';
import ModelInfoPanel from '../components/models/ModelInfoPanel';
import { fetchMultipleLinearInfo, fetchHistoricalData } from '../services/api';

const MultipleLinearPage = ({ onNavigateToAbout }) => {
  const [openPrice, setOpenPrice] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchMultipleLinearInfo().then(setModelInfo).catch(console.error);
    fetchHistoricalData(50).then(setHistoryData).catch(console.error);
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="upper-section">
        <StockChart
          historyData={historyData}
          openPrice={openPrice}
          prediction={prediction}
          modelName="Multiple Linear Regression"
        />
      </div>

      <div className="lower-grid" style={{ marginTop: '2rem' }}>
        <MultipleLinearForm
          setPrediction={setPrediction}
          setOpenPrice={setOpenPrice}
          onNavigateToAbout={onNavigateToAbout}
        />
        <ModelInfoPanel modelInfo={modelInfo} />
      </div>
    </div>
  );
};

export default MultipleLinearPage;
