/**
 * Add Bike Screen
 * Form to create a new bike
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  SegmentedButtons,
  Text,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBikeStore } from '../../store/bikeStore';
import { AppStackParamList } from '../../navigation/types';
import { CreateBikeRequest } from '../../types/models.types';

type NavigationProp = NativeStackNavigationProp<AppStackParamList>;

export default function AddBikeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { createBike, isLoading } = useBikeStore();
  const isDarkMode = theme.dark;

  // Form state
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [initialOdometer, setInitialOdometer] = useState('0');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (year && (parseInt(year) < 1900 || parseInt(year) > 2100)) {
      newErrors.year = 'Year must be between 1900 and 2100';
    }

    if (parseInt(initialOdometer) < 0) {
      newErrors.initialOdometer = 'Odometer cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const bikeData: CreateBikeRequest = {
        brand: brand.trim(),
        model: model.trim(),
        year: year ? parseInt(year) : undefined,
        registration_number: registrationNumber.trim() || undefined,
        initial_odometer: parseInt(initialOdometer),
        fuel_type: fuelType,
        notes: notes.trim() || undefined,
      };

      await createBike(bikeData);

      Alert.alert('Success', 'Bike added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add bike');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
        Bike Information
      </Text>

      <TextInput
        label="Brand *"
        value={brand}
        onChangeText={setBrand}
        mode="outlined"
        style={styles.input}
        error={!!errors.brand}
      />
      <HelperText type="error" visible={!!errors.brand}>
        {errors.brand}
      </HelperText>

      <TextInput
        label="Model *"
        value={model}
        onChangeText={setModel}
        mode="outlined"
        style={styles.input}
        error={!!errors.model}
      />
      <HelperText type="error" visible={!!errors.model}>
        {errors.model}
      </HelperText>

      <TextInput
        label="Year"
        value={year}
        onChangeText={setYear}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.year}
        placeholder="e.g., 2023"
      />
      <HelperText type="error" visible={!!errors.year}>
        {errors.year}
      </HelperText>

      <TextInput
        label="Registration Number"
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
        mode="outlined"
        style={styles.input}
        placeholder="e.g., MH12AB1234"
        autoCapitalize="characters"
      />

      <TextInput
        label="Initial Odometer (km) *"
        value={initialOdometer}
        onChangeText={setInitialOdometer}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.initialOdometer}
      />
      <HelperText type="error" visible={!!errors.initialOdometer}>
        {errors.initialOdometer}
      </HelperText>

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

      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="Any additional notes..."
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Add Bike
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
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
});

