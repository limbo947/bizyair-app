// ── Light Color Palette ──
export const LightColors = {
  primary: '#007AFF',
  primaryHover: '#0066D6',
  primaryLight: '#4DA2FF',
  primaryBg: '#E8F0FE',
  primaryBorder: '#B3D4FF',
  primaryDisabled: '#B3D4FF',
  success: '#34C759',
  successBg: '#E8F8ED',
  successBorder: '#A8E6B8',
  warning: '#FF9500',
  warningBg: '#FFF4E5',
  warningBorder: '#FFD699',
  error: '#FF3B30',
  errorBg: '#FFEDED',
  errorBorder: '#FFB3B0',
  info: '#5AC8FA',
  infoBg: '#EAF8FF',
  infoBorder: '#ADE4FF',
  purple: '#AF52DE',
  purpleBg: '#F4EBFF',
  purpleBorder: '#D4ADE8',
  bg: '#F2F2F7',
  card: '#FFFFFF',
  border: '#C6C6C8',
  divider: '#E5E5EA',
  inputBg: '#F2F2F7',
  disabled: '#C7C7CC',
  disabledBg: '#E5E5EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#3C3C43',
  textTertiary: '#636366',
  textPlaceholder: '#C7C7CC',
  textInverse: '#FFFFFF',
  separator: '#C6C6C8',
  groupedBg: '#FFFFFF',
  star: '#FFD700',
  textOnOverlay: '#FFFFFF',
  overlayLight: 'rgba(0,0,0,0.2)',
  overlayMedium: 'rgba(0,0,0,0.5)',
  overlayHeavy: 'rgba(0,0,0,0.85)',
};

// ── Dark Color Palette (HIG dark mode — colors brightened for contrast) ──
export const DarkColors = {
  primary: '#0A84FF',
  primaryHover: '#409CFF',
  primaryLight: '#4DA2FF',
  primaryBg: '#1C2D4A',
  primaryBorder: '#2A4A7F',
  primaryDisabled: '#2A4A7F',
  success: '#30D158',
  successBg: '#1A3A2A',
  successBorder: '#2A5A3A',
  warning: '#FF9F0A',
  warningBg: '#3A2A1A',
  warningBorder: '#5A3A1A',
  error: '#FF453A',
  errorBg: '#3A1A1A',
  errorBorder: '#5A2A2A',
  info: '#64D2FF',
  infoBg: '#1A2A3A',
  infoBorder: '#2A4A5A',
  purple: '#BF5AF2',
  purpleBg: '#2A1A3A',
  purpleBorder: '#4A2A5A',
  bg: '#000000',
  card: '#1C1C1E',
  border: '#38383A',
  divider: '#38383A',
  inputBg: '#2C2C2E',
  disabled: '#48484A',
  disabledBg: '#38383A',
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#636366',
  textPlaceholder: '#48484A',
  textInverse: '#000000',
  separator: '#38383A',
  groupedBg: '#000000',
  star: '#FFD700',
  textOnOverlay: 'rgba(255,255,255,0.9)',
  overlayLight: 'rgba(0,0,0,0.3)',
  overlayMedium: 'rgba(0,0,0,0.6)',
  overlayHeavy: 'rgba(0,0,0,0.9)',
};

// ── Design Tokens ──

export const Radius = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 22,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 32,
};

export const Typography = {
  fontSize: {
    caption2: 11,
    caption1: 12,
    footnote: 13,
    subheadline: 15,
    callout: 16,
    body: 17,
    headline: 17,
    title3: 20,
    title2: 22,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 16,
    normal: 22,
    relaxed: 26,
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.5,
  },
};

export const Shadow = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
};

export const ButtonVariants = {
  primary: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.bold,
  },
  secondary: {
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.sm,
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },
  ghost: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.medium,
  },
  small: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: Radius.xs,
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
  },
};

export const ButtonStyles = ButtonVariants;

export const pressedOpacity = (opacity = 0.7) => ({ opacity });

export const withBorderRadius = (radius) => ({
  borderRadius: radius,
  borderCurve: 'continuous',
});

// ── Theme Factory ──
export function createTheme(mode) {
  const colors = mode === 'dark' ? DarkColors : LightColors;
  return {
    mode,
    colors,
    radius: Radius,
    spacing: Spacing,
    typography: Typography,
    shadow: Shadow,
    buttonVariants: ButtonVariants,
    STATUS_COLORS: {
      Pending: colors.warning,
      Queuing: colors.warning,
      Preparing: colors.info,
      Running: colors.primary,
      Saving: colors.purple,
      Success: colors.success,
      Failed: colors.error,
    },
    STATUS_BG: {
      Pending: colors.warningBg,
      Queuing: colors.warningBg,
      Preparing: colors.infoBg,
      Running: colors.primaryBg,
      Saving: colors.purpleBg,
      Success: colors.successBg,
      Failed: colors.errorBg,
    },
  };
}
