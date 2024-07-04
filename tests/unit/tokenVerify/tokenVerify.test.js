const jwt = require('jsonwebtoken');
const { config } = require('../../../config/config');
const { tokenVerify } = require('../../../libs/token-verify');

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe('tokenVerify', () => {
    const token = 'sampleToken';
    const payload = { sub: '12345', name: 'Test User' };

    beforeEach(() => {
        jest.clearAllMocks();
        config.jwtSecretAccessToken = 'testAccessTokenSecret';
        config.jwtSecretRefreshToren = 'testRefreshTokenSecret';
        config.jwtSecretRecoveryPassword = 'testRecoveryPasswordSecret';
    });

    test('should verify a token with access secret', () => {
        jwt.verify.mockReturnValue(payload);

        const result = tokenVerify(token, 'jwtSecretAccessToken');

        expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecretAccessToken);
        expect(result).toEqual(payload);
    });

    test('should verify a token with refresh secret', () => {
        jwt.verify.mockReturnValue(payload);

        const result = tokenVerify(token, 'jwtSecretRefreshToren');

        expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecretRefreshToren);
        expect(result).toEqual(payload);
    });

    test('should verify a token with recovery secret', () => {
        jwt.verify.mockReturnValue(payload);

        const result = tokenVerify(token, 'jwtSecretRecoveryPassword');

        expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecretRecoveryPassword);
        expect(result).toEqual(payload);
    });

    test('should throw an error if token is invalid', () => {
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        expect(() => tokenVerify(token, 'jwtSecretAccessToken')).toThrow('Invalid token');
    });
});