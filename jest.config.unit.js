module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/tests/unit/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setupUnit.js'],
    moduleDirectories: ['node_modules', 'src'],
    testTimeout: 40000
};
