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
    },
  },
];
