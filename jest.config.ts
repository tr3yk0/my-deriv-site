/**
 * Jest configuration (jest.config.ts)
 *
 * Upgraded for reliability, performance, and clearer defaults for a TypeScript + React codebase.
 * - Uses ts-jest presets for mixed JS/TS projects
 * - Safer transforms and ignore patterns
 * - Improved coverage collection and thresholds
 * - Faster local runs with sensible defaults (cache, workers, timeouts)
 */

import type { Config } from 'jest';

const config: Config = {
    // Root directory for Jest
    rootDir: __dirname,

    // Use ts-jest preset that supports JS + TS files
    preset: 'ts-jest/presets/js-with-ts',

    // Test environment
    testEnvironment: 'jsdom',

    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,

    // Restore mocks between tests to avoid cross-test leakage
    restoreMocks: true,

    // Collect coverage and where to output it
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
        '!src/**/__mocks__/**',
        '!src/**/__tests__/**',
    ],

    // Optional: enforce minimum coverage thresholds (adjust to your project's baseline)
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 80,
            statements: 80,
        },
    },

    // Module resolution
    moduleDirectories: ['node_modules', 'shared'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'json', 'node'],

    // Map static assets and internal path aliases to mocks or real modules
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
        'react-dom/server': '<rootDir>/__mocks__/react-dom-server.js',
        '@deriv-com/translations': '<rootDir>/__mocks__/translation.mock.js',
        '@deriv-com/ui': '<rootDir>/node_modules/@deriv-com/ui',
        '@deriv-com/auth-client': '<rootDir>/node_modules/@deriv-com/auth-client',
        '^@/external/(.*)$': '<rootDir>/src/external/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@/stores/(.*)$': '<rootDir>/src/stores/$1',
        '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    },

    // Transform settings: use babel-jest for JS/JSX and ts-jest for TS/TSX where needed
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.xml$': 'jest-transform-stub',
    },

    // Ignore transforming most node_modules but allow specific scoped packages
    transformIgnorePatterns: [
        '/node_modules/(?!(@deriv-com/ui|@deriv-com/auth-client)/).+\\.js$',
    ],

    // Setup files and environment
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    setupFiles: ['<rootDir>/jest.env.setup.js'],

    // Test discovery
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

    // Performance and reliability
    maxWorkers: '50%',
    testTimeout: 30000,
    slowTestThreshold: 10,

    // Cache and watch settings
    cacheDirectory: '<rootDir>/.jest-cache',
    watchPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/build/'],

    // Reporter defaults (keep default reporter; CI can add junit or other reporters)
    // reporters: ['default'],

    // ts-jest specific configuration via globals
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.json',
            diagnostics: {
                warnOnly: true,
            },
            isolatedModules: true,
        },
    },

    // Verbose output only when explicitly requested
    verbose: false,
};

export default config;
