import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { fetchApi } from '@/utils/api';
import { useTheme } from '@/context/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme, isDarkMode } = useTheme();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async () => {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const result = await fetchApi('/account/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      // For development/testing environments, try to extract token from response
      let resetToken = '';

      if (typeof result === 'string') {
        const tokenMatch = result.match(/token=([^&\s]+)/);
        if (tokenMatch && tokenMatch[1]) {
          resetToken = tokenMatch[1];
        }
      } else if (result && typeof result === 'object') {
        if ('body' in result && typeof result.body === 'string') {
          // Extract token from the email body
          const bodyText = result.body;
          const tokenMatch = bodyText.match(/reset token is - ([^\s]+)/i);
          if (tokenMatch && tokenMatch[1]) {
            resetToken = tokenMatch[1];
          }
        }
        // If API returns token directly in response object
        else if ('token' in result) {
          resetToken = result.token as string;
        }
      }

      if (resetToken) {
        console.log('Found reset token:', resetToken);
        // If token is found, redirect directly to reset password page with params
        router.replace({
          pathname: '/reset-password',
          params: { email, token: resetToken }
        });
      } else {
        // Show success message and then redirect to reset-password page
        // The user will need to get the token from their email
        setIsSuccess(true);
        setTimeout(() => {
          router.replace({
            pathname: '/reset-password',
            params: { email }
          });
        }, 3000); 
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Forgot Password?</Text>

        {isSuccess ? (
          <>
            <Text style={[styles.successText, { color: theme.success }]}>
              We've sent a reset link to your email.
            </Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
              Please check your inbox and follow the instructions to reset your password.
            </Text>
            <Text style={[styles.redirectText, { color: theme.accent }]}>
              Redirecting to reset password page...
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
              Enter your email and we'll send you a reset link.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View style={[
                styles.inputContainer,
                {
                  borderColor: error ? theme.error : theme.inputBorder,
                  backgroundColor: theme.inputBackground
                }
              ]}>
                <Mail size={20} color={isDarkMode ? '#aaa' : '#666'} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.buttonBackground }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.buttonText} />
              ) : (
                <Text style={[styles.resetButtonText, { color: theme.buttonText }]}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.backButtonText, { color: theme.accent }]}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
    marginBottom: 24,
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
  resetButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  redirectText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
    textAlign: 'center',
  },
});