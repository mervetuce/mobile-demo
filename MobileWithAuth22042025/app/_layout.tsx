import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { UserProvider } from '@/context/UserContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { ReviewProvider } from '@/context/ReviewContext';
import { AuthProvider } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

// ThemedApp component wrapped with UserProvider
function ThemedUserApp() {
  const { isDarkMode, theme } = useTheme();

  return (
    <UserProvider>
      <ReviewProvider>
        <View style={{ flex: 1, backgroundColor: theme.background }}>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.background
              },
            }}
          />
        </View>
      </ReviewProvider>
    </UserProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ThemedUserApp />
      </AuthProvider>
    </ThemeProvider>
  );
}