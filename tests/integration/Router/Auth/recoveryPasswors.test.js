const { sequelize } = require('../../../../libs/sequelize');
const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');


const User = sequelize.models.User;

let redisClient;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('Recovery password', () => {
    let tokenChangePassword;

    describe('should throw error', () => {
        test('should throw an error when the email does not enter', async () => {
            const res = await request
                .post('/api/v1/auth/recovery');
    
            expect(res.statusCode).toBe(400);
        });

        test('should throw an error when the email does not exist', async () => {
            const res = await request
                .post('/api/v1/auth/recovery')
                .send({
                    email: 'directionemailnotexist@test.com'
                });
            expect(res.statusCode).toBe(200);
        });
    });

    describe('should recover', () => {
        test('should recover password', async () => {
            const res = await request
                .post('/api/v1/auth/recovery')
                .send({
                    email: 'coordinator@test.com'
                });
            const coordinatorUser = await User.findByPk(2);
            expect(res.statusCode).toBe(200);
            expect(coordinatorUser.recoveryToken).not.toBeNull();
            tokenChangePassword = coordinatorUser.recoveryToken;
        });
    });

    describe('should change password', () => {
        describe('should throw error', () => {
            test('should throw error to change password for token invalid', async () => {
                const res = await request
                    .post('/api/v1/auth/change-password')
                    .send({
                        token: 'token',
                        newPassword: 'lQ61`|wT7__c'
                    });
                expect(res.statusCode).toBe(400);
            });
    
            test('should throw an error for invalid new password because it is missing a capital letter, a number, a special character and 8 characters', async () => {
                const res = await request
                    .post('/api/v1/auth/change-password')
                    .send({
                        token: tokenChangePassword,
                        newPassword: 'dfd'
                    });
                expect(res.statusCode).toBe(400);
            });
    
            test('should throw an error for invalid new password because it is missing a number, a special character and 8 characters', async () => {
                const res = await request
                    .post('/api/v1/auth/change-password')
                    .send({
                        token: tokenChangePassword,
                        newPassword: 'dfD'
                    });
                expect(res.statusCode).toBe(400);
            });
    
            test('should throw an error for invalid new password because it is missing a special character and 8 characters', async () => {
                const res = await request
                    .post('/api/v1/auth/change-password')
                    .send({
                        token: tokenChangePassword,
                        newPassword: 'dfD2'
                    });
                expect(res.statusCode).toBe(400);
            });
        });

        describe('should set new password', () => {
            test('should set new password', async () => {
                const coordinatorUserBefore = await User.findByPk(2);
                const newPassword = 'dfD2!wds';
                const res = await request
                    .post('/api/v1/auth/change-password')
                    .send({
                        token: tokenChangePassword,
                        newPassword
                    });
                const coordinatorUserAfter = await User.findByPk(2);
                expect(res.statusCode).toBe(200);
                expect(coordinatorUserBefore.password).not.toBe(coordinatorUserAfter.password);
                expect(coordinatorUserAfter.recoveryToken).toBeNull();
            });
        });
    });
});
