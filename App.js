import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigation/TabNavigator';
import ProductScreen from './src/screens/ProductScreen';
import FolderDetailScreen from './src/screens/FolderDetailScreen'; // ✅ Add this
import { ThemeProvider } from './src/context/ThemeContext'; // ✅ Corrected path

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main tab navigator */}
          <Stack.Screen name="Tabs" component={TabNavigator} />
          
          {/* Product screen */}
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          
          {/* Folder detail screen */}
          <Stack.Screen name="FolderDetailScreen" component={FolderDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
