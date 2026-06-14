import { View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { AppProvider } from '../src/context/AppContext';
import { ToastProvider } from '../src/context/ToastContext';
import { ErrorBoundary } from '../src/components/layout/ErrorBoundary';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { NetworkStatusBar } from '../src/components/NetworkStatusBar';

function RootLayoutNav() {
  const { colors, themeMode } = useTheme();
  const { isConnected } = useNetworkStatus();
  return (
    <View style={{ flex: 1 }}>
      <NetworkStatusBar isConnected={isConnected} />
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.card} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="model-select" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <ToastProvider>
            <ErrorBoundary>
              <RootLayoutNav />
            </ErrorBoundary>
          </ToastProvider>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
