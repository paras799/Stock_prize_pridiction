export const formatCurrency = (val, currency = 'USD') => {
  if (val === undefined || val === null || isNaN(val)) return '-';
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (val, decimals = 2) => {
  if (val === undefined || val === null || isNaN(val)) return '-';
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${Number(val).toFixed(2)}%`;
};
