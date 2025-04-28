import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginRequest, AuthResponse } from '@/types/auth-types';
import { fetchApi } from '@/utils/api';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

      // Reset theme to system preference on logout
      try {
        const systemTheme = await AsyncStorage.getItem('themePreference');
        // We don't need to await this as it's not critical
        AsyncStorage.setItem('themePreference', systemTheme || 'light');
      } catch (e) {
        console.error('Error resetting theme on logout:', e);
      }

      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
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
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};