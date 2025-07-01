import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext('light');

export const ThemeProvider = ({ children }) => {
  const scheme = useColorScheme() || 'light';
  return <ThemeContext.Provider value={scheme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
