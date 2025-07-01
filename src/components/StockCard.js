import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export default function StockCard({ symbol, price, change, type = 'gainer' }) {
  const isGainer = type === 'gainer';
  return (
    <View style={[styles.card, { backgroundColor: isGainer ? colors.success : colors.danger }]}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.percent}>{isGainer ? '+' : '-'}{Math.abs(change)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});