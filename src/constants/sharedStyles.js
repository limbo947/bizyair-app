import { Radius, Spacing, Typography } from './theme';

export const badgeBase = {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: Radius.full,
  borderCurve: 'continuous',
  paddingHorizontal: Spacing.sm,
  paddingVertical: 3,
  gap: Spacing.xs,
};

export const avatarBase = {
  borderRadius: Radius.full,
  borderCurve: 'continuous',
};

export const emptyIconSize = 48;
export const emptyPanelIconSize = 36;

export const createSharedStyles = (colors) => ({
  card: {
    backgroundColor: colors.card,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  selectorButton: {
    width: '18%',
    paddingVertical: Spacing.sm + 1,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorButtonActive: {
    backgroundColor: colors.primary,
  },
  selectorText: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  selectorTextActive: {
    color: colors.textInverse,
    fontWeight: Typography.fontWeight.semibold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimInputFull: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: Radius.sm,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.footnote,
    color: colors.textPrimary,
  },
  pressedStyle: {
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.title3,
    color: colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.footnote,
    color: colors.textTertiary,
  },
});
