module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testMatch: ['**/tests/unit/**/*.test.js'],
    moduleDirectories: ['node_modules', 'src'],
};
