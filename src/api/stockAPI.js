import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://www.alphavantage.co/query';
const KEYS = {
  DAILY: '7IA1XEWDRNBBK686',
  SEARCH: 'R7WHJZQ93IP3FS7D',
  OVERVIEW: '8T4Q6CXDUZZ6JGTC',
  INTRADAY: 'W4OLXINN7YBI3M65',
  NEWS: 'PXTF1LLR2N2MPINW',
};


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


export const getCompanyOverview = async (symbol) =>
  await getWithCache(
    `overview-${symbol}`,
    () => fetchFromAlpha({ function: 'OVERVIEW', symbol }, KEYS.OVERVIEW),
    24 * 60 * 60 * 1000
  );


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


export const searchStocks = async (keyword) => {
  const res = await fetchFromAlpha({
    function: 'SYMBOL_SEARCH',
    keywords: keyword,
  }, KEYS.SEARCH);
  return res?.bestMatches || [];
};


export const getMarketStatus = async () => {
  const res = await fetchFromAlpha({
    function: 'MARKET_STATUS',
  }, KEYS.SEARCH);
  return res;
};


export const getNewsSentiment = async (symbol) =>
  await getWithCache(
    `news-${symbol}`,
    () =>
      fetchFromAlpha(
        {
          function: 'NEWS_SENTIMENT',
          tickers: symbol,
          sort: 'LATEST',
          limit: 5,
        },
        KEYS.NEWS // or you can use a dedicated NEWS key if you registered one
      ),
    30 * 60 * 1000 // 30 min cache
  );




export const fetchTopMovers = async () =>
  await getWithCache(
    'top-movers',
    async () => {
      const res = await fetchFromAlpha(
        { function: 'TOP_GAINERS_LOSERS' },
        KEYS.DAILY
      );

      const mapData = (list) =>
        list.map((item) => ({
          symbol: item.ticker,
          price: parseFloat(item.price).toFixed(2),
          change: parseFloat(item.change_percentage).toFixed(2),
        }));

      return {
        topGainers: mapData(res.top_gainers.slice(0, 4)),
        topLosers: mapData(res.top_losers.slice(0, 4)),
        allGainers: mapData(res.top_gainers),
        allLosers: mapData(res.top_losers),
      };
    },
    30 * 60 * 1000 // ⏱️ 30 minutes
  );

