/**
 * Error Snackbar Component
 * Reusable snackbar for displaying error messages
 */

import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

interface ErrorSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
  visible,
  message,
  onDismiss,
  duration = 4000,
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
        backgroundColor: theme.colors.errorContainer,
      }}
      theme={{
        colors: {
          onSurface: theme.colors.onErrorContainer,
          inverseSurface: theme.colors.errorContainer,
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

