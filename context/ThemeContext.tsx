import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
}

export interface Theme {
  background: string;
  text: string;
  inputBackground: string;
  inputBorder: string;
  buttonBackground: string;
  buttonText: string;
  card: string;
  accent: string;
  error: string;
  success: string;
  placeholderText: string; // Add the missing property
} 

export const lightTheme: Theme = {
  background: '#fff',
  text: '#000',
  inputBackground: '#fff',
  inputBorder: '#ddd',
  buttonBackground: '#000',
  buttonText: '#fff',
  card: '#f8f9fa',
  accent: '#2563eb',
  error: '#ef4444',
  success: '#10b981',
  placeholderText: '#999',
};

export const darkTheme: Theme = {
  background: '#121212',
  text: '#fff',
  inputBackground: '#2a2a2a',
  inputBorder: '#444',
  buttonBackground: '#2563eb',
  buttonText: '#fff',
  card: '#1e1e1e',
  accent: '#3b82f6',
  error: '#f87171',
  success: '#34d399',
  placeholderText: '#aaa',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  // Save theme preference when it changes
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('themePreference', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isLoaded]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}