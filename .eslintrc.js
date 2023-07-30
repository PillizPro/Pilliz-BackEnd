module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'default',
        'format': ['camelCase'],
        'leadingUnderscore': 'allow',
        'trailingUnderscore': 'allow',
      },
      {
        'selector': 'interface',
        'format': ['PascalCase', 'UPPER_CASE'],
        'prefix': ['I'],
        'trailingUnderscore': 'allow'
      },
      {
        'selector': 'typeAlias',
        'format': ['PascalCase', 'UPPER_CASE'],
        'trailingUnderscore': 'allow'
      },
      {
        'selector': 'enum',
        'format': ['PascalCase', 'UPPER_CASE']
      },
      {
        'selector': ['enumMember', 'objectLiteralProperty', 'typeProperty'],
        'format': ['camelCase', 'UPPER_CASE']
      },
      {
        'selector': ['objectLiteralProperty', 'typeProperty'],
        'format': ['PascalCase'],
        'types': ['boolean'],
        'prefix': ["is", "should", "has", "had", "can", "could", "did", "will", "must"]
      },
      {
        'selector': ['class', 'typeParameter'],
        'format': ['PascalCase']
      },
      {
        'selector': 'property',
        'format': ['PascalCase'],
        'types': ['boolean'],
        'prefix': ["is", "should", "has", "had", "can", "could", "did", "will", "must"]
      },
      {
        'selector': 'classProperty',
        'modifiers': ['private'],
        'format': ['PascalCase'],
        'leadingUnderscore': 'require',
        'types': ['boolean'],
        'prefix': ["is", "should", "has", "had", "can", "could", "did", "will", "must"]
      },
      {
        'selector': ['classMethod', 'classProperty'],
        'modifiers': ['private'],
        'format': ['camelCase'],
        'leadingUnderscore': 'require'
      },
      {
        'selector': 'memberLike',
        'format': ['camelCase']
      },
      {
        'selector': 'function',
        'format': ['camelCase'],
        'trailingUnderscore': 'allow'
      },
      {
        'selector': ['parameterProperty', 'parameter', 'variable'],
        'format': ['PascalCase'],
        'trailingUnderscore': 'allow',
        'types': ['boolean'],
        'prefix': ["is", "should", "has", "had", "can", "could", "did", "will", "must"]
      },
      {
        'selector': ['parameterProperty', 'variable', 'parameter'],
        'format': ['camelCase'],
        'trailingUnderscore': 'allow'
      },
      {
        'selector': 'variable',
        'modifiers': ['const', 'global'],
        'format': ['UPPER_CASE'],
        'types': ['boolean'],
        'prefix': ["IS_", "SHOULD_", "HAS_", "HAD_", "CAN_", "COULD_", "DID_", "WILL_", "MUST_"]
      },
      {
        'selector': 'variable',
        'modifiers': ['exported'],
        'format': ['UPPER_CASE'],
        'types': ['boolean'],
        'prefix': ["IS_", "SHOULD_", "HAS_", "HAD_", "CAN_", "COULD_", "DID_", "WILL_", "MUST_"]
      },
      {
        'selector': 'variable',
        'format': ['camelCase'],
        'trailingUnderscore': 'allow',
        'types': ['function']
      },
      {
        'selector': 'variable',
        'modifiers': ['const', 'global'],
        'format': ['UPPER_CASE']
      },
      {
        'selector': 'variable',
        'modifiers': ['exported'],
        'format': ['UPPER_CASE']
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eqeqeq': ['error', 'smart']
  },
};
