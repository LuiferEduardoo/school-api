const readingTime = require('../../../utils/manipulation/readingTime');

describe('readingTime', () => {
    test('should correctly convert a short text to reading time', () => {
        const text = "This is a short text.";
        expect(readingTime(text)).toBe("00:01:00");
    });

    test('should correctly convert a longer text to reading time', () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.";
        expect(readingTime(text)).toBe("00:01:00");
    });

    test('should correctly handle an empty text', () => {
        const text = "";
        expect(readingTime(text)).toBe("00:00:00");
    });

    test('should correctly handle a text with one word', () => {
        const text = "Hello";
        expect(readingTime(text)).toBe("00:01:00");
    });

    test('should correctly handle a text with 225 words', () => {
        const text = "word ".repeat(225).trim();
        expect(readingTime(text)).toBe("00:01:00");
    });

    test('should correctly handle a text with 450 words', () => {
        const text = "word ".repeat(450).trim();
        expect(readingTime(text)).toBe("00:02:00");
    });
});
