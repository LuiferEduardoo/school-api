const convertMinutesToTime = require('../../../utils/manipulation/convertMinutesToTime');

describe('convert minute to time', () => {
    test('should correctly convert 60 minutes to an hour', () => {
        const minutes = 60;
        expect(convertMinutesToTime(minutes)).toBe('01:00:00');
    });

    test('should correctly convert 70 minutes to an hour and 10 minutes', () => {
        const minutes = 70;
        expect(convertMinutesToTime(minutes)).toBe('01:10:00');
    });

    test('should correctly convert 90.5 minutes to an hour, 30 minutes and 30 seconds', () => {
        const minutes = 90.5;
        expect(convertMinutesToTime(minutes)).toBe('01:30:30');
    });

    test('should correclty convert 100.8 minutes to an hour, 40 minutes and 48 seconds', () => {
        const minutes = 100.8;
        expect(convertMinutesToTime(minutes)).toBe('01:40:48');
    })

    test('should correclty convert 0 minutes to 0 hour, 0 minutes and 0 seconds', () => {
        const minutes = 0;
        expect(convertMinutesToTime(minutes)).toBe('00:00:00');
    })
});