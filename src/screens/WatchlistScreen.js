import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFolders } from '../storage/watchlistStorage'; // ✅ Corrected path

export default function WatchlistScreen() {
  const [folders, setFolders] = useState([]);
  const navigation = useNavigation();

  const loadFolders = async () => {
    const all = await getFolders();
    setFolders(all);
  };

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  if (!folders.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No folders yet. Add a stock to create one.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Watchlist Folders</Text>
      <FlatList
        data={folders}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FolderDetailScreen', { folder: item })}
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
