module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  ignorePatterns: ['dist/', 'node_modules/'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx'],
      },
    },
  },
  rules: {
    'import/extensions': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
  },
};
