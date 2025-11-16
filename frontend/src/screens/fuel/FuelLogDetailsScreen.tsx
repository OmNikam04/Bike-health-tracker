/**
 * Fuel Log Details Screen
 * View and edit fuel log details
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  ActivityIndicator,
  Card,
  Chip,
  TextInput,
  SegmentedButtons,
  Switch,
  Portal,
  Dialog,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFuelLogStore } from '../../store/fuelLogStore';
import { AppStackParamList } from '../../navigation/types';
import { UpdateFuelLogRequest } from '../../types/models.types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
type FuelLogDetailsRouteProp = RouteProp<AppStackParamList, 'FuelLogDetails'>;

export default function FuelLogDetailsScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FuelLogDetailsRouteProp>();
  const { bikeId, fuelLogId } = route.params;
  const { selectedFuelLog, isLoading, getFuelLog, updateFuelLog, deleteFuelLog } = useFuelLogStore();
  const isDarkMode = theme.dark;

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Edit form state
  const [date, setDate] = useState(new Date());
  const [odometerReading, setOdometerReading] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [isFullTank, setIsFullTank] = useState(true);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getFuelLog(bikeId, fuelLogId);
  }, [bikeId, fuelLogId]);

  useEffect(() => {
    if (selectedFuelLog) {
      setDate(new Date(selectedFuelLog.date));
      setOdometerReading(selectedFuelLog.odometer_reading.toString());
      setLiters(selectedFuelLog.liters.toString());
      setPricePerLiter(selectedFuelLog.price_per_liter.toString());
      setFuelType(selectedFuelLog.fuel_type || 'petrol');
      setIsFullTank(selectedFuelLog.is_full_tank);
      setLocation(selectedFuelLog.location || '');
      setNotes(selectedFuelLog.notes || '');
    }
  }, [selectedFuelLog]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (selectedFuelLog) {
      setDate(new Date(selectedFuelLog.date));
      setOdometerReading(selectedFuelLog.odometer_reading.toString());
      setLiters(selectedFuelLog.liters.toString());
      setPricePerLiter(selectedFuelLog.price_per_liter.toString());
      setFuelType(selectedFuelLog.fuel_type || 'petrol');
      setIsFullTank(selectedFuelLog.is_full_tank);
      setLocation(selectedFuelLog.location || '');
      setNotes(selectedFuelLog.notes || '');
    }
  };

  const handleSave = async () => {
    try {
      const updateData: UpdateFuelLogRequest = {
        date: date.toISOString(),
        odometer_reading: parseInt(odometerReading),
        liters: parseFloat(liters),
        price_per_liter: parseFloat(pricePerLiter),
        fuel_type: fuelType,
        is_full_tank: isFullTank,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await updateFuelLog(bikeId, fuelLogId, updateData);
      setIsEditing(false);
      Alert.alert('Success', 'Fuel log updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update fuel log');
    }
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFuelLog(bikeId, fuelLogId);
      setDeleteDialogVisible(false);
      Alert.alert('Success', 'Fuel log deleted successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      setDeleteDialogVisible(false);
      Alert.alert('Error', error.message || 'Failed to delete fuel log');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (isLoading || !selectedFuelLog) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const totalCost = liters && pricePerLiter
    ? (parseFloat(liters) * parseFloat(pricePerLiter)).toFixed(2)
    : selectedFuelLog.total_cost.toFixed(2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isEditing ? (
          <>
            <Button mode="outlined" onPress={handleCancelEdit} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button mode="outlined" onPress={handleEdit} style={styles.button} icon="pencil">
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={handleDelete}
              style={styles.button}
              buttonColor={theme.colors.error}
              icon="delete"
            >
              Delete
            </Button>
          </>
        )}
      </View>

      <Card style={styles.card} mode="elevated">
        <Card.Content>
          {isEditing ? (
            <>
              {/* Date Picker */}
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
                Date
              </Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
                icon="calendar"
              >
                {date.toLocaleDateString()}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              <TextInput
                label="Odometer Reading *"
                value={odometerReading}
                onChangeText={setOdometerReading}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                right={<TextInput.Affix text="km" />}
              />

              <TextInput
                label="Liters *"
                value={liters}
                onChangeText={setLiters}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
                right={<TextInput.Affix text="L" />}
              />

              <TextInput
                label="Price Per Liter *"
                value={pricePerLiter}
                onChangeText={setPricePerLiter}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
                right={<TextInput.Affix text="₹" />}
              />

              <View style={styles.totalCostContainer}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  Total Cost:
                </Text>
                <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  ₹{totalCost}
                </Text>
              </View>

              <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 16, marginBottom: 8 }}>
                Fuel Type
              </Text>
              <SegmentedButtons
                value={fuelType}
                onValueChange={setFuelType}
                buttons={[
                  {
                    value: 'petrol',
                    label: 'Petrol',
                    icon: 'gas-station',
                    checkedColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    uncheckedColor: theme.colors.onSurface,
                    style: fuelType === 'petrol' ? { backgroundColor: theme.colors.primary } : undefined,
                  },
                  {
                    value: 'diesel',
                    label: 'Diesel',
                    icon: 'gas-station',
                    checkedColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    uncheckedColor: theme.colors.onSurface,
                    style: fuelType === 'diesel' ? { backgroundColor: theme.colors.primary } : undefined,
                  },
                ]}
                style={styles.input}
              />

              <View style={styles.switchContainer}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  Full Tank
                </Text>
                <Switch value={isFullTank} onValueChange={setIsFullTank} />
              </View>

              <TextInput
                label="Location (Optional)"
                value={location}
                onChangeText={setLocation}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
              />

              <TextInput
                label="Notes (Optional)"
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </>
          ) : (
            <>
              {/* View Mode */}
              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Date
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {new Date(selectedFuelLog.date).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Odometer Reading
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedFuelLog.odometer_reading} km
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Liters
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedFuelLog.liters.toFixed(2)} L
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Price Per Liter
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  ₹{selectedFuelLog.price_per_liter.toFixed(2)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Total Cost
                </Text>
                <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  ₹{selectedFuelLog.total_cost.toFixed(2)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Fuel Type
                </Text>
                <Chip mode="outlined" compact>
                  {selectedFuelLog.fuel_type.toUpperCase()}
                </Chip>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Full Tank
                </Text>
                <Chip mode="outlined" compact icon={selectedFuelLog.is_full_tank ? 'check' : 'close'}>
                  {selectedFuelLog.is_full_tank ? 'Yes' : 'No'}
                </Chip>
              </View>

              {selectedFuelLog.mileage && (
                <View style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Mileage
                  </Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {selectedFuelLog.mileage.toFixed(2)} km/L
                  </Text>
                </View>
              )}

              {selectedFuelLog.distance_covered && (
                <View style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Distance Covered
                  </Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {selectedFuelLog.distance_covered} km
                  </Text>
                </View>
              )}

              {selectedFuelLog.location && (
                <View style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Location
                  </Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {selectedFuelLog.location}
                  </Text>
                </View>
              )}

              {selectedFuelLog.notes && (
                <View style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Notes
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {selectedFuelLog.notes}
                  </Text>
                </View>
              )}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Fuel Log</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this fuel log? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDelete} textColor={theme.colors.error}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
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
  },
  content: {
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: 12,
  },
  totalCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
});

