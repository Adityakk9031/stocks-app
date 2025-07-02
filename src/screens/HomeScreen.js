import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import { fetchTopMovers } from '../api/stockAPI';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

const GainerCard = ({ stock, theme }) => (
  <View style={[styles.card, { backgroundColor: colors[theme].success }]}>
    <Text style={[styles.symbol, { color: colors[theme].text }]}>{stock.symbol}</Text>
    <Text style={[styles.price, { color: colors[theme].text }]}>${stock.price}</Text>
    <Text style={[styles.percent, { color: colors[theme].text }]}>+{stock.change}%</Text>
  </View>
);

const LoserCard = ({ stock, theme }) => (
  <View style={[styles.card, { backgroundColor: colors[theme].danger }]}>
    <Text style={[styles.symbol, { color: colors[theme].text }]}>{stock.symbol}</Text>
    <Text style={[styles.price, { color: colors[theme].text }]}>${stock.price}</Text>
    <Text style={[styles.percent, { color: colors[theme].text }]}>-{Math.abs(stock.change)}%</Text>
  </View>
);

export default function HomeScreen() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { topGainers, topLosers } = await fetchTopMovers();
        setGainers(topGainers);
        setLosers(topLosers);
      } catch (err) {
        console.error('Error loading movers:', err.message);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors[theme].background }]}>
        <ActivityIndicator size="large" color={colors[theme].primary} />
        <Text style={{ color: colors[theme].text }}>Loading stock data...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <View style={styles.themeToggleRow}>
        <Text style={[styles.header, { color: colors[theme].text }]}>Top Gainers</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>

      <FlatList
        data={gainers}
        horizontal
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <GainerCard stock={item} theme={theme} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={[styles.header, { color: colors[theme].text }]}>Top Losers</Text>
      <FlatList
        data={losers}
        horizontal
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <LoserCard stock={item} theme={theme} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
  },
  themeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: 130,
    marginRight: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  percent: {
    marginTop: 4,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
