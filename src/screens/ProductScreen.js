import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions, TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { getCompanyOverview, getStockIntraday } from '../api/stockAPI';
import WatchlistModal from '../components/WatchlistModal';
import { getFolders, getFolderItems, removeFromFolder } from '../storage/watchlistStorage';

const screenWidth = Dimensions.get('window').width;

export default function ProductScreen({ route }) {
  const { symbol } = route.params;
  const [overview, setOverview] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [foldersContainingStock, setFoldersContainingStock] = useState([]);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const company = await getCompanyOverview(symbol);
      const intraday = await getStockIntraday(symbol);
      setOverview(company);
      setGraphData(intraday);
      setLoading(false);
    };

    const checkWatchlistFolders = async () => {
      const allFolders = await getFolders();
      const result = [];

      for (const folder of allFolders) {
        const items = await getFolderItems(folder);
        if (items.includes(symbol)) {
          result.push(folder);
        }
      }

      setFoldersContainingStock(result);
    };

    loadDetails();
    checkWatchlistFolders();
  }, [symbol]);

  const handleRemoveFromAll = async () => {
    for (const folder of foldersContainingStock) {
      await removeFromFolder(symbol, folder);
    }
    setFoldersContainingStock([]);
  };

  const handleAddToWatchlist = () => {
    setModalVisible(true);
  };

  const handleModalClose = async () => {
    setModalVisible(false);

    // Refresh folders after modal closes
    const allFolders = await getFolders();
    const result = [];

    for (const folder of allFolders) {
      const items = await getFolderItems(folder);
      if (items.includes(symbol)) {
        result.push(folder);
      }
    }

    setFoldersContainingStock(result);
  };

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
  const isInAnyFolder = foldersContainingStock.length > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{overview.Name}</Text>
      <Text style={styles.symbol}>{overview.Symbol}</Text>
      <Text style={styles.industry}>{overview.Industry}</Text>
      <Text style={styles.description}>{overview.Description}</Text>

      <TouchableOpacity
        style={[
          styles.watchlistButton,
          { backgroundColor: isInAnyFolder ? 'red' : '#007AFF' },
        ]}
        onPress={isInAnyFolder ? handleRemoveFromAll : handleAddToWatchlist}
      >
        <Ionicons
          name={isInAnyFolder ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.watchlistButtonText}>
          {isInAnyFolder ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Text>
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

      <WatchlistModal
        visible={modalVisible}
        onClose={handleModalClose}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  watchlistButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
