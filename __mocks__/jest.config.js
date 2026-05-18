module.exports = {
  // ✅ Use jsdom so you can test React components in a browser-like environment
  testEnvironment: 'jsdom',

  // ✅ Map non-JS imports to mocks
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },

  // ✅ Setup files run before tests (WebSocket mock, etc.)
  setupFiles: ['<rootDir>/__mocks__/websocketMock.js'],

  // ✅ Transform modern JS/JSX with Babel
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  // ✅ Ignore transforms for node_modules except specific packages if needed
  transformIgnorePatterns: [
    '/node_modules/(?!(@deriv/api|some-esm-package)/)',
  ],

  // ✅ Collect coverage for critical folders
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/index.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json'],

  // ✅ Run tests in parallel for speed
  maxWorkers: '50%',

  // ✅ Clear mocks between tests
  clearMocks: true,

  // ✅ Helpful test match patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],

  // ✅ Watch plugins for better DX
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
