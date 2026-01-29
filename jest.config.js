/**
 * Jest configuration for Operaton Cockpit Plugins.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock ESM modules
    '^query-string$': '<rootDir>/src/__mocks__/query-string.ts',
    '^min-dom$': '<rootDir>/src/__mocks__/min-dom.ts',
    '^svg-curves$': '<rootDir>/src/__mocks__/svg-curves.ts',
    '^tiny-svg$': '<rootDir>/src/__mocks__/tiny-svg.ts',
  },
  // setupFiles runs BEFORE the test environment is set up
  setupFiles: ['<rootDir>/src/setupPolyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/operaton.ts', // Auto-generated from OpenAPI spec
  ],
  coverageThreshold: {
    global: {
      // Coverage thresholds - track current baseline, prevent regression
      branches: 35,
      functions: 55,
      lines: 55,
      statements: 55,
    },
    // Higher thresholds for utility functions (pure, well-tested)
    './src/utils/': {
      branches: 55,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(bpmn-js|diagram-js|min-dash|min-dom|msw|@mswjs|until-async)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Handle ESM modules - transform both TS/TSX and JS files from ESM packages
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
    '^.+\\.jsx?$': 'babel-jest',
  },
  // Force Jest to exit after tests complete to avoid open handle warnings
  forceExit: true,
};
