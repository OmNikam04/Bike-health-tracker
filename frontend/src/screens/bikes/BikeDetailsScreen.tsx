/**
 * Bike Details Screen
 * View and edit bike details
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Divider,
  IconButton,
  TextInput,
  SegmentedButtons,
  HelperText,
} from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBikeStore } from '../../store/bikeStore';
import { AppStackParamList } from '../../navigation/types';
import { UpdateBikeRequest } from '../../types/models.types';
import { LoadingOverlay, ConfirmDialog, ErrorSnackbar, SuccessSnackbar } from '../../components/common';

type BikeDetailsRouteProp = RouteProp<AppStackParamList, 'BikeDetails'>;
type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function BikeDetailsScreen() {
  const theme = useTheme();
  const route = useRoute<BikeDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { bikeId } = route.params;
  const isDarkMode = theme.dark;

  const { selectedBike, isLoading, error, getBike, updateBike, deleteBike, clearError } = useBikeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Edit form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [currentOdometer, setCurrentOdometer] = useState('');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getBike(bikeId);
  }, [bikeId]);

  useEffect(() => {
    if (selectedBike) {
      setBrand(selectedBike.brand);
      setModel(selectedBike.model);
      setYear(selectedBike.year?.toString() || '');
      setRegistrationNumber(selectedBike.registration_number || '');
      setCurrentOdometer(selectedBike.current_odometer.toString());
      setFuelType(selectedBike.fuel_type || 'petrol');
      setNotes(selectedBike.notes || '');
    }
  }, [selectedBike]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
    }
  }, [error]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    if (selectedBike) {
      setBrand(selectedBike.brand);
      setModel(selectedBike.model);
      setYear(selectedBike.year?.toString() || '');
      setRegistrationNumber(selectedBike.registration_number || '');
      setCurrentOdometer(selectedBike.current_odometer.toString());
      setFuelType(selectedBike.fuel_type || 'petrol');
      setNotes(selectedBike.notes || '');
    }
  };

  const handleSave = async () => {
    try {
      const updateData: UpdateBikeRequest = {
        brand: brand.trim(),
        model: model.trim(),
        year: year ? parseInt(year) : undefined,
        registration_number: registrationNumber.trim() || undefined,
        current_odometer: parseInt(currentOdometer),
        fuel_type: fuelType,
        notes: notes.trim() || undefined,
      };

      await updateBike(bikeId, updateData);
      setIsEditing(false);
      setSuccessMessage('Bike updated successfully!');
      setSuccessVisible(true);
    } catch (error: any) {
      // Error is handled by the store and shown via ErrorSnackbar
    }
  };

  const handleDelete = () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBike(bikeId);
      setDeleteDialogVisible(false);
      navigation.goBack();
    } catch (error: any) {
      // Error is handled by the store and shown via ErrorSnackbar
      setDeleteDialogVisible(false);
    }
  };

  const handleDismissError = () => {
    setErrorVisible(false);
    clearError();
  };

  const handleDismissSuccess = () => {
    setSuccessVisible(false);
    setSuccessMessage('');
  };

  if (isLoading || !selectedBike) {
    return <LoadingOverlay message="Loading bike details..." />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header Actions */}
      <View style={styles.headerActions}>
        {!isEditing ? (
          <>
            <Button mode="outlined" onPress={handleEdit} icon="pencil">
              Edit
            </Button>
            <Button
              mode="outlined"
              onPress={handleDelete}
              icon="delete"
              textColor={theme.colors.error}
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button mode="outlined" onPress={handleCancelEdit}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={isLoading}
              disabled={isLoading}
              style={{ marginLeft: 8 }}
            >
              Save
            </Button>
          </>
        )}
      </View>

      {/* Bike Information Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Bike Information
          </Text>

          {isEditing ? (
            <>
              <TextInput
                label="Brand *"
                value={brand}
                onChangeText={setBrand}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Model *"
                value={model}
                onChangeText={setModel}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Year"
                value={year}
                onChangeText={setYear}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Registration Number"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                mode="outlined"
                style={styles.input}
                autoCapitalize="characters"
              />
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Brand
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedBike.brand}
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Model
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedBike.model}
                </Text>
              </View>
              <Divider style={styles.divider} />

              {selectedBike.year && (
                <>
                  <View style={styles.detailRow}>
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Year
                    </Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {selectedBike.year}
                    </Text>
                  </View>
                  <Divider style={styles.divider} />
                </>
              )}

              {selectedBike.registration_number && (
                <>
                  <View style={styles.detailRow}>
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      Registration Number
                    </Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {selectedBike.registration_number}
                    </Text>
                  </View>
                  <Divider style={styles.divider} />
                </>
              )}
            </>
          )}
        </Card.Content>
      </Card>

      {/* Odometer & Fuel Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Odometer & Fuel
          </Text>

          {isEditing ? (
            <>
              <TextInput
                label="Current Odometer (km) *"
                value={currentOdometer}
                onChangeText={setCurrentOdometer}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: 8, marginBottom: 8 }}>
                Fuel Type
              </Text>
              <SegmentedButtons
                value={fuelType}
                onValueChange={setFuelType}
                buttons={[
                  {
                    value: 'petrol',
                    label: 'Petrol',
                    checkedColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    uncheckedColor: theme.colors.onSurface,
                    style: fuelType === 'petrol' ? { backgroundColor: theme.colors.primary } : undefined,
                  },
                  {
                    value: 'diesel',
                    label: 'Diesel',
                    checkedColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    uncheckedColor: theme.colors.onSurface,
                    style: fuelType === 'diesel' ? { backgroundColor: theme.colors.primary } : undefined,
                  },
                  {
                    value: 'electric',
                    label: 'Electric',
                    checkedColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                    uncheckedColor: theme.colors.onSurface,
                    style: fuelType === 'electric' ? { backgroundColor: theme.colors.primary } : undefined,
                  },
                ]}
                style={styles.input}
              />
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Initial Odometer
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedBike.initial_odometer.toLocaleString()} km
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Current Odometer
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedBike.current_odometer.toLocaleString()} km
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Fuel Type
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, textTransform: 'capitalize' }}>
                  {selectedBike.fuel_type || 'Not specified'}
                </Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      {!isEditing && (
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Statistics
            </Text>

            <View style={styles.detailRow}>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Total Fuel Logs
              </Text>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {selectedBike.total_fuel_logs}
              </Text>
            </View>
            <Divider style={styles.divider} />

            {selectedBike.latest_mileage && (
              <>
                <View style={styles.detailRow}>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Latest Mileage
                  </Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {selectedBike.latest_mileage.toFixed(2)} km/l
                  </Text>
                </View>
                <Divider style={styles.divider} />
              </>
            )}

            {selectedBike.average_mileage && (
              <View style={styles.detailRow}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Average Mileage
                </Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {selectedBike.average_mileage.toFixed(2)} km/l
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Notes Card */}
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Notes
          </Text>

          {isEditing ? (
            <TextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Any additional notes..."
            />
          ) : (
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
              {selectedBike.notes || 'No notes'}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Bike"
        message="Are you sure you want to delete this bike? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
        loading={isLoading}
      />

      {/* Error Snackbar */}
      <ErrorSnackbar
        visible={errorVisible}
        message={error || 'An error occurred'}
        onDismiss={handleDismissError}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        visible={successVisible}
        message={successMessage}
        onDismiss={handleDismissSuccess}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
});

