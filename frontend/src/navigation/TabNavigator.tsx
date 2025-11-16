/**
 * Tab Navigator
 * Bottom tab navigation for the main app screens
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, Appbar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/app/HomeScreen';
import BikeListScreen from '../screens/bikes/BikeListScreen';
import FuelLogsScreen from '../screens/fuel/FuelLogsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type TabParamList = {
  HomeTab: undefined;
  BikesTab: undefined;
  FuelLogsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background, // Blend with background
        },
        headerTintColor: theme.colors.onBackground,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false, // Remove shadow for cleaner look
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 0.5, // Thinner border
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Bike Health Tracker',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BikesTab"
        component={BikeListScreen}
        options={{
          title: 'My Bikes',
          tabBarLabel: 'Bikes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="motorbike" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FuelLogsTab"
        component={FuelLogsScreen}
        options={{
          title: 'Fuel Logs',
          tabBarLabel: 'Fuel Logs',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="gas-station" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

