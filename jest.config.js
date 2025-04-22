export default {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // For ES Modules
    experimental: {
      vm: true
    }
  };