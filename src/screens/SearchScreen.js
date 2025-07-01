import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { searchStocks } from '../api/stockAPI';
import { useNavigation } from '@react-navigation/native';

// ✅ Debounce function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const debouncedSearch = debounce(async (text) => {
    setLoading(true);
    const res = await searchStocks(text);
    setResults(res);
    setLoading(false);
  }, 500);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search stocks or ETFs..."
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          debouncedSearch(text);
        }}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item['1. symbol']}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.result}
              onPress={() =>
                navigation.navigate('ProductScreen', {
                  symbol: item['1. symbol'],
                })
              }
            >
              <Text style={styles.symbol}>{item['1. symbol']}</Text>
              <Text style={styles.name}>{item['2. name']}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  result: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    color: '#444',
    fontSize: 14,
  },
});
