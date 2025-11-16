/**
 * Fuel Logs Screen
 * Displays fuel logs with bike selector and statistics
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  FAB,
  useTheme,
  Chip,
  Menu,
  Button,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBikeStore } from '../../store/bikeStore';
import { useFuelLogStore } from '../../store/fuelLogStore';
import { AppStackParamList } from '../../navigation/types';
import { FuelLog, Bike } from '../../types/models.types';
import { EmptyState, LoadingOverlay, ErrorSnackbar } from '../../components/common';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function FuelLogsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { bikes, fetchBikes } = useBikeStore();
  const { fuelLogs, fuelStats, isLoading, error, fetchFuelLogs, fetchFuelStats, clearFuelLogs, clearError } =
    useFuelLogStore();

  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [bikeMenuVisible, setBikeMenuVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

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

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleRefresh = () => {
    if (selectedBike) {
      fetchFuelLogs(selectedBike.id);
      fetchFuelStats(selectedBike.id);
    }
  };

  const handleDismissError = () => {
    setErrorVisible(false);
    clearError();
  };

  const handleFuelLogPress = (fuelLog: FuelLog) => {
    if (selectedBike) {
      navigation.navigate('FuelLogDetails', {
        bikeId: selectedBike.id,
        fuelLogId: fuelLog.id,
      });
    }
  };

  const handleAddFuelLog = () => {
    if (selectedBike) {
      navigation.navigate('AddFuelLog', { bikeId: selectedBike.id });
    }
  };

  const handleBikeSelect = (bike: Bike) => {
    setSelectedBike(bike);
    setBikeMenuVisible(false);
    clearFuelLogs();
  };

  const renderFuelLogCard = ({ item }: { item: FuelLog }) => {
    // Better label color for dark mode - use a brighter gray
    const labelColor = theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant; // Zinc 400 in dark mode

    return (
      <Card
        style={[
          styles.card,
          {
            backgroundColor: theme.dark ? '#27272A' : theme.colors.surface, // Zinc 800 for better contrast in dark mode
            borderWidth: theme.dark ? 1 : 0,
            borderColor: theme.dark ? '#3F3F46' : 'transparent', // Zinc 700 border in dark mode
          }
        ]}
        onPress={() => handleFuelLogPress(item)}
        mode="elevated"
        elevation={theme.dark ? 0 : 2}
      >
        <Card.Content>
          {/* Header with Date and Fuel Type */}
          <View style={styles.cardHeader}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={theme.colors.primary}
                style={{ marginRight: 8 }}
              />
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                {new Date(item.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <Chip
              mode="flat"
              compact
              style={{ backgroundColor: theme.colors.primaryContainer }}
              textStyle={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer }}
              icon="gas-station"
            >
              {item.fuel_type.toUpperCase()}
            </Chip>
          </View>

          {/* Main Stats Row with Icons */}
          <View style={styles.statsRow}>
            <View style={styles.statWithIcon}>
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.statText}>
                <Text variant="labelSmall" style={{ color: labelColor, fontWeight: '500' }}>
                  Odometer
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {item.odometer_reading} km
                </Text>
              </View>
            </View>

            <View style={styles.statWithIcon}>
              <MaterialCommunityIcons
                name="water"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.statText}>
                <Text variant="labelSmall" style={{ color: labelColor, fontWeight: '500' }}>
                  Liters
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  {item.liters.toFixed(2)} L
                </Text>
              </View>
            </View>

            <View style={styles.statWithIcon}>
              <MaterialCommunityIcons
                name="currency-inr"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.statText}>
                <Text variant="labelSmall" style={{ color: labelColor, fontWeight: '500' }}>
                  Cost
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  ₹{item.total_cost.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Mileage Highlight */}
          {item.mileage && (
            <View style={[
              styles.mileageHighlight,
              {
                backgroundColor: theme.dark ? '#3F3F46' : theme.colors.primaryContainer, // Zinc 700 in dark mode
              }
            ]}>
              <MaterialCommunityIcons
                name="gauge"
                size={28}
                color={theme.colors.primary}
              />
              <View style={{ marginLeft: 12 }}>
                <Text variant="labelSmall" style={{ color: labelColor, fontWeight: '500' }}>
                  Mileage
                </Text>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                  {item.mileage.toFixed(2)} km/L
                </Text>
              </View>
            {item.is_full_tank && (
              <Chip
                mode="outlined"
                compact
                icon="check-circle"
                style={{ marginLeft: 'auto' }}
                textStyle={{ fontSize: 10 }}
              >
                Full Tank
              </Chip>
            )}
          </View>
        )}

        {/* Location */}
        {item.location && (
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={labelColor}
            />
            <Text variant="bodySmall" style={{ color: labelColor, marginLeft: 6 }}>
              {item.location}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
    );
  };

  if (bikes.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          No bikes yet
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          Add a bike first to track fuel logs
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Bike Selector - Sticky at top */}
      <View style={[styles.bikeSelector, { backgroundColor: theme.colors.background, borderBottomWidth: 0.5, borderBottomColor: theme.colors.outline }]}>
        <Menu
          visible={bikeMenuVisible}
          onDismiss={() => setBikeMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setBikeMenuVisible(true)}
              icon="motorbike"
              contentStyle={{ justifyContent: 'flex-start' }}
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

      {/* Scrollable Content */}
      {isLoading && fuelLogs.length === 0 ? (
        <LoadingOverlay message="Loading fuel logs..." />
      ) : fuelLogs.length === 0 ? (
        <EmptyState
          icon="gas-station-off"
          title="No fuel logs yet"
          description="Add your first fuel log to start tracking mileage and fuel efficiency!"
          actionLabel="Add Fuel Log"
          onAction={handleAddFuelLog}
        />
      ) : (
        <ScrollView
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Statistics Card - Scrolls away */}
          {fuelStats && (
            <Card
              style={[
                styles.statsCard,
                {
                  backgroundColor: theme.dark ? '#27272A' : theme.colors.surface, // Zinc 800 for better contrast
                  borderWidth: theme.dark ? 1 : 0,
                  borderColor: theme.dark ? '#3F3F46' : 'transparent', // Zinc 700 border
                }
              ]}
              mode="elevated"
              elevation={theme.dark ? 0 : 1}
            >
              <Card.Content>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="chart-box"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                    Statistics
                  </Text>
                </View>
                <Divider style={{ marginVertical: 12 }} />
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                      Total Logs
                    </Text>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      {fuelStats.total_fuel_logs}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                      Avg Mileage
                    </Text>
                    <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                      {fuelStats.average_mileage?.toFixed(2) || 'N/A'}
                    </Text>
                    {fuelStats.average_mileage && (
                      <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant }}>
                        km/L
                      </Text>
                    )}
                  </View>

                  <View style={styles.statItem}>
                    <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                      Total Cost
                    </Text>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      ₹{fuelStats.total_cost.toFixed(0)}
                    </Text>
                  </View>

                  <View style={styles.statItem}>
                    <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                      Total Distance
                    </Text>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                      {fuelStats.total_distance} km
                    </Text>
                  </View>
                </View>

                {fuelStats.best_mileage && fuelStats.worst_mileage && (
                  <View style={styles.mileageRange}>
                    <View style={styles.mileageItem}>
                      <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                        Best
                      </Text>
                      <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                        {fuelStats.best_mileage.toFixed(2)} km/L
                      </Text>
                    </View>
                    <View style={styles.mileageItem}>
                      <Text variant="labelSmall" style={{ color: theme.dark ? '#A1A1AA' : theme.colors.onSurfaceVariant, fontWeight: '500' }}>
                        Worst
                      </Text>
                      <Text variant="bodyLarge" style={{ color: theme.colors.error, fontWeight: '600' }}>
                        {fuelStats.worst_mileage.toFixed(2)} km/L
                      </Text>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Fuel Logs List */}
          <View style={styles.logsSection}>
            <View style={styles.logsHeader}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginLeft: 8, fontWeight: 'bold' }}>
                  Fuel Logs
                </Text>
              </View>
              <Chip mode="outlined" compact>
                {fuelLogs.length} {fuelLogs.length === 1 ? 'entry' : 'entries'}
              </Chip>
            </View>

            {fuelLogs.map((fuelLog) => (
              <View key={fuelLog.id}>
                {renderFuelLogCard({ item: fuelLog })}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* FAB to Add Fuel Log */}
      {selectedBike && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          onPress={handleAddFuelLog}
          label="Add Fuel Log"
        />
      )}

      {/* Error Snackbar */}
      <ErrorSnackbar
        visible={errorVisible}
        message={error || 'An error occurred'}
        onDismiss={handleDismissError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bikeSelector: {
    padding: 16,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingBottom: 80, // Space for FAB
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 16,
  },
  mileageRange: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  mileageItem: {
    alignItems: 'center',
  },
  logsSection: {
    paddingHorizontal: 16,
  },
  logsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  statWithIcon: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statText: {
    marginLeft: 8,
  },
  mileageHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

