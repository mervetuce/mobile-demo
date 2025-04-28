import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ServicesLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.background,
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Our Services',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: 'Visa Details',
          headerBackTitle: 'Services',
        }}
      />
      <Stack.Screen
        name="apply"
        options={{
          headerShown: true,
          headerTitle: 'Apply for Visa',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}