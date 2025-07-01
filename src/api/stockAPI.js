import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://www.alphavantage.co/query';
const KEYS = {
  DAILY: 'Q9K1JHN4CLJZO673',
  SEARCH: '89SRGNX1DXKAKXL3',
  OVERVIEW: '9H4JPBLNC20DDC7C',
  INTRADAY: 'M0BEJP6YM6OVGU7N',
};

// ✅ AsyncStorage-based caching with expiry
const getWithCache = async (key, fetcher, expiryMs) => {
  const raw = await AsyncStorage.getItem(key);
  if (raw) {
    try {
      const { value, expiry } = JSON.parse(raw);
      if (Date.now() < expiry) return value;
    } catch (e) {
      console.warn('Failed to parse cache', e);
    }
  }

  const value = await fetcher();
  if (value) {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ value, expiry: Date.now() + expiryMs })
    );
  }
  return value;
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
  const symbols = ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN'];
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

// ✅ Caching Overview for 24 hours
export const getCompanyOverview = async (symbol) =>
  await getWithCache(
    `overview-${symbol}`,
    () => fetchFromAlpha({ function: 'OVERVIEW', symbol }, KEYS.OVERVIEW),
    24 * 60 * 60 * 1000
  );

// ✅ Caching Intraday for 5 minutes
export const getStockIntraday = async (symbol, interval = '5min') =>
  await getWithCache(
    `intraday-${symbol}`,
    async () => {
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
    },
    5 * 60 * 1000
  );

export const getMarketStatus = async () => {
  const res = await fetchFromAlpha({
    function: 'MARKET_STATUS',
  }, KEYS.SEARCH);
  return res;
};
