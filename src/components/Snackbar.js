import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function Snackbar({ message, visible }) {
  const slideAnim = new Animated.Value(visible ? 0 : 100);

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.snackbar, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});
