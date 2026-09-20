import { useState, useEffect } from 'react';
import StockChart from '../components/charts/StockChart';
import SimpleLinearForm from '../components/forms/SimpleLinearForm';
import ModelInfoPanel from '../components/models/ModelInfoPanel';
import { fetchSimpleLinearInfo, fetchHistoricalData } from '../services/api';

const SimpleLinearPage = ({ onNavigateToAbout }) => {
  const [openPrice, setOpenPrice] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    fetchSimpleLinearInfo().then(setModelInfo).catch(console.error);
    fetchHistoricalData(50).then(setHistoryData).catch(console.error);
  }, []);

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="upper-section">
        <StockChart
          historyData={historyData}
          openPrice={openPrice}
          prediction={prediction}
          modelName="Simple Linear Regression"
        />
      </div>

      <div className="lower-grid" style={{ marginTop: '2rem' }}>
        <SimpleLinearForm
          setPrediction={setPrediction}
          setOpenPrice={setOpenPrice}
          onNavigateToAbout={onNavigateToAbout}
        />
        <ModelInfoPanel modelInfo={modelInfo} />
      </div>
    </div>
  );
};

export default SimpleLinearPage;
