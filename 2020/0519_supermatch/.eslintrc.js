module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'html',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'prefer-arrow-callback': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'max-classes-per-file': ['error', 2],
    'max-len': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
  },
};
