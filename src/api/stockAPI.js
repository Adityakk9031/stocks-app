import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://www.alphavantage.co/query';
const KEYS = {
  DAILY: ' LI4GLJ27OXA86IIA',
  SEARCH: '4NP64A36IH47DNSS',
  OVERVIEW: 'A7KON2J9J17BDBRK',
  INTRADAY: 'CTCC3YZQJQ6B2WOA',
};

// ✅ Generic fetch + cache with expiry
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

// ✅ Wrapper for Alpha Vantage API call
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

// ✅ Cache Overview for 24h
export const getCompanyOverview = async (symbol) =>
  await getWithCache(
    `overview-${symbol}`,
    () => fetchFromAlpha({ function: 'OVERVIEW', symbol }, KEYS.OVERVIEW),
    24 * 60 * 60 * 1000
  );

// ✅ Cache Intraday for 5 min
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

// ✅ Search stocks by keyword
export const searchStocks = async (keyword) => {
  const res = await fetchFromAlpha({
    function: 'SYMBOL_SEARCH',
    keywords: keyword,
  }, KEYS.SEARCH);
  return res?.bestMatches || [];
};

// ✅ Get market status (if needed)
export const getMarketStatus = async () => {
  const res = await fetchFromAlpha({
    function: 'MARKET_STATUS',
  }, KEYS.SEARCH);
  return res;
};

// ✅ Top movers with static meta info (supports Option 3)
export const fetchTopMovers = async () => {
  const symbols = [
    'AAPL', 'MSFT', 'TSLA', 'GOOGL', 'AMZN',
    'NVDA', 'META', 'NFLX', 'ORCL', 'INTC',
    'ADBE', 'CRM', 'PEP', 'KO', 'WMT',
    'NKE', 'PYPL', 'T', 'BABA', 'DIS'
  ];

  const results = [];

  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];

    // Price Change %
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

    // ✅ Meta info
    const overview = await getCompanyOverview(symbol);

    results.push({
      symbol,
      price: latest.toFixed(2),
      change: change.toFixed(2),
      name: overview?.Name || '', // fallback empty
      sector: overview?.Sector || '',
    });

    // ✅ Respect Alpha Vantage limit (5 calls/min)
    if ((i + 1) % 5 === 0) {
      await new Promise((r) => setTimeout(r, 65000));
    }
  }

  const sortedGainers = [...results].sort((a, b) => b.change - a.change);
  const sortedLosers = [...results].sort((a, b) => a.change - b.change);

  return {
    topGainers: sortedGainers.slice(0, 4),
    topLosers: sortedLosers.slice(0, 4),
    allGainers: sortedGainers,
    allLosers: sortedLosers,
  };
};
