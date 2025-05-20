module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['<rootDir>/src/tests/integration/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupIntegration.js'],
    moduleDirectories: ['node_modules', 'src'],
};
