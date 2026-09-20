import { useState, useEffect } from 'react';
import StockChart from '../components/charts/StockChart';
import SvrForm from '../components/forms/SvrForm';
import ModelInfoPanel from '../components/models/ModelInfoPanel';
import { fetchSVRInfo, fetchHistoricalData } from '../services/api';

const SvrPage = ({ onNavigateToAbout }) => {
  const [openPrice, setOpenPrice] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchSVRInfo().then(setModelInfo).catch(console.error);
    fetchHistoricalData(50).then(setHistoryData).catch(console.error);
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="upper-section">
        <StockChart
          historyData={historyData}
          openPrice={openPrice}
          prediction={prediction}
          modelName="Support Vector Regression (SVR)"
        />
      </div>

      <div className="lower-grid" style={{ marginTop: '2rem' }}>
        <SvrForm
          setPrediction={setPrediction}
          setOpenPrice={setOpenPrice}
          onNavigateToAbout={onNavigateToAbout}
        />
        <ModelInfoPanel modelInfo={modelInfo} />
      </div>
    </div>
  );
};

export default SvrPage;
