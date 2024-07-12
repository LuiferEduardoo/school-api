module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/tests/integration/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setupIntegration.js'],
    moduleDirectories: ['node_modules', 'src'],
    testTimeout: 40000
};
