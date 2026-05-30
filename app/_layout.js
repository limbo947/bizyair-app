import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { AppProvider } from '../src/context/AppContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

function RootLayoutNav() {
  const { colors, themeMode } = useTheme();
  return (
    <>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.card} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="model-select" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
