import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, Radius } from '../constants/theme';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          retry: this.handleRetry,
        });
      }
      return (
        <DefaultErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, onRetry }) {
  const { colors } = useTheme();

  return (
    <View style={[defaultStyles.container, { backgroundColor: colors.bg }]}>
      <View style={defaultStyles.iconWrap}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
      </View>
      <Text style={[defaultStyles.title, { color: colors.textPrimary }]}>页面出现异常</Text>
      <Text style={[defaultStyles.message, { color: colors.textSecondary }]}>
        {error?.message || '未知错误，请重试'}
      </Text>
      <Pressable
        style={({ pressed }) => [defaultStyles.retryButton, { backgroundColor: colors.primary }, pressed && { opacity: 0.7 }]} onPress={onRetry} >
        <Text style={[defaultStyles.retryText, { color: colors.textInverse }]}>重试</Text>
      </Pressable>
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  iconWrap: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  retryButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
