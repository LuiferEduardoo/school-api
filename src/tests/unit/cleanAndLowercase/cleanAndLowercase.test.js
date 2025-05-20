const cleanAndLowercase = require('../../../utils/manipulation/cleanAndLowercase');

describe('cleanAndLowercase', () => {
    test('should remove accents and convert to lowercase', () => {
        const inputText = "Álvaro López";
        const expectedOutput = "alvaro lopez";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });

    test('should remove special characters and convert to lowercase', () => {
        const inputText = "This! Is a @test Text";
        const expectedOutput = "this is a test text";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });

    test('should handle empty input', () => {
        const inputText = "";
        const expectedOutput = "";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });

    test('should handle input with numbers', () => {
        const inputText = "Hello 123";
        const expectedOutput = "hello 123";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });

    test('should handle input with punctuation marks', () => {
        const inputText = "Hello! How are you?";
        const expectedOutput = "hello how are you";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });

    test('should handle input with mixed characters', () => {
        const inputText = "Álvaro López 123!@#";
        const expectedOutput = "alvaro lopez 123";
        expect(cleanAndLowercase(inputText)).toBe(expectedOutput);
    });
});