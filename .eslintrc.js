// .eslintrc.js — upgraded and opinionated ESLint configuration
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es2022: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    Blockly: 'readonly',
    trackJs: 'readonly',
    dataLayer: 'readonly',
    goog: 'readonly',
    google: 'readonly',
    gapi: 'readonly',
    __webpack_public_path__: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier'
  ],
  plugins: [
    'react',
    'react-hooks',
    'simple-import-sort',
    '@typescript-eslint',
    'import',
    'unused-imports'
  ],
  rules: {
    // Import sorting and cleanliness
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: false, optionalDependencies: false }],
    'unused-imports/no-unused-imports': 'warn',

    // React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-const': 'warn',
    'eqeqeq': ['error', 'always'],

    // Stylistic (kept permissive; Prettier handles formatting)
    'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],

    // Allow certain patterns used in the codebase
    'no-underscore-dangle': 'off'
  },
  overrides: [
    // JavaScript files (legacy or test helpers)
    {
      files: ['**/*.js'],
      parserOptions: { ecmaVersion: 2021 },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },

    // Test files
    {
      files: ['**/__tests__/**', '**/*.spec.*', '**/*.test.*'],
      env: { jest: true },
      rules: {
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    },

    // TypeScript React files
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              // Side effect imports
              ['^\\u0000'],
              // Packages. `react` first then other packages
              ['^react$', '^[a-z]'],
              // Scoped packages
              ['^@'],
              // Absolute imports (aliases)
              ['^~', '^Components', '^Constants', '^Utils', '^Types', '^Stores'],
              // Parent imports
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Relative imports
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports
              ['^.+\\.s?css$']
            ]
          }
        ]
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'out/',
    'public/',
    '.husky/',
    '.github/',
    '.vercel/',
    '.next/',
    '.cache/',
    'coverage/',
    'logs/',
    '*.log',
    'rsbuild.config.ts',
    '.eslintrc.js',
    '.eslintrc.cjs'
  ]
};
