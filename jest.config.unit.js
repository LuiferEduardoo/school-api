module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['<rootDir>/src/tests/unit/**/*.test.js'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setupUnit.js'],
    moduleDirectories: ['node_modules', 'src'],
    testTimeout: 40000
};
