import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginRequest } from '@/types/auth-types';
import { fetchApi } from '@/utils/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from AsyncStorage on app start
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);

                    // Ensure computed properties exist
                    if (!parsedUser.name) {
                        parsedUser.name = `${parsedUser.firstName || ''} ${parsedUser.lastName || ''}`.trim() || parsedUser.userName;
                    }

                    if (!parsedUser.initials) {
                        parsedUser.initials = getInitials(parsedUser.firstName, parsedUser.lastName, parsedUser.userName);
                    }

                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Failed to load user from storage:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (loginData: LoginRequest) => {
        try {
            setIsLoading(true);

            // Clear any previous user data
            await AsyncStorage.removeItem('user');

            const response = await fetchApi('/account/authenticate', {
                method: 'POST',
                body: JSON.stringify(loginData)
            });

            if (response && response.jwToken) {
                const userData = {
                    id: response.id,
                    email: response.email,
                    userName: response.userName,
                    firstName: response.firstName || '',
                    lastName: response.lastName || '',
                    roles: response.roles || [],
                    token: response.jwToken,
                    // Add computed properties
                    name: `${response.firstName || ''} ${response.lastName || ''}`.trim() || response.userName,
                    initials: getInitials(response.firstName, response.lastName, response.userName),
                };

                // Save to AsyncStorage
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        try {
            setIsLoading(true);
            if (!user) {
                throw new Error('No user is currently authenticated');
            }

            // Update user in API
            const updatedUserData = await fetchApi('/account/update-profile', {
                method: 'PUT',
                body: JSON.stringify(userData)
            });

            // Merge the existing user data with the updated data
            const newUserData = { ...user, ...updatedUserData };

            // Update computed properties
            newUserData.name = `${newUserData.firstName || ''} ${newUserData.lastName || ''}`.trim() || newUserData.userName;
            newUserData.initials = getInitials(newUserData.firstName, newUserData.lastName, newUserData.userName);

            // Save to AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(newUserData));

            // Update state
            setUser(newUserData);
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to generate initials
    const getInitials = (firstName?: string, lastName?: string, userName?: string): string => {
        if (firstName && lastName) {
            return `${firstName[0]}${lastName[0]}`.toUpperCase();
        } else if (firstName) {
            return firstName[0].toUpperCase();
        } else if (userName) {
            return userName[0].toUpperCase();
        }
        return 'U';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
