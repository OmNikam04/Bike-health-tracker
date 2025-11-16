/**
 * Bike List Screen
 * Displays all bikes for the current user
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  FAB,
  useTheme,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBikeStore } from '../../store/bikeStore';
import { AppStackParamList } from '../../navigation/types';
import { Bike } from '../../types/models.types';
import { EmptyState, LoadingOverlay, ErrorSnackbar } from '../../components/common';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function BikeListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { bikes, isLoading, error, fetchBikes, clearError } = useBikeStore();
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleRefresh = () => {
    fetchBikes();
  };

  const handleBikePress = (bike: Bike) => {
    navigation.navigate('BikeDetails', { bikeId: bike.id });
  };

  const handleAddBike = () => {
    navigation.navigate('AddBike');
  };

  const handleDismissError = () => {
    setErrorVisible(false);
    clearError();
  };

  const renderBikeCard = ({ item }: { item: Bike }) => (
    <Card
      style={styles.card}
      onPress={() => handleBikePress(item)}
      mode="elevated"
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            {item.brand} {item.model}
          </Text>
          {item.year && (
            <Chip mode="outlined" compact>
              {item.year}
            </Chip>
          )}
        </View>

        {item.registration_number && (
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {item.registration_number}
          </Text>
        )}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Odometer
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {item.current_odometer.toLocaleString()} km
            </Text>
          </View>

          {item.latest_mileage && (
            <View style={styles.stat}>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Latest Mileage
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {item.latest_mileage.toFixed(2)} km/l
              </Text>
            </View>
          )}

          <View style={styles.stat}>
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Fuel Logs
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {item.total_fuel_logs}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading && bikes.length === 0) {
    return <LoadingOverlay message="Loading bikes..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {bikes.length === 0 ? (
        <EmptyState
          icon="motorbike-off"
          title="No bikes yet"
          description="Add your first bike to start tracking fuel logs and maintenance!"
          actionLabel="Add Bike"
          onAction={handleAddBike}
        />
      ) : (
        <FlatList
          data={bikes}
          renderItem={renderBikeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
        />
      )}

      {bikes.length > 0 && (
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          color={theme.colors.onPrimary}
          onPress={handleAddBike}
          label="Add Bike"
        />
      )}

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
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  stat: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

