/**
 * Home Screen
 * Dashboard with bike performance analytics and insights
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Divider,
  Menu,
  Button,
  Chip,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useUser } from '../../store/authStore';
import { useBikeStore } from '../../store/bikeStore';
import { useFuelLogStore } from '../../store/fuelLogStore';
import { AppStackParamList } from '../../navigation/types';
import { TabParamList } from '../../navigation/TabNavigator';
import { Bike, FuelLog } from '../../types/models.types';
import { LoadingOverlay, EmptyState } from '../../components/common';

// Composite navigation type for HomeScreen (inside Tab Navigator, which is inside Stack Navigator)
type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'HomeTab'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export default function HomeScreen() {
  const theme = useTheme();
  const user = useUser();
  const navigation = useNavigation<NavigationProp>();
  const { bikes, fetchBikes, isLoading: bikesLoading } = useBikeStore();
  const { fuelLogs, fuelStats, fetchFuelLogs, fetchFuelStats, isLoading: fuelLoading } = useFuelLogStore();

  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [bikeMenuVisible, setBikeMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (bikes.length > 0 && !selectedBike) {
      setSelectedBike(bikes[0]);
    }
  }, [bikes]);

  useEffect(() => {
    if (selectedBike) {
      fetchFuelLogs(selectedBike.id);
      fetchFuelStats(selectedBike.id);
    }
  }, [selectedBike]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBikes();
    if (selectedBike) {
      await fetchFuelLogs(selectedBike.id);
      await fetchFuelStats(selectedBike.id);
    }
    setRefreshing(false);
  };

  const handleBikeSelect = (bike: Bike) => {
    setSelectedBike(bike);
    setBikeMenuVisible(false);
  };

  const handleAddFuelLog = () => {
    if (selectedBike) {
      navigation.navigate('AddFuelLog', { bikeId: selectedBike.id });
    }
  };

  const handleAddBike = () => {
    navigation.navigate('AddBike');
  };

  const handleViewAllBikes = () => {
    // Navigate to BikesTab within the same Tab Navigator
    navigation.navigate('BikesTab');
  };

  const handleViewAllLogs = () => {
    // Navigate to FuelLogsTab within the same Tab Navigator
    navigation.navigate('FuelLogsTab');
  };

  if (bikesLoading && bikes.length === 0) {
    return <LoadingOverlay message="Loading dashboard..." />;
  }

  if (bikes.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="motorbike-off"
          title="No bikes yet"
          description="Add your first bike to start tracking performance and fuel efficiency!"
          actionLabel="Add Bike"
          onAction={handleAddBike}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        stickyHeaderIndices={[0]}
      >
        {/* Bike Selector - Sticky header */}
        <View style={[styles.bikeSelector, { backgroundColor: theme.colors.background, borderBottomWidth: 0.5, borderBottomColor: theme.colors.outline }]}>
          <View style={styles.bikeSelectorHeader}>
            <MaterialCommunityIcons name="motorbike" size={20} color={theme.colors.primary} />
            <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
              Selected Bike
            </Text>
          </View>
          <Menu
            visible={bikeMenuVisible}
            onDismiss={() => setBikeMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setBikeMenuVisible(true)}
                icon="chevron-down"
                contentStyle={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                style={{ marginTop: 8 }}
              >
                {selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : 'Select Bike'}
              </Button>
            }
          >
            {bikes.map((bike) => (
              <Menu.Item
                key={bike.id}
                onPress={() => handleBikeSelect(bike)}
                title={`${bike.brand} ${bike.model}`}
                leadingIcon="motorbike"
              />
            ))}
          </Menu>
        </View>
        {/* Content Container with padding */}
        <View style={styles.contentPadding}>
          {/* Greeting Header */}
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                Here's your bike performance overview
              </Text>
            </View>
          </View>

          {/* Bike Info Chips */}
          {selectedBike && (
            <View style={styles.bikeInfoCard}>
              <Chip icon="calendar" style={styles.chip}>
                {selectedBike.year || 'N/A'}
              </Chip>
              <Chip icon="fuel" style={styles.chip}>
                {selectedBike.fuel_type}
              </Chip>
              <Chip icon="counter" style={styles.chip}>
                {selectedBike.current_odometer.toLocaleString()} km
              </Chip>
            </View>
          )}

      {/* Quick Actions - Moved after bike selector */}
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.dark ? '#27272A' : theme.colors.surface,
            borderWidth: theme.dark ? 1 : 0,
            borderColor: theme.dark ? '#3F3F46' : 'transparent',
          }
        ]}
        mode="elevated"
        elevation={theme.dark ? 0 : 1}
      >
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={theme.colors.primary} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
              Quick Actions
            </Text>
          </View>
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              icon="gas-station"
              onPress={handleAddFuelLog}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
              disabled={!selectedBike}
            >
              Add Fuel Log
            </Button>
            <Button
              mode="outlined"
              icon="motorbike"
              onPress={handleAddBike}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Add Bike
            </Button>
          </View>
        </Card.Content>
      </Card>


      {/* Performance Overview */}
      {fuelStats && (
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.dark ? '#27272A' : theme.colors.surface,
              borderWidth: theme.dark ? 1 : 0,
              borderColor: theme.dark ? '#3F3F46' : 'transparent',
            }
          ]}
          mode="elevated"
          elevation={theme.dark ? 0 : 1}
        >
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="speedometer" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                Performance Overview
              </Text>
            </View>
            <Divider style={{ marginVertical: 12 }} />

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {/* Latest Mileage */}
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                  <MaterialCommunityIcons
                    name="gauge"
                    size={24}
                    color={theme.colors.onPrimaryContainer}
                  />
                </View>
                <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginTop: 8, fontWeight: '500' }}>
                  Latest Mileage
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.latest_mileage?.toFixed(1) || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant }}>
                  km/l
                </Text>
              </View>

              {/* Average Mileage */}
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <MaterialCommunityIcons
                    name="chart-line"
                    size={24}
                    color={theme.colors.onSecondaryContainer}
                  />
                </View>
                <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginTop: 8, fontWeight: '500' }}>
                  Average Mileage
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.average_mileage?.toFixed(1) || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant }}>
                  km/l
                </Text>
              </View>

              {/* Best Mileage */}
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.tertiaryContainer }]}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={24}
                    color={theme.colors.onTertiaryContainer}
                  />
                </View>
                <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginTop: 8, fontWeight: '500' }}>
                  Best Mileage
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.best_mileage?.toFixed(1) || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant }}>
                  km/l
                </Text>
              </View>

              {/* Worst Mileage */}
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.errorContainer }]}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={24}
                    color={theme.colors.onErrorContainer}
                  />
                </View>
                <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginTop: 8, fontWeight: '500' }}>
                  Worst Mileage
                </Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.worst_mileage?.toFixed(1) || 'N/A'}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant }}>
                  km/l
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Cost Analysis */}
      {fuelStats && (
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.dark ? '#27272A' : theme.colors.surface,
              borderWidth: theme.dark ? 1 : 0,
              borderColor: theme.dark ? '#3F3F46' : 'transparent',
            }
          ]}
          mode="elevated"
          elevation={theme.dark ? 0 : 1}
        >
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="currency-inr" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                Cost Analysis
              </Text>
            </View>
            <Divider style={{ marginVertical: 12 }} />

            <View style={styles.costGrid}>
              {/* Total Cost */}
              <View style={styles.costItem}>
                <View style={styles.costRow}>
                  <MaterialCommunityIcons name="cash-multiple" size={20} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginLeft: 8, fontWeight: '500' }}>
                    Total Fuel Cost
                  </Text>
                </View>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  ₹{fuelStats.total_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </Text>
              </View>

              <Divider style={{ marginVertical: 8 }} />

              {/* Total Distance */}
              <View style={styles.costItem}>
                <View style={styles.costRow}>
                  <MaterialCommunityIcons name="map-marker-distance" size={20} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginLeft: 8, fontWeight: '500' }}>
                    Total Distance
                  </Text>
                </View>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.total_distance.toLocaleString('en-IN')} km
                </Text>
              </View>

              <Divider style={{ marginVertical: 8 }} />

              {/* Average Cost per KM */}
              <View style={styles.costItem}>
                <View style={styles.costRow}>
                  <MaterialCommunityIcons name="calculator" size={20} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginLeft: 8, fontWeight: '500' }}>
                    Cost per KM
                  </Text>
                </View>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  ₹{fuelStats.average_cost_per_km?.toFixed(2) || 'N/A'}
                </Text>
              </View>

              <Divider style={{ marginVertical: 8 }} />

              {/* Total Liters */}
              <View style={styles.costItem}>
                <View style={styles.costRow}>
                  <MaterialCommunityIcons name="gas-station" size={20} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, marginLeft: 8, fontWeight: '500' }}>
                    Total Fuel
                  </Text>
                </View>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {fuelStats.total_liters.toFixed(1)} L
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Mileage Trend Chart */}
      {fuelLogs.length > 0 && (
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.dark ? '#27272A' : theme.colors.surface,
              borderWidth: theme.dark ? 1 : 0,
              borderColor: theme.dark ? '#3F3F46' : 'transparent',
            }
          ]}
          mode="elevated"
          elevation={theme.dark ? 0 : 1}
        >
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                Mileage Trend
              </Text>
            </View>
            <Divider style={{ marginVertical: 12 }} />

            {(() => {
              // Get last 10 fuel logs with mileage data
              const logsWithMileage = fuelLogs
                .filter(log => log.mileage !== null && log.mileage !== undefined)
                .slice(0, 10)
                .reverse();

              if (logsWithMileage.length < 2) {
                return (
                  <View style={styles.emptyChart}>
                    <MaterialCommunityIcons
                      name="chart-line-variant"
                      size={48}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                      Add more fuel logs to see mileage trends
                    </Text>
                  </View>
                );
              }

              const mileageData = logsWithMileage.map(log => log.mileage || 0);
              const labels = logsWithMileage.map((_, index) => `${index + 1}`);

              return (
                <View>
                  <LineChart
                    data={{
                      labels: labels,
                      datasets: [{
                        data: mileageData,
                      }],
                    }}
                    width={Dimensions.get('window').width - 64}
                    height={220}
                    chartConfig={{
                      backgroundColor: theme.colors.surface,
                      backgroundGradientFrom: theme.colors.surface,
                      backgroundGradientTo: theme.colors.surface,
                      decimalPlaces: 1,
                      color: (opacity = 1) => theme.dark
                        ? `rgba(250, 250, 250, ${opacity})`
                        : `rgba(15, 23, 42, ${opacity})`,
                      labelColor: (opacity = 1) => theme.dark
                        ? `rgba(161, 161, 170, ${opacity})`
                        : `rgba(100, 116, 139, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: theme.colors.primary,
                      },
                      propsForBackgroundLines: {
                        strokeDasharray: '',
                        stroke: theme.colors.outline,
                        strokeWidth: 0.5,
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}>
                    Last {logsWithMileage.length} fuel logs (km/l)
                  </Text>
                </View>
              );
            })()}
          </Card.Content>
        </Card>
      )}

      {/* Recent Activity */}
      {fuelLogs.length > 0 && (
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.dark ? '#27272A' : theme.colors.surface,
              borderWidth: theme.dark ? 1 : 0,
              borderColor: theme.dark ? '#3F3F46' : 'transparent',
            }
          ]}
          mode="elevated"
          elevation={theme.dark ? 0 : 1}
        >
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="history" size={24} color={theme.colors.primary} />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                Recent Activity
              </Text>
              <View style={{ flex: 1 }} />
              <IconButton
                icon="arrow-right"
                size={20}
                onPress={handleViewAllLogs}
              />
            </View>
            <Divider style={{ marginVertical: 12 }} />

            {fuelLogs.slice(0, 5).map((log, index) => (
              <View key={log.id}>
                <View style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: theme.colors.primaryContainer }]}>
                    <MaterialCommunityIcons
                      name="gas-station"
                      size={20}
                      color={theme.colors.onPrimaryContainer}
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      Added {log.liters.toFixed(1)}L fuel
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {new Date(log.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} • {log.location || 'Unknown location'}
                    </Text>
                  </View>
                  <View style={styles.activityMeta}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                      ₹{log.total_cost.toFixed(0)}
                    </Text>
                    {log.mileage && (
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {log.mileage.toFixed(1)} km/l
                      </Text>
                    )}
                  </View>
                </View>
                {index < Math.min(4, fuelLogs.length - 1) && <Divider style={{ marginVertical: 12 }} />}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

        {/* View All Actions */}
        <View style={styles.viewAllActions}>
          <Button
            mode="outlined"
            icon="motorbike"
            onPress={handleViewAllBikes}
            style={styles.viewAllButton}
          >
            View All Bikes
          </Button>
          <Button
            mode="outlined"
            icon="format-list-bulleted"
            onPress={handleViewAllLogs}
            style={styles.viewAllButton}
          >
            View All Logs
          </Button>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  bikeSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  bikeSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contentPadding: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  bikeInfoCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  bikeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    marginRight: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  costGrid: {
    gap: 8,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  viewAllActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  viewAllButton: {
    flex: 1,
  },
});

