const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/**', 'android/**', 'ios/**', 'apk/**'],
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.ios.js', '.android.js', '.web.js'],
        },
      },
      'import/ignore': ['@expo/vector-icons', 'react-native'],
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['@expo/vector-icons'] }],
      'import/namespace': ['error', { allowComputed: true }],
    },
  },
];
