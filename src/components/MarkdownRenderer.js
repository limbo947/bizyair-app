import React from 'react';
import Markdown from 'react-native-markdown-display';
import { Colors, Radius, Spacing } from '../constants/theme';

const markdownStyle = {
  body: {
    color: Colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    lineHeight: 34,
  },
  heading2: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    lineHeight: 30,
  },
  heading3: {
    fontSize: 19,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    lineHeight: 26,
  },
  heading4: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    lineHeight: 24,
  },
  heading5: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  heading6: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  strong: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  em: {
    fontStyle: 'italic',
    color: Colors.textPrimary,
  },
  code_inline: {
    backgroundColor: Colors.bg,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  code_block: {
    backgroundColor: Colors.bg,
    color: Colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 20,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  fence: {
    backgroundColor: Colors.bg,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginRight: Spacing.sm,
  },
  ordered_list_icon: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginRight: Spacing.sm,
  },
  blockquote: {
    backgroundColor: Colors.bg,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: Radius.xs,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  text: {
    color: Colors.textPrimary,
  },
  hr: {
    backgroundColor: Colors.divider,
    height: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  thead: {
    backgroundColor: Colors.bg,
  },
  th: {
    padding: Spacing.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tbody: {},
  tr: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    flexDirection: 'row',
  },
  td: {
    padding: Spacing.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  paragraph: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
};

export function MarkdownRenderer({ content, style }) {
  return (
    <Markdown style={markdownStyle} mergeStyle>
      {content}
    </Markdown>
  );
}
