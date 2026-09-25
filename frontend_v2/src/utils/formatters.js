/**
 * Utility functions for formatting numbers, currency, percentages, and dates
 * with high precision and clean formatting for financial dashboards.
 */

export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  
  const symbolMap = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
    BTC: '₿',
  };

  const symbol = symbolMap[currency] || (currency ? `${currency} ` : '$');
  
  const num = Number(value);
  // If price is very large or very small, adjust decimals dynamically
  const fracDigits = decimals !== undefined ? decimals : num >= 1000 ? 2 : 4;
  
  const formattedNum = num.toLocaleString('en-US', {
    minimumFractionDigits: fracDigits,
    maximumFractionDigits: fracDigits,
  });

  return `${symbol}${formattedNum}`;
};

export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return 'N/A';
  const num = Number(value);
  const prefix = num > 0 ? '+' : '';
  return `${prefix}${num.toFixed(decimals)}%`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // fallback if string date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
