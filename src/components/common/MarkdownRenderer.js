import React from 'react';
import Markdown from 'react-native-markdown-display';
import { Radius, Spacing, Typography } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

export function MarkdownRenderer({ content, style }) {
  const { colors } = useTheme();

  const markdownStyle = {
    body: {
      color: colors.textPrimary,
      fontSize: Typography.fontSize.subheadline,
      lineHeight: Typography.lineHeight.normal,
    },
    heading1: {
      fontSize: 26,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginTop: Spacing.xl,
      marginBottom: Spacing.sm,
      lineHeight: 34,
    },
    heading2: {
      fontSize: Typography.fontSize.title2,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
      lineHeight: 30,
    },
    heading3: {
      fontSize: 19,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      lineHeight: Typography.lineHeight.relaxed,
    },
    heading4: {
      fontSize: Typography.fontSize.body,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      lineHeight: 24,
    },
    heading5: {
      fontSize: Typography.fontSize.subheadline,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
      lineHeight: Typography.lineHeight.normal,
    },
    heading6: {
      fontSize: Typography.fontSize.footnote,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textTertiary,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
      lineHeight: Typography.lineHeight.tight,
    },
    strong: {
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
    },
    em: {
      fontStyle: 'italic',
      color: colors.textPrimary,
    },
    code_inline: {
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: Typography.fontSize.footnote,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: Radius.xs,
      borderCurve: 'continuous',
    },
    code_block: {
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: Typography.fontSize.footnote,
      lineHeight: Typography.lineHeight.tight,
      padding: Spacing.md,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    fence: {
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: Typography.fontSize.footnote,
      lineHeight: Typography.lineHeight.tight,
      padding: Spacing.md,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    bullet_list: {
      marginTop: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    ordered_list: {
      marginTop: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    bullet_list_icon: {
      color: colors.textSecondary,
      fontSize: Typography.fontSize.subheadline,
      lineHeight: Typography.lineHeight.normal,
      marginRight: Spacing.sm,
    },
    ordered_list_icon: {
      color: colors.textSecondary,
      fontSize: Typography.fontSize.subheadline,
      lineHeight: Typography.lineHeight.normal,
      marginRight: Spacing.sm,
    },
    blockquote: {
      backgroundColor: colors.bg,
      borderLeftColor: colors.primary,
      borderLeftWidth: 3,
      paddingLeft: Spacing.md,
      paddingRight: Spacing.md,
      paddingVertical: Spacing.xs,
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
      borderRadius: Radius.xs,
      borderCurve: 'continuous',
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    text: {
      color: colors.textPrimary,
    },
    hr: {
      backgroundColor: colors.divider,
      height: 1,
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
    },
    table: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: Radius.sm,
      borderCurve: 'continuous',
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    thead: {
      backgroundColor: colors.bg,
    },
    th: {
      padding: Spacing.sm,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
    },
    tbody: {},
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
      flexDirection: 'row',
    },
    td: {
      padding: Spacing.sm,
      color: colors.textPrimary,
      flex: 1,
    },
    paragraph: {
      marginTop: Spacing.xs,
      marginBottom: Spacing.xs,
      lineHeight: Typography.lineHeight.normal,
    },
  };

  return (
    <Markdown style={markdownStyle} mergeStyle>
      {content}
    </Markdown>
  );
}
