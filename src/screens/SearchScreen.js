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
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

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
  const { theme } = useTheme();

  const debouncedSearch = debounce(async (text) => {
    setLoading(true);
    try {
      const res = await searchStocks(text);
      setResults(res);
    } catch (err) {
      console.error('Search error', err);
      setResults([]);
    }
    setLoading(false);
  }, 500);

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <TextInput
        placeholder="Search stocks or ETFs..."
        placeholderTextColor={colors[theme].text + '99'}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          debouncedSearch(text);
        }}
        style={[
          styles.input,
          {
            borderColor: colors[theme].card,
            color: colors[theme].text,
            backgroundColor: colors[theme].card,
          },
        ]}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors[theme].primary} />
      ) : results.length === 0 && query ? (
        <Text style={{ color: colors[theme].text, marginTop: 16 }}>No results found.</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item['1. symbol']}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.result, { borderBottomColor: colors[theme].card }]}
              onPress={() =>
                navigation.navigate('ProductScreen', {
                  symbol: item['1. symbol'],
                })
              }
            >
              <Text style={[styles.symbol, { color: colors[theme].text }]}>
                {item['1. symbol']}
              </Text>
              <Text style={[styles.name, { color: colors[theme].text }]}>
                {item['2. name']}
              </Text>
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
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  result: {
    padding: 14,
    borderBottomWidth: 1,
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  name: {
    fontSize: 14,
  },
});
