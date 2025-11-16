/**
 * Add Fuel Log Screen
 * Form to create a new fuel log entry
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
  SegmentedButtons,
  Switch,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFuelLogStore } from '../../store/fuelLogStore';
import { AppStackParamList } from '../../navigation/types';
import { CreateFuelLogRequest } from '../../types/models.types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;
type AddFuelLogRouteProp = RouteProp<AppStackParamList, 'AddFuelLog'>;

export default function AddFuelLogScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AddFuelLogRouteProp>();
  const { bikeId } = route.params;
  const isDarkMode = theme.dark;
  const { createFuelLog, isLoading } = useFuelLogStore();

  // Form state
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [odometerReading, setOdometerReading] = useState('');
  const [liters, setLiters] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [isFullTank, setIsFullTank] = useState(true);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate total cost
  const totalCost = liters && pricePerLiter
    ? (parseFloat(liters) * parseFloat(pricePerLiter)).toFixed(2)
    : '0.00';

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!odometerReading.trim()) {
      newErrors.odometerReading = 'Odometer reading is required';
    } else if (parseInt(odometerReading) < 0) {
      newErrors.odometerReading = 'Odometer cannot be negative';
    }

    if (!liters.trim()) {
      newErrors.liters = 'Liters is required';
    } else if (parseFloat(liters) <= 0) {
      newErrors.liters = 'Liters must be greater than 0';
    }

    if (!pricePerLiter.trim()) {
      newErrors.pricePerLiter = 'Price per liter is required';
    } else if (parseFloat(pricePerLiter) <= 0) {
      newErrors.pricePerLiter = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const fuelLogData: CreateFuelLogRequest = {
        date: date.toISOString(),
        odometer_reading: parseInt(odometerReading),
        liters: parseFloat(liters),
        price_per_liter: parseFloat(pricePerLiter),
        fuel_type: fuelType,
        is_full_tank: isFullTank,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      await createFuelLog(bikeId, fuelLogData);

      Alert.alert('Success', 'Fuel log added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add fuel log');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
        Fuel Log Information
      </Text>

      {/* Date Picker */}
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

      {/* Odometer Reading */}
      <TextInput
        label="Odometer Reading *"
        value={odometerReading}
        onChangeText={setOdometerReading}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.odometerReading}
        right={<TextInput.Affix text="km" />}
      />
      <HelperText type="error" visible={!!errors.odometerReading}>
        {errors.odometerReading}
      </HelperText>

      {/* Liters */}
      <TextInput
        label="Liters *"
        value={liters}
        onChangeText={setLiters}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
        error={!!errors.liters}
        right={<TextInput.Affix text="L" />}
      />
      <HelperText type="error" visible={!!errors.liters}>
        {errors.liters}
      </HelperText>

      {/* Price Per Liter */}
      <TextInput
        label="Price Per Liter *"
        value={pricePerLiter}
        onChangeText={setPricePerLiter}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
        error={!!errors.pricePerLiter}
        right={<TextInput.Affix text="₹" />}
      />
      <HelperText type="error" visible={!!errors.pricePerLiter}>
        {errors.pricePerLiter}
      </HelperText>

      {/* Total Cost Display */}
      <View style={styles.totalCostContainer}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          Total Cost:
        </Text>
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          ₹{totalCost}
        </Text>
      </View>

      {/* Fuel Type */}
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

      {/* Full Tank Switch */}
      <View style={styles.switchContainer}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          Full Tank
        </Text>
        <Switch value={isFullTank} onValueChange={setIsFullTank} />
      </View>

      {/* Location */}
      <TextInput
        label="Location (Optional)"
        value={location}
        onChangeText={setLocation}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="map-marker" />}
      />

      {/* Notes */}
      <TextInput
        label="Notes (Optional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      {/* Submit Button */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.submitButton}
      >
        Add Fuel Log
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
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
  submitButton: {
    marginTop: 24,
    marginBottom: 32,
  },
});

