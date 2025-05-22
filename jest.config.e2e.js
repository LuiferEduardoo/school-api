module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['<rootDir>/src/tests/e2e/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupE2E.js'],
    moduleDirectories: ['node_modules', 'src'],
};
