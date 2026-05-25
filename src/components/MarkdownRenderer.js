import React from 'react';
import Markdown from 'react-native-markdown-display';
import { Radius, Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export function MarkdownRenderer({ content, style }) {
  const { colors } = useTheme();

  const markdownStyle = {
    body: {
      color: colors.textPrimary,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: Spacing.xl,
      marginBottom: Spacing.sm,
      lineHeight: 34,
    },
    heading2: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
      lineHeight: 30,
    },
    heading3: {
      fontSize: 19,
      fontWeight: '600',
      color: colors.textPrimary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      lineHeight: 26,
    },
    heading4: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
      lineHeight: 24,
    },
    heading5: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
      lineHeight: 22,
    },
    heading6: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textTertiary,
      marginTop: Spacing.sm,
      marginBottom: Spacing.xs,
      lineHeight: 20,
    },
    strong: {
      fontWeight: '700',
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
      fontSize: 13,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: Radius.xs,
    },
    code_block: {
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 20,
      padding: Spacing.md,
      borderRadius: Radius.sm,
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    fence: {
      backgroundColor: colors.bg,
      color: colors.textPrimary,
      fontFamily: 'monospace',
      fontSize: 13,
      lineHeight: 20,
      padding: Spacing.md,
      borderRadius: Radius.sm,
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
      fontSize: 15,
      lineHeight: 22,
      marginRight: Spacing.sm,
    },
    ordered_list_icon: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
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
      marginTop: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    thead: {
      backgroundColor: colors.bg,
    },
    th: {
      padding: Spacing.sm,
      fontWeight: '600',
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
      lineHeight: 22,
    },
  };

  return (
    <Markdown style={markdownStyle} mergeStyle>
      {content}
    </Markdown>
  );
}
