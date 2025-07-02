import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFolders } from '../storage/watchlistStorage';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

export default function WatchlistScreen() {
  const [folders, setFolders] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const loadFolders = async () => {
    try {
      const all = await getFolders();
      setFolders(all);
    } catch (e) {
      console.error('Failed to load folders', e);
      setFolders([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFolders();
    }, [])
  );

  if (!folders.length) {
    return (
      <View style={[styles.centered, { backgroundColor: colors[theme].background }]}>
        <Text style={[styles.empty, { color: colors[theme].text }]}>
          No folders yet. Add a stock to create one.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <Text style={[styles.header, { color: colors[theme].text }]}>Watchlist Folders</Text>
      <FlatList
        data={folders}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors[theme].card }]}
            onPress={() =>
              navigation.navigate('FolderDetailScreen', { folder: item })
            }
          >
            <Text style={[styles.symbol, { color: colors[theme].text }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  symbol: { fontSize: 18, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { fontSize: 16 },
});
