import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import FolderDetailScreen from '../screens/FolderDetailScreen';
import ProductScreen from '../screens/ProductScreen';
import ViewAllScreen from '../screens/ViewAllScreen'; // ✅ Added

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FolderDetailScreen"
        component={FolderDetailScreen}
        options={({ route }) => ({
          title: route.params?.folder || 'Folder Details',
        })}
      />
      <Stack.Screen
        name="ProductScreen"
        component={ProductScreen}
        options={({ route }) => ({
          title: route.params?.symbol || 'Stock Details',
        })}
      />
      <Stack.Screen
        name="ViewAllScreen"
        component={ViewAllScreen}
        options={({ route }) => ({
          title: route.params?.type === 'gainers' ? 'All Gainers' : 'All Losers',
        })}
      />
    </Stack.Navigator>
  );
}
