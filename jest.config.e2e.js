module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['<rootDir>/src/tests/e2e/**/*.test.js'],
    moduleDirectories: ['node_modules', 'src'],
};
