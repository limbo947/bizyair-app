const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/**', 'android/**', 'ios/**', 'apk/**', '.trae/**'],
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ios.js', '.android.js', '.web.js'],
        },
      },
      'import/ignore': ['@expo/vector-icons', 'react-native'],
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['@expo/vector-icons', 'react-native'] }],
      'import/namespace': ['error', { allowComputed: true }],
      // Expo SDK imperative API (expo-audio/expo-video) returns mutable player objects;
      // adding player to deps causes infinite re-renders, so downgrade to warn
      'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '(useCallback|useMemo)' }],
    },
  },
];
