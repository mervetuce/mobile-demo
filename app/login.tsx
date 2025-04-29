import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LoginRequest } from '@/types/auth-types';

export default function LoginScreen() {
  const router = useRouter();
  const { confirmed } = useLocalSearchParams<{ confirmed?: string }>();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Redirect to home/profile if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/profile');
    }
  }, [isAuthenticated, router]);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!isAuthenticated && (!confirmed || confirmed !== 'true')) {
        setInitialCheckDone(true);
      }
    };

    checkLoginStatus();
  }, [router, isAuthenticated, confirmed]);

  // Show confirmation message if coming from email confirmation
  useEffect(() => {
    if (confirmed === 'true' && initialCheckDone) {
      Alert.alert(
        'Email Confirmed',
        'Your email has been confirmed successfully. Please log in.',
        [{ text: 'OK' }]
      );
    }
  }, [confirmed, initialCheckDone]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true);

        await login(formData);

        router.replace('/');
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert(
          'Login Failed',
          error instanceof Error ? error.message : 'Invalid email or password. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading...</Text>
      </View>
    );
  }

  // If authenticated, nothing will be rendered as the effect will redirect
  if (isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Sign in to continue</Text>

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
              placeholder="Enter your password"
              placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color={isDarkMode ? '#aaa' : '#666'} />
              ) : (
                <Eye size={20} color={isDarkMode ? '#aaa' : '#666'} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>}
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[
              styles.checkbox,
              {
                borderColor: isDarkMode ? '#555' : '#ddd',
                backgroundColor: rememberMe ? theme.accent : 'transparent'
              }
            ]} />
            <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#ddd' : '#333' }]}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={[styles.forgotPassword, { color: theme.accent }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: theme.buttonBackground }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text style={[styles.loginButtonText, { color: theme.buttonText }]}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: isDarkMode ? '#ddd' : '#333' }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.signupLink, { color: theme.accent }]}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
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
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});