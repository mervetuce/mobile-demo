import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { fetchApi } from '@/utils/api';
import { RegisterRequest } from '@/types/auth-types';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationUrl, setConfirmationUrl] = useState<string | null>(null);
  const [confirmingEmail, setConfirmingEmail] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms and Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);

        // Generate username from email if not provided
        if (!formData.userName.trim()) {
          formData.userName = formData.email.split('@')[0];
        }

        // Make registration request
        const result = await fetchApi('/account/register', {
          method: 'POST',
          body: JSON.stringify(formData)
        });


        // Extract confirmation URL from response
        if (typeof result === 'string') {
          const urlRegex = /(https?:\/\/[^\s]+confirm-email[^\s]+)/g;
          const match = urlRegex.exec(result);
          if (match && match[0]) {
            setConfirmationUrl(match[0]);
            return; // Show confirmation modal instead of alert
          }
        }

        // If no confirmation URL is found, show success message and redirect
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully. Please check your email to confirm your account.',
          [{
            text: 'OK',
            onPress: () => router.replace('/login')
          }]
        );
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert(
          'Registration Failed',
          error instanceof Error ? error.message : 'An error occurred during registration. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmEmail = async () => {
    if (!confirmationUrl) return;

    try {
      setConfirmingEmail(true);

      // Extract userId and code from URL
      const urlObj = new URL(confirmationUrl);
      const userId = urlObj.searchParams.get('userId');
      const code = urlObj.searchParams.get('code');

      if (!userId || !code) {
        throw new Error('Invalid confirmation URL');
      }

      const result = await fetchApi(`/account/confirm-email?userId=${userId}&code=${code}`, {
        method: 'GET'
      });

      // Reset confirmation state
      setConfirmationUrl(null);

      Alert.alert(
        'Email Confirmed',
        'Your email has been confirmed successfully. You can now log in to your account.',
        [{
          text: 'OK',
          onPress: () => {
            setTimeout(() => {
              router.navigate('/login');
            }, 100);
          }
        }]
      );
    } catch (error) {
      console.error('Email confirmation error:', error);
      Alert.alert(
        'Confirmation Failed',
        error instanceof Error ? error.message : 'Email confirmation failed. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setConfirmingEmail(false);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to profile if already authenticated
      router.replace('/profile');
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
      </View>
    );
  }

  // If authenticated, nothing will be rendered as the effect will redirect
  // This is just a safety measure
  if (isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Create an Account</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Join Visify today</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>First Name</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.firstName ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <User size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your first name"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              autoComplete="name"
            />
          </View>
          {errors.firstName && <Text style={[styles.errorText, { color: theme.error }]}>{errors.firstName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Last Name</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.lastName ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <User size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your last name"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              autoComplete="name-family"
            />
          </View>
          {errors.lastName && <Text style={[styles.errorText, { color: theme.error }]}>{errors.lastName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.email ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <Mail size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Username</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.userName ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <User size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Choose a username (or we'll create one from your email)"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.userName}
              onChangeText={(text) => setFormData({ ...formData, userName: text })}
              autoCapitalize="none"
            />
          </View>
          {errors.userName && <Text style={[styles.errorText, { color: theme.error }]}>{errors.userName}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.password ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <Lock size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Create a password"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPasswords.password}
              autoComplete="new-password"
            />
            <TouchableOpacity
              onPress={() => togglePasswordVisibility('password')}
              style={styles.eyeIcon}
            >
              {showPasswords.password ? (
                <EyeOff size={20} color={isDarkMode ? '#aaa' : '#666'} />
              ) : (
                <Eye size={20} color={isDarkMode ? '#aaa' : '#666'} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
          <View style={[
            styles.inputContainer,
            {
              borderColor: errors.confirmPassword ? theme.error : theme.inputBorder,
              backgroundColor: theme.inputBackground
            }
          ]}>
            <Lock size={20} color={isDarkMode ? '#aaa' : '#666'} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Confirm your password"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry={!showPasswords.confirmPassword}
              autoComplete="new-password"
            />
            <TouchableOpacity
              onPress={() => togglePasswordVisibility('confirmPassword')}
              style={styles.eyeIcon}
            >
              {showPasswords.confirmPassword ? (
                <EyeOff size={20} color={isDarkMode ? '#aaa' : '#666'} />
              ) : (
                <Eye size={20} color={isDarkMode ? '#aaa' : '#666'} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={[styles.errorText, { color: theme.error }]}>{errors.confirmPassword}</Text>}
        </View>

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[
            styles.checkbox,
            {
              borderColor: theme.text,
              backgroundColor: acceptedTerms ? theme.text : 'transparent'
            }
          ]} />
          <Text style={[styles.termsText, { color: isDarkMode ? '#aaa' : '#666' }]}>
            I accept the Terms and Conditions
          </Text>
        </TouchableOpacity>
        {errors.terms && <Text style={[styles.errorText, { color: theme.error }]}>{errors.terms}</Text>}

        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: theme.buttonBackground }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text style={[styles.registerButtonText, { color: theme.buttonText }]}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: isDarkMode ? '#aaa' : '#666' }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.loginLink, { color: theme.accent }]}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Email confirmation modal */}
      <Modal
        visible={!!confirmationUrl}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Email Confirmation</Text>
            <Text style={[styles.modalMessage, { color: theme.accent }]}>
              Registration successful! Please confirm your email to continue:
            </Text>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: theme.accent }]}
              onPress={handleConfirmEmail}
              disabled={confirmingEmail}
            >
              {confirmingEmail ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Email</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  termsText: {
    fontSize: 14,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});