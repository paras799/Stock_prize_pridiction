import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  LineSeries,
  LineStyle,
  CrosshairMode,
} from 'lightweight-charts';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  TrendingUp,
  Coins,
  Globe,
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/formatters';

const ASSET_SYMBOLS = {
  reliance: { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', initials: 'RE', color: '#2563EB', icon: TrendingUp },
  bitcoin: { symbol: 'BTC/USD', name: 'Bitcoin Crypto', initials: 'BTC', color: '#F59E0B', icon: Coins },
  google: { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', initials: 'GO', color: '#4285F4', icon: Globe },
};

const FinancialChart = ({
  historicalData,
  metadata,
  predictionData,
  currency = 'USD',
  assetName = '',
  selectedModelKey = 'svr',
  activeTab = 'historical', // 'historical' | 'validation'
}) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const closeSeriesRef = useRef(null);
  const openSeriesRef = useRef(null);
  const predictionSeriesRef = useRef(null);
  const legendRef = useRef(null);
  const tooltipRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeRange, setActiveRange] = useState(100);

  // Extract Asset Metadata & Symbols
  const assetId = historicalData?.asset_id || predictionData?.asset_id || 'reliance';
  const assetMeta = ASSET_SYMBOLS[assetId] || {
    symbol: assetId.toUpperCase(),
    name: assetName || historicalData?.asset_name || 'Stock Asset',
    initials: assetId.substring(0, 2).toUpperCase(),
    color: '#2563EB',
    icon: TrendingUp,
  };

  const AssetIcon = assetMeta.icon || TrendingUp;

  // Historical Records Sanitization
  const rawRecordsJson = JSON.stringify(historicalData?.data || []);
  const sanitizedRecords = React.useMemo(() => {
    let rawRecords = [];
    try {
      rawRecords = JSON.parse(rawRecordsJson);
    } catch {
      rawRecords = [];
    }
    if (!Array.isArray(rawRecords) || rawRecords.length === 0) return [];
    
    const map = new Map();
    rawRecords.forEach((item) => {
      let dateStr = item.date || item.time || item.Date;
      if (typeof dateStr === 'string') {
        dateStr = dateStr.substring(0, 10);
      }
      if (dateStr && !isNaN(Date.parse(dateStr))) {
        map.set(dateStr, item);
      }
    });

    const sortedDates = Array.from(map.keys()).sort((a, b) => new Date(a) - new Date(b));
    return sortedDates.map((date) => {
      const orig = map.get(date);
      return {
        date,
        open: typeof orig.open === 'number' ? orig.open : parseFloat(orig.open || 0),
        close: typeof orig.close === 'number' ? orig.close : parseFloat(orig.close || 0),
      };
    });
  }, [rawRecordsJson]);

  // Latest Session Price & Change
  const latestSession = sanitizedRecords.length > 0 ? sanitizedRecords[sanitizedRecords.length - 1] : null;
  const prevSession = sanitizedRecords.length > 1 ? sanitizedRecords[sanitizedRecords.length - 2] : null;
  
  const latestPrice = latestSession?.close || 0;
  const prevPrice = prevSession?.close || latestSession?.open || latestPrice;
  const priceChange = latestPrice - prevPrice;
  const percentChange = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Selected ML Model Prediction Data
  const currentModelKey = selectedModelKey || predictionData?.recommended_best_model || 'svr';
  const currentPrediction = predictionData?.predictions?.[currentModelKey];
  const testSamplesArr = predictionData?.models?.[currentModelKey]?.test_samples || metadata?.models?.[currentModelKey]?.test_samples || [];
  const testSamplesJson = JSON.stringify(testSamplesArr);
  const testSamples = React.useMemo(() => {
    try { return JSON.parse(testSamplesJson); } catch { return []; }
  }, [testSamplesJson]);

  // Helper to format top header legend
  const formatLegendHTML = useCallback(
    (date, open, close, change, changePct) => {
      const openStr = open !== undefined ? formatCurrency(open, currency) : 'N/A';
      const closeStr = close !== undefined ? formatCurrency(close, currency) : 'N/A';
      let diffStr = '';
      if (change !== undefined && changePct !== undefined) {
        const sign = change >= 0 ? '+' : '';
        const colorClass = change >= 0 ? 'text-emerald' : 'text-rose';
        diffStr = `<span class="${colorClass}">${sign}${formatCurrency(change, currency)} (${formatPercent(changePct)})</span>`;
      }

      return `
        <div class="hover-legend-content">
          <span class="legend-date">${date || 'Latest'}</span>
          <span class="legend-divider">|</span>
          <span class="legend-item"><span class="legend-label">Open:</span> <strong>${openStr}</strong></span>
          <span class="legend-divider">|</span>
          <span class="legend-item"><span class="legend-label">Close:</span> <strong>${closeStr}</strong></span>
          ${diffStr ? `<span class="legend-divider">|</span><span class="legend-item">${diffStr}</span>` : ''}
        </div>
      `;
    },
    [currency]
  );

  // Helper to format black semi-transparent floating tooltip box
  const formatFloatingTooltipHTML = useCallback(
    (date, open, close, change, changePct) => {
      const openStr = open !== undefined ? formatCurrency(open, currency) : 'N/A';
      const closeStr = close !== undefined ? formatCurrency(close, currency) : 'N/A';
      let diffRow = '';
      if (change !== undefined && changePct !== undefined) {
        const sign = change >= 0 ? '+' : '';
        const colorClass = change >= 0 ? 'tt-emerald' : 'tt-rose';
        diffRow = `
          <div class="tt-row">
            <span class="tt-label">Change:</span>
            <span class="tt-val ${colorClass}">${sign}${formatCurrency(change, currency)} (${formatPercent(changePct)})</span>
          </div>
        `;
      }

      return `
        <div class="tt-date">${date || 'Latest Session'}</div>
        <div class="tt-row">
          <span class="tt-label">Open Price:</span>
          <span class="tt-val">${openStr}</span>
        </div>
        <div class="tt-row">
          <span class="tt-label">Close Price:</span>
          <span class="tt-val tt-bold">${closeStr}</span>
        </div>
        ${diffRow}
      `;
    },
    [currency]
  );

  // Initialize TradingView Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart if present
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    const container = chartContainerRef.current;
    const width = container.clientWidth || 800;
    const height = isFullscreen ? window.innerHeight - 140 : 380;

    const chart = createChart(container, {
      width,
      height,
      layout: {
        background: { color: '#FFFFFF' },
        textColor: '#475569',
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      },
      grid: {
        vertLines: { color: '#F1F5F9', style: LineStyle.Solid },
        horzLines: { color: '#F1F5F9', style: LineStyle.Solid },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#94A3B8',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#0F172A',
        },
        horzLine: {
          color: '#94A3B8',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#0F172A',
        },
      },
      rightPriceScale: {
        borderColor: '#E2E8F0',
        scaleMargins: { top: 0.15, bottom: 0.12 },
        autoScale: true,
      },
      timeScale: {
        borderColor: '#E2E8F0',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
        barSpacing: 8,
        minBarSpacing: 2,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartInstanceRef.current = chart;

    if (activeTab === 'historical' && sanitizedRecords.length > 0) {
      // 1. Primary Close Price Line Series
      const closeSeries = chart.addSeries(LineSeries, {
        color: '#2563EB', // Royal Blue
        lineWidth: 2.5,
        title: 'Actual Close',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
      closeSeriesRef.current = closeSeries;

      const closeData = sanitizedRecords.map((r) => ({
        time: r.date,
        value: r.close,
      }));
      closeSeries.setData(closeData);

      // 2. Secondary Open Price Line Series
      const openSeries = chart.addSeries(LineSeries, {
        color: '#7C3AED', // Violet
        lineWidth: 1.5,
        title: 'Actual Open',
        priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
      });
      openSeriesRef.current = openSeries;

      const openData = sanitizedRecords.map((r) => ({
        time: r.date,
        value: r.open,
      }));
      openSeries.setData(openData);

      // 3. ML Model Predicted Close Line Series (Dashed line starting at last actual date)
      if (currentPrediction && currentPrediction.predicted_close) {
        const lastRec = sanitizedRecords[sanitizedRecords.length - 1];
        if (lastRec) {
          const lastD = new Date(lastRec.date);
          lastD.setDate(lastD.getDate() + 1);
          if (lastD.getDay() === 6) lastD.setDate(lastD.getDate() + 2);
          if (lastD.getDay() === 0) lastD.setDate(lastD.getDate() + 1);
          const nextDateStr = lastD.toISOString().substring(0, 10);

          const predSeries = chart.addSeries(LineSeries, {
            color: '#DC2626', // Rose Red dashed
            lineWidth: 2,
            lineStyle: LineStyle.Dashed,
            title: `Predicted Close (${currentPrediction.model_name || currentModelKey})`,
            priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
          });
          predictionSeriesRef.current = predSeries;

          predSeries.setData([
            { time: lastRec.date, value: lastRec.close },
            { time: nextDateStr, value: currentPrediction.predicted_close },
          ]);
        }
      }
    } else if (activeTab === 'validation' && testSamples.length > 0) {
      // Validation Mode: Actual Close vs Predicted Close across holdout test dates
      const actualSeries = chart.addSeries(LineSeries, {
        color: '#059669', // Emerald
        lineWidth: 2.5,
        title: 'Actual Close',
      });
      const actualData = testSamples.map((s) => ({
        time: s.date ? String(s.date).substring(0, 10) : '2026-01-01',
        value: s.actualClose,
      }));
      actualSeries.setData(actualData);

      const predSeries = chart.addSeries(LineSeries, {
        color: '#DC2626', // Rose Red dashed
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        title: `Predicted Close (${currentModelKey})`,
      });
      const predData = testSamples.map((s) => ({
        time: s.date ? String(s.date).substring(0, 10) : '2026-01-01',
        value: s.predictedClose,
      }));
      predSeries.setData(predData);
    }

    // Default Visible Logical Range
    const timeScale = chart.timeScale();
    timeScale.fitContent();

    // Subscribe to Crosshair Move for top legend & floating black transparent box
    chart.subscribeCrosshairMove((param) => {
      // 1. Reset if cursor is outside container
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > width ||
        param.point.y < 0 ||
        param.point.y > height
      ) {
        if (legendRef.current && latestSession) {
          legendRef.current.innerHTML = formatLegendHTML(
            latestSession.date,
            latestSession.open,
            latestSession.close,
            priceChange,
            percentChange
          );
        }
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
        return;
      }

      // Extract cursor date & series values
      const dateStr = typeof param.time === 'string' ? param.time : String(param.time);
      let openVal;
      let closeVal;

      if (closeSeriesRef.current && param.seriesData.get(closeSeriesRef.current)) {
        closeVal = param.seriesData.get(closeSeriesRef.current).value;
      }
      if (openSeriesRef.current && param.seriesData.get(openSeriesRef.current)) {
        openVal = param.seriesData.get(openSeriesRef.current).value;
      }

      const pointChange = openVal !== undefined && closeVal !== undefined ? closeVal - openVal : undefined;
      const pointChangePct = openVal && pointChange !== undefined ? (pointChange / openVal) * 100 : undefined;

      // Update Top Header Legend
      if (legendRef.current) {
        legendRef.current.innerHTML = formatLegendHTML(
          dateStr,
          openVal,
          closeVal,
          pointChange,
          pointChangePct
        );
      }

      // Update Black Semi-Transparent Floating Overlay Tooltip Box
      if (tooltipRef.current) {
        const tooltipWidth = 190;
        const tooltipHeight = 110;
        let left = param.point.x + 15;
        if (left + tooltipWidth > width) {
          left = param.point.x - tooltipWidth - 15;
        }
        let top = param.point.y + 15;
        if (top + tooltipHeight > height) {
          top = param.point.y - tooltipHeight - 15;
        }

        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = left + 'px';
        tooltipRef.current.style.top = top + 'px';
        tooltipRef.current.innerHTML = formatFloatingTooltipHTML(
          dateStr,
          openVal,
          closeVal,
          pointChange,
          pointChangePct
        );
      }
    });

    // ResizeObserver for Container Resizing
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0 || !chartInstanceRef.current) return;
      const newWidth = entries[0].contentRect.width;
      const newHeight = isFullscreen ? window.innerHeight - 140 : 380;
      chartInstanceRef.current.applyOptions({ width: newWidth, height: newHeight });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [sanitizedRecords, activeTab, testSamples, currentPrediction, isFullscreen, currentModelKey, formatLegendHTML, formatFloatingTooltipHTML, priceChange, percentChange, latestSession]);

  // Handle Range Selection (30D, 60D, 100D)
  const handleSetRange = (days) => {
    setActiveRange(days);
    if (!chartInstanceRef.current || sanitizedRecords.length === 0) return;

    const total = sanitizedRecords.length;
    const timeScale = chartInstanceRef.current.timeScale();
    const fromIndex = Math.max(0, total - days);
    timeScale.setVisibleLogicalRange({
      from: fromIndex,
      to: total - 1,
    });
  };

  // Auto Scale / Fit Content
  const handleAutoScale = () => {
    if (!chartInstanceRef.current) return;
    chartInstanceRef.current.priceScale('right').applyOptions({ autoScale: true });
    chartInstanceRef.current.timeScale().fitContent();
  };

  // Reset View
  const handleResetView = () => {
    if (!chartInstanceRef.current) return;
    handleSetRange(100);
    chartInstanceRef.current.priceScale('right').applyOptions({ autoScale: true });
  };

  return (
    <div className={`financial-chart-wrapper ${isFullscreen ? 'fullscreen-overlay' : ''}`}>
      {/* 1. Professional Stock Header */}
      <div className="chart-stock-header">
        <div className="stock-info-main">
          {/* Logo / Avatar Badge */}
          <div
            className="stock-logo-badge"
            style={{ backgroundColor: assetMeta.color }}
          >
            {assetMeta.initials}
          </div>
          <div>
            <div className="stock-title-row">
              <h3 className="stock-full-name">{assetMeta.name}</h3>
              <span className="stock-ticker-symbol">{assetMeta.symbol}</span>
            </div>
            <div className="stock-price-row">
              <span className="stock-current-price">
                {formatCurrency(latestPrice, currency)}
              </span>
              <span className={`stock-price-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '+' : ''}
                {formatCurrency(priceChange, currency)} ({formatPercent(percentChange)})
              </span>
            </div>
          </div>
        </div>

        <div className="chart-header-right">
          <div className="market-status-pill">
            <span className="status-live-dot"></span>
            <span>Market Data Synced</span>
          </div>
        </div>
      </div>

      {/* 2. Top Compact Hover Info Legend Bar */}
      <div className="chart-hover-legend-bar" ref={legendRef}>
        <div className="hover-legend-content">
          <span className="legend-date">{latestSession?.date || 'Latest'}</span>
          <span className="legend-divider">|</span>
          <span className="legend-item">
            <span className="legend-label">Open:</span> <strong>{formatCurrency(latestSession?.open || 0, currency)}</strong>
          </span>
          <span className="legend-divider">|</span>
          <span className="legend-item">
            <span className="legend-label">Close:</span> <strong>{formatCurrency(latestPrice, currency)}</strong>
          </span>
          <span className="legend-divider">|</span>
          <span className="legend-item">
            <span className={isPositive ? 'text-emerald' : 'text-rose'}>
              {isPositive ? '+' : ''}{formatCurrency(priceChange, currency)} ({formatPercent(percentChange)})
            </span>
          </span>
        </div>
      </div>

      {/* 3. Toolbar: Range & Scale Buttons */}
      <div className="chart-control-toolbar">
        <div className="toolbar-group">
          <button
            className={`toolbar-btn ${activeRange === 30 ? 'active' : ''}`}
            onClick={() => handleSetRange(30)}
            title="Show last 30 trading days"
          >
            30D
          </button>
          <button
            className={`toolbar-btn ${activeRange === 60 ? 'active' : ''}`}
            onClick={() => handleSetRange(60)}
            title="Show last 60 trading days"
          >
            60D
          </button>
          <button
            className={`toolbar-btn ${activeRange === 100 ? 'active' : ''}`}
            onClick={() => handleSetRange(100)}
            title="Show last 100 trading days"
          >
            100D
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            className="toolbar-btn text-btn"
            onClick={handleAutoScale}
            title="Auto-scale price axis to fit content"
          >
            <SlidersHorizontal size={13} />
            <span>Auto Scale</span>
          </button>
          <button
            className="toolbar-btn text-btn"
            onClick={handleResetView}
            title="Reset chart zoom and range"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          <button
            className="toolbar-btn icon-only-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* 4. Canvas Chart Container with Top-Left Selected Asset Badge & Bottom-Left QuantAI Watermark */}
      <div
        className="tradingview-chart-canvas"
        ref={chartContainerRef}
        style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 150px)' : '380px' }}
      >
        {/* Selected Stock / Crypto Logo Badge Overlay in Top-Left Corner */}
        <div className="chart-canvas-top-left-badge">
          <div
            className="canvas-asset-icon-box"
            style={{ backgroundColor: assetMeta.color }}
          >
            <AssetIcon size={14} />
          </div>
          <div className="canvas-asset-text-box">
            <span className="canvas-asset-title">{assetMeta.name}</span>
            <span className="canvas-asset-sub">{assetMeta.symbol}</span>
          </div>
        </div>

        {/* Semi-Transparent Black Floating Hover Tooltip Box */}
        <div className="chart-floating-tooltip" ref={tooltipRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default FinancialChart;
