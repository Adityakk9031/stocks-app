import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { fetchTopMovers } from '../api/stockAPI';
import { useNavigation } from '@react-navigation/native';

const GainerCard = ({ stock }) => (
  <View style={[styles.card, styles.gainer]}>
    <Text style={styles.symbol}>{stock.symbol}</Text>
    <Text style={styles.price}>${stock.price}</Text>
    <Text style={styles.percent}>+{stock.change}%</Text>
  </View>
);

const LoserCard = ({ stock }) => (
  <View style={[styles.card, styles.loser]}>
    <Text style={styles.symbol}>{stock.symbol}</Text>
    <Text style={styles.price}>${stock.price}</Text>
    <Text style={styles.percent}>-{Math.abs(stock.change)}%</Text>
  </View>
);

export default function HomeScreen() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading stock data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Gainers</Text>
      <FlatList
        data={gainers}
        horizontal
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <GainerCard stock={item} />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.header}>Top Losers</Text>
      <FlatList
        data={losers}
        horizontal
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}>
            <LoserCard stock={item} />
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
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 8,
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
  gainer: {
    backgroundColor: '#d1f7e2',
  },
  loser: {
    backgroundColor: '#fcd4d4',
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
