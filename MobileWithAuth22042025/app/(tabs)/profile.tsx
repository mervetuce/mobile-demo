import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, User, LogOut, Sun, Moon, Key } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { fetchApi } from '@/utils/api';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  language: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [changingPassword, setChangingPassword] = useState(false); // Add this line for a separate loading state

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update form when user data changes 
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    twoFactor: false,
    darkMode: isDarkMode,
  });

  // Update dark mode preference when theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    Alert.alert(
      'Success',
      'Profile updated successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'Unable to initiate password change. Please try again later.');
      return;
    }

    try {
      // Show loading indicator using the local state
      setChangingPassword(true);

      // First, initiate forgot password flow in the background
      const result = await fetchApi('/account/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: user.email })
      });

      // Extract token if available
      let resetToken = '';
      if (typeof result === 'object' && result !== null) {
        if ('token' in result) {
          resetToken = result.token as string;
        } else if ('body' in result && typeof result.body === 'string') {
          const tokenMatch = result.body.match(/reset token is - ([^\s]+)/i);
          if (tokenMatch && tokenMatch[1]) {
            resetToken = tokenMatch[1];
          }
        }
      }

      setChangingPassword(false);

      // Navigate to reset password page with email and token if found
      if (resetToken) {
        router.push({
          pathname: '/reset-password',
          params: {
            email: user.email,
            token: resetToken
          }
        });
      } else {
        // If no token found, still navigate but show a message about checking email
        Alert.alert(
          'Check Your Email',
          'We\'ve sent a password reset link to your email address. Please check your inbox to continue.',
          [{
            text: 'OK',
            onPress: () => router.push({
              pathname: '/reset-password',
              params: { email: user.email }
            })
          }]
        );
      }
    } catch (error) {
      setChangingPassword(false);
      console.error('Error initiating password change:', error);
      Alert.alert(
        'Error',
        'Unable to initiate password change. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  // Update the UI to show loading state when changing password
  if (isLoading || changingPassword) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          {changingPassword ? 'Preparing password reset...' : 'Loading profile...'}
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.loginPrompt, { backgroundColor: theme.background }]}>
          <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#333' : '#f3f4f6' }]}>
            <User size={64} color={theme.text} />
          </View>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.buttonBackground }]}
            onPress={() => router.push({
              pathname: '/login'
            })}
          >
            <Text style={[styles.loginButtonText, { color: theme.buttonText }]}>Login to your account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '/forgot-password'
            })}
            style={styles.textLink}
          >
            <Text style={[styles.linkText, { color: theme.accent }]}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.profileSummary}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <Text style={styles.avatarText}>{user?.initials || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || user?.userName}</Text>
            <Text style={[styles.profileEmail, { color: isDarkMode ? '#aaa' : '#666' }]}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={isDarkMode ? '#aaa' : '#666'} />
          <Text style={[styles.logoutText, { color: isDarkMode ? '#aaa' : '#666' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Edit Profile</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              placeholder="Enter your full name"
              placeholderTextColor={theme.placeholderText}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.placeholderText}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={theme.placeholderText}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Nationality</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              value={formData.nationality}
              onChangeText={(text) => setFormData({ ...formData, nationality: text })}
              placeholder="Enter your nationality"
              placeholderTextColor={theme.placeholderText}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.text }]}>Preferred Language</Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme.inputBackground }]}>
              <Picker
                selectedValue={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                style={[styles.picker, { color: theme.text }]}
              >
                {LANGUAGES.map((lang) => (
                  <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Settings</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[styles.changePasswordButton, { borderColor: isDarkMode ? '#444' : '#ddd' }]}
            onPress={handleChangePassword}
          >
            <View style={styles.changePasswordContent}>
              <Key size={20} color={theme.accent} />
              <Text style={[styles.changePasswordText, { color: theme.text }]}>
                Change Password
              </Text>
            </View>
            <Text style={[styles.changePasswordHelp, { color: isDarkMode ? '#aaa' : '#666' }]}>
              Reset your password securely via email
            </Text>
          </TouchableOpacity>

          <Text style={[styles.subsectionTitle, { color: theme.text }]}>Preferences</Text>

          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.text }]}>Enable Notifications</Text>
            <Switch
              value={preferences.notifications}
              onValueChange={(value) =>
                setPreferences({ ...preferences, notifications: value })
              }
              trackColor={{ false: isDarkMode ? '#555' : '#767577', true: theme.accent + '50' }}
              thumbColor={preferences.notifications ? theme.accent : isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: theme.text }]}>Two-Factor Authentication</Text>
            <Switch
              value={preferences.twoFactor}
              onValueChange={(value) =>
                setPreferences({ ...preferences, twoFactor: value })
              }
              trackColor={{ false: isDarkMode ? '#555' : '#767577', true: theme.accent + '50' }}
              thumbColor={preferences.twoFactor ? theme.accent : isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.preferenceItem, { borderBottomWidth: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.preferenceLabel, { color: theme.text }]}>Dark Mode</Text>
              {isDarkMode ?
                <Moon size={16} color={theme.text} style={{ marginLeft: 8 }} /> :
                <Sun size={16} color={theme.text} style={{ marginLeft: 8 }} />
              }
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: isDarkMode ? '#555' : '#767577', true: theme.accent + '50' }}
              thumbColor={isDarkMode ? theme.accent : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.buttonBackground }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textLink: {
    padding: 8,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  preferenceLabel: {
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  logoutText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  changePasswordButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  changePasswordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  changePasswordText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  changePasswordHelp: {
    fontSize: 12,
    marginLeft: 28,
  },
});