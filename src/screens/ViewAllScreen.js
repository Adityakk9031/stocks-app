import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Button,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../constants/colors';

const PAGE_SIZE = 10;

export default function ViewAllScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { type, data: passedData } = route.params;
  const { theme } = useTheme();

  const [page, setPage] = useState(1);
  const paginatedData = passedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <Text style={[styles.title, { color: colors[theme].text }]}>
        {type === 'gainers' ? 'All Gainers' : 'All Losers'}
      </Text>

      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: type === 'gainers'
                  ? colors[theme].success
                  : colors[theme].danger,
              },
            ]}
            onPress={() => navigation.navigate('ProductScreen', { symbol: item.symbol })}
          >
            <Text style={[styles.symbol, { color: colors[theme].text }]}>{item.symbol}</Text>
            <Text style={[styles.name, { color: colors[theme].text }]}>{item.name}</Text>
            <Text style={[styles.sector, { color: colors[theme].text }]}>{item.sector}</Text>
            <Text style={[styles.price, { color: colors[theme].text }]}>${item.price}</Text>
            <Text style={[styles.percent, { color: colors[theme].text }]}>
              {type === 'gainers' ? '+' : '-'}
              {Math.abs(item.change)}%
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          color={colors[theme].primary}
        />
        <Text style={{ color: colors[theme].text }}>{`Page ${page}`}</Text>
        <Button
          title="Next"
          onPress={() => setPage((p) => (p * PAGE_SIZE < passedData.length ? p + 1 : p))}
          disabled={page * PAGE_SIZE >= passedData.length}
          color={colors[theme].primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  sector: {
    fontSize: 12,
    marginTop: 1,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
