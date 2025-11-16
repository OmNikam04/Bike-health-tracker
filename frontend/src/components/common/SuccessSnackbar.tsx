/**
 * Success Snackbar Component
 * Reusable snackbar for displaying success messages
 */

import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

interface SuccessSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const SuccessSnackbar: React.FC<SuccessSnackbarProps> = ({
  visible,
  message,
  onDismiss,
  duration = 3000,
  action,
}) => {
  const theme = useTheme();

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      style={{
        backgroundColor: theme.colors.primaryContainer,
      }}
      theme={{
        colors: {
          onSurface: theme.colors.onPrimaryContainer,
          inverseSurface: theme.colors.primaryContainer,
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

