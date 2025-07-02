import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigation/TabNavigator';
import ProductScreen from './src/screens/ProductScreen';
import FolderDetailScreen from './src/screens/FolderDetailScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="FolderDetailScreen" component={FolderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
