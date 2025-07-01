import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = 'watchlistFolders';

export const getFolders = async () => {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  return Object.keys(parsed);
};

export const getFolderItems = async (folder) => {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  const parsed = raw ? JSON.parse(raw) : {};
  return parsed[folder] || [];
};

export const addToFolder = async (symbol, folder) => {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  const data = raw ? JSON.parse(raw) : {};
  data[folder] = Array.from(new Set([...(data[folder] || []), symbol]));
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(data));
};

export const removeFromFolder = async (symbol, folder) => {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  const data = raw ? JSON.parse(raw) : {};
  data[folder] = (data[folder] || []).filter((s) => s !== symbol);
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(data));
};
