// screens/FolderDetailScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getFolderItems } from '../storage/watchlistStorage'

export default function FolderDetailScreen() {
  const [stocks, setStocks] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { folder } = route.params;

  const loadStocks = async () => {
    const items = await getFolderItems(folder);
    setStocks(items);
  };

  useFocusEffect(
    useCallback(() => {
      loadStocks();
    }, [])
  );

  if (!stocks.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No stocks in "{folder}" yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{folder} Watchlist</Text>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductScreen', { symbol: item })}
          >
            <Text style={styles.symbol}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 8,
  },
  symbol: { fontSize: 18, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: 16, color: '#888' },
});
