import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Switch,
} from 'react-native';
import { fetchTopMovers, getMarketStatus } from '../api/stockAPI';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

const StockCard = ({ stock, theme, isGainer }) => (
  <View style={[styles.card, { backgroundColor: isGainer ? colors[theme].success : colors[theme].danger }]}>
    <Text style={[styles.symbol, { color: colors[theme].text }]}>{stock.symbol}</Text>
    <Text style={[styles.price, { color: colors[theme].text }]}>${stock.price}</Text>
    <Text style={[styles.percent, { color: colors[theme].text }]}>
      {isGainer ? '+' : '-'}
      {Math.abs(stock.change)}%
    </Text>
  </View>
);

export default function HomeScreen() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [allGainers, setAllGainers] = useState([]);
  const [allLosers, setAllLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketStatus, setMarketStatus] = useState(null);

  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { topGainers, topLosers, allGainers, allLosers } = await fetchTopMovers();
        setGainers(topGainers);
        setLosers(topLosers);
        setAllGainers(allGainers);
        setAllLosers(allLosers);

        const market = await getMarketStatus();
        if (market?.markets) {
          const primaryMarket = market.markets.find(
            (m) =>
              m.market_type.toLowerCase() === 'equity' &&
              m.region.toLowerCase() === 'united states'
          );
          setMarketStatus(primaryMarket?.current_status || 'Unknown');
        }
      } catch (err) {
        console.error('Error loading data:', err.message);
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
      <View style={styles.toggleWrapper}>
        <Text style={{ color: colors[theme].text, marginRight: 8 }}>Dark Mode</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View>

      {marketStatus && (
        <Text style={[styles.marketStatus, { color: marketStatus === 'open' ? 'green' : 'red' }]}>
          Market is currently: {marketStatus.toUpperCase()}
        </Text>
      )}

      <View style={styles.rowBetween}>
        <Text style={[styles.header, { color: colors[theme].text }]}>Top Gainers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAllScreen', { type: 'gainers', data: allGainers })}>
          <Text style={[styles.viewAll, { color: colors[theme].primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={gainers}
        numColumns={2}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <StockCard stock={item} theme={theme} isGainer />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />

      <View style={styles.rowBetween}>
        <Text style={[styles.header, { color: colors[theme].text }]}>Top Losers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAllScreen', { type: 'losers', data: allLosers })}>
          <Text style={[styles.viewAll, { color: colors[theme].primary }]}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={losers}
        numColumns={2}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <StockCard stock={item} theme={theme} isGainer={false} />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
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
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    minWidth: 150,
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
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  marketStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
});
