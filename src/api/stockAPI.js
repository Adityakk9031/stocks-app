import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';
const KEYS = {
  DAILY: '04BP0FF6PUWG61RH',
  SEARCH: 'FRENRIBTPXSUR6ZQ',
  OVERVIEW: '91F2CB6SPM46UP7F',
  INTRADAY: 'HET768QJ7P8UDH9W',
};

const fetchFromAlpha = async (params, key) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { ...params, apikey: key },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const fetchTopMovers = async () => {
  const symbols = [
    'AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN'
    // 'NVDA', 'META', 'NFLX', 'ORCL', 'INTC',
    // 'ADBE', 'CRM', 'PEP', 'KO', 'WMT',
    // 'NKE', 'PYPL', 'T', 'BABA', 'DIS'
  ];

  const results = [];

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    const res = await fetchFromAlpha({
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'compact',
    }, KEYS.DAILY);

    const timeSeries = res?.['Time Series (Daily)'];
    if (!timeSeries) continue;

    const dates = Object.keys(timeSeries);
    const latest = parseFloat(timeSeries[dates[0]]['4. close']);
    const prev = parseFloat(timeSeries[dates[1]]['4. close']);
    const change = ((latest - prev) / prev) * 100;

    results.push({
      symbol,
      price: latest.toFixed(2),
      change: change.toFixed(2),
    });

    if ((i + 1) % 5 === 0) {
      await new Promise((r) => setTimeout(r, 65000));
    }
  }

  return {
    topGainers: [...results].sort((a, b) => b.change - a.change).slice(0, 4),
    topLosers: [...results].sort((a, b) => a.change - b.change).slice(0, 4),
  };
};

export const searchStocks = async (keyword) => {
  const res = await fetchFromAlpha({
    function: 'SYMBOL_SEARCH',
    keywords: keyword,
  }, KEYS.SEARCH);

  return res?.bestMatches || [];
};

export const getCompanyOverview = async (symbol) => {
  const res = await fetchFromAlpha({
    function: 'OVERVIEW',
    symbol,
  }, KEYS.OVERVIEW);

  return res;
};

export const getStockIntraday = async (symbol, interval = '5min') => {
  const res = await fetchFromAlpha({
    function: 'TIME_SERIES_INTRADAY',
    symbol,
    interval,
    outputsize: 'compact',
  }, KEYS.INTRADAY);

  const raw = res?.[`Time Series (${interval})`];
  if (!raw) return [];

  return Object.entries(raw).map(([time, value]) => ({
    time,
    price: parseFloat(value['4. close']),
  })).reverse();
};

export const getMarketStatus = async () => {
  const res = await fetchFromAlpha({
    function: 'MARKET_STATUS',
  }, KEYS.SEARCH);
  return res;
}; 