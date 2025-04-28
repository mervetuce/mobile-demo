import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { fetchApi } from '@/utils/api';
import { ResetPasswordRequest } from '@/types/auth-types';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordScreen() {
    // Get parameters from URL
    const params = useLocalSearchParams<{ email: string; token: string }>();
    const { theme, isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth(); // Use our new auth context

    const [formData, setFormData] = useState<ResetPasswordRequest>({
        email: params.email || '',
        token: params.token || '',
        password: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showTokenInput, setShowTokenInput] = useState(!params.token);
    const [hasToken, setHasToken] = useState(!!params.token);
    const [isSuccess, setIsSuccess] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    // Update email and token from params when they change
    useEffect(() => {
        if (params.email) {
            setFormData(prev => ({ ...prev, email: params.email }));
        }
        if (params.token) {
            setFormData(prev => ({ ...prev, token: params.token }));
            setShowTokenInput(false);
            setHasToken(true);
        }
    }, [params.email, params.token]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.token) {
            newErrors.token = 'Reset token is required';
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);

                // Using fetchApi from utils/api
                const result = await fetchApi('/account/reset-password', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });


                // Show success state
                setIsSuccess(true);

                // Start redirection after a delay to allow user to see the success message
                setTimeout(() => {
                    setRedirecting(true);
                    setTimeout(() => {
                        if (isAuthenticated) {
                            router.replace('/profile');
                        } else {
                            router.replace('/login');
                        }
                    }, 500); // Short delay before actual navigation
                }, 2000); // Show success message for 2 seconds
            } catch (error) {
                console.error('Password reset error:', error);
                Alert.alert(
                    'Error',
                    error instanceof Error
                        ? error.message
                        : 'An error occurred while resetting your password. The token may have expired.',
                    [{ text: 'OK' }]
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Show success view if password was reset successfully
    if (isSuccess) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
                    <View style={styles.successContainer}>
                        <Text style={[styles.successIcon, { color: theme.success }]}>✓</Text>
                        <Text style={[styles.successTitle, { color: theme.text }]}>Password Reset Successful!</Text>
                        <Text style={[styles.successMessage, { color: isDarkMode ? '#aaa' : '#666' }]}>
                            Your password has been updated successfully.
                        </Text>
                        {redirecting ? (
                            <View style={styles.redirectContainer}>
                                <ActivityIndicator size="small" color={theme.accent} />
                                <Text style={[styles.redirectText, { color: theme.accent }]}>
                                    Redirecting to {isAuthenticated ? 'profile' : 'login'}...
                                </Text>
                            </View>
                        ) : (
                            <Text style={[styles.redirectText, { color: theme.accent }]}>
                                You will be redirected in a moment...
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Reset Your Password</Text>
                <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Enter a new password for your account
                </Text>

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
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            placeholder="Your email address"
                            placeholderTextColor={theme.placeholderText}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
                </View>

                {showTokenInput && (
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Reset Token</Text>
                        <View style={[
                            styles.inputContainer,
                            {
                                borderColor: errors.token ? theme.error : theme.inputBorder,
                                backgroundColor: theme.inputBackground
                            }
                        ]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={formData.token}
                                onChangeText={(text) => setFormData({ ...formData, token: text })}
                                placeholder="Enter the token from your email"
                                placeholderTextColor={theme.placeholderText}
                            />
                        </View>
                        {errors.token && <Text style={[styles.errorText, { color: theme.error }]}>{errors.token}</Text>}
                        <Text style={[styles.helpText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                            The token can be found in the reset email we sent to you.
                        </Text>
                    </View>
                )}

                {hasToken && !showTokenInput && (
                    <View style={styles.tokenConfirmation}>
                        <Text style={[styles.tokenConfirmText, { color: theme.success }]}>
                            ✓ Reset token has been automatically applied
                        </Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
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
                            placeholder="Enter new password"
                            placeholderTextColor={theme.placeholderText}
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            secureTextEntry={!showPasswords.password}
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
                    <Text style={[styles.label, { color: theme.text }]}>Confirm New Password</Text>
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
                            placeholder="Confirm new password"
                            placeholderTextColor={theme.placeholderText}
                            value={formData.confirmPassword}
                            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                            secureTextEntry={!showPasswords.confirmPassword}
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
                    style={[styles.resetButton, { backgroundColor: theme.buttonBackground }]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.buttonText} />
                    ) : (
                        <Text style={[styles.resetButtonText, { color: theme.buttonText }]}>Reset Password</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/login')}
                >
                    <Text style={[styles.backButtonText, { color: theme.accent }]}>Back to Login</Text>
                </TouchableOpacity>

                {hasToken && !showTokenInput && (
                    <TouchableOpacity
                        style={styles.manualTokenButton}
                        onPress={() => setShowTokenInput(true)}
                    >
                        <Text style={[styles.manualTokenText, { color: theme.accent }]}>
                            Enter token manually
                        </Text>
                    </TouchableOpacity>
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
    helpText: {
        fontSize: 12,
        marginTop: 6,
        fontStyle: 'italic',
    },
    eyeIcon: {
        padding: 8,
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
        marginBottom: 8,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    manualTokenButton: {
        paddingVertical: 8,
        alignItems: 'center',
    },
    manualTokenText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    tokenConfirmation: {
        marginBottom: 20,
        alignItems: 'center',
    },
    tokenConfirmText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    successContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    successIcon: {
        fontSize: 60,
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    redirectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    redirectText: {
        fontSize: 14,
        fontStyle: 'italic',
        marginLeft: 8,
    },
});
