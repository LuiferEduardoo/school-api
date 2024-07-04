const jwt = require('jsonwebtoken');
const { config } = require('../../../config/config');
const { saveToken } = require('../../../config/redisConfigToken');
const { signToken } = require('../../../libs/token-sing');
const ms = require('ms');

// Mockear jsonwebtoken y saveToken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

jest.mock('../../../config/redisConfigToken', () => ({
    saveToken: jest.fn(),
}));

jest.mock('ms', () => jest.fn((time) => {
    const msTime = {
        '1h': 3600000, // 1 hour in milliseconds
        '30m': 1800000, // 30 minutes in milliseconds
        '15m': 900000, // 15 minutes in milliseconds
    };
    return msTime[time];
}));

describe('signToken', () => {
    let payload;
    let time;
    let type;
    let information;

    beforeEach(() => {
        payload = { sub: '12345' };
        time = '1h';
        type = 'access';
        information = 'test information';
        jest.clearAllMocks();
        config.jwtSecretAccessToken = 'testAccessTokenSecret';
        config.jwtSecretRefreshToren = 'testRefreshTokenSecret';
        config.jwtSecretRecoveryPassword = 'testRecoveryPasswordSecret';
    });

    test('should sign a token and save it in Redis for access token', async () => {
        const expectedToken = 'signedAccessToken';
        jwt.sign.mockReturnValue(expectedToken);

        const result = await signToken(payload, time, type, information);

        expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwtSecretAccessToken, { expiresIn: time });
        expect(saveToken).toHaveBeenCalledWith(payload.sub, expectedToken, information, type, ms(time) / 1000);
        expect(result).toBe(expectedToken);
    });

    test('should sign a token and save it in Redis for refresh token', async () => {
        const expectedToken = 'signedRefreshToken';
        jwt.sign.mockReturnValue(expectedToken);
        const newType = 'refresh';

        const result = await signToken(payload, time, newType, information);

        expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwtSecretRefreshToren, { expiresIn: time });
        expect(saveToken).toHaveBeenCalledWith(payload.sub, expectedToken, information, newType, ms(time) / 1000);
        expect(result).toBe(expectedToken);
    });

    test('should sign a token and save it in Redis for recovery token', async () => {
        const expectedToken = 'signedRecoveryToken';
        jwt.sign.mockReturnValue(expectedToken);
        const newType = 'recovery';

        const result = await signToken(payload, time, newType, information);

        expect(jwt.sign).toHaveBeenCalledWith(payload, config.jwtSecretRecoveryPassword, { expiresIn: time });
        expect(saveToken).toHaveBeenCalledWith(payload.sub, expectedToken, information, newType, ms(time) / 1000);
        expect(result).toBe(expectedToken);
    });

    test('should throw an error if token type is invalid', async () => {
        const invalidType = 'invalidType';

        await expect(signToken(payload, time, invalidType, information)).rejects.toThrow();
    });
});