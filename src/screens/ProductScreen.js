// ProductScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCompanyOverview, getStockIntraday } from '../api/stockAPI';
import WatchlistModal from '../components/WatchlistModal'; // ✅ IMPORT MODAL

const screenWidth = Dimensions.get('window').width;

export default function ProductScreen({ route }) {
  const { symbol } = route.params;
  const [overview, setOverview] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false); // ✅ MODAL
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const company = await getCompanyOverview(symbol);
      const intraday = await getStockIntraday(symbol);
      setOverview(company);
      setGraphData(intraday);
      setLoading(false);
    };

    const checkWatchlist = async () => {
      const stored = await AsyncStorage.getItem('watchlist');
      const parsed = stored ? JSON.parse(stored) : [];
      setIsInWatchlist(parsed.includes(symbol));
    };

    loadDetails();
    checkWatchlist();
  }, [symbol]);

  if (loading || !overview || graphData.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading stock details...</Text>
      </View>
    );
  }

  const prices = graphData.map((item) => item.price);
  const labels = graphData.map((item) => item.time.split(' ')[1]).slice(0, 6);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{overview.Name}</Text>
      <Text style={styles.symbol}>{overview.Symbol}</Text>
      <Text style={styles.industry}>{overview.Industry}</Text>
      <Text style={styles.description}>{overview.Description}</Text>

      {/* ✅ Button to open WatchlistModal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.watchlistButton, { backgroundColor: '#007AFF' }]}
      >
        <Text style={styles.watchlistButtonText}>Add to Watchlist</Text>
      </TouchableOpacity>

      <Text style={styles.chartLabel}>Price Chart (Intraday)</Text>
      <LineChart
        data={{
          labels,
          datasets: [{ data: prices, color: () => '#007AFF', strokeWidth: 2 }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: () => '#555',
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      {/* ✅ Watchlist Modal */}
      <WatchlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        stock={symbol}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  symbol: { fontSize: 18, color: '#888', marginBottom: 4 },
  industry: { fontSize: 16, fontStyle: 'italic', marginBottom: 8 },
  description: { fontSize: 14, color: '#444', marginBottom: 16 },
  chartLabel: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  watchlistButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  watchlistButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
