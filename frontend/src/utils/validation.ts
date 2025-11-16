/**
 * Validation Utilities
 * Form validation helpers
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email Validation
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * Password Validation
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }

  return { isValid: true };
};

/**
 * Password Confirmation Validation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Name Validation
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  return { isValid: true };
};

/**
 * Login Form Validation
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  return errors;
};

/**
 * Signup Form Validation
 */
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const validateSignupForm = (data: SignupFormData): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }

  const confirmPasswordValidation = validatePasswordConfirmation(
    data.password,
    data.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.error;
  }

  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors: Record<string, string | undefined>): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};

