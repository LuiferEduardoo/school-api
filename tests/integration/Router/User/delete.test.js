const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {

    test('should throw an error if the user does not have token', async() => {
        const res = await request.delete('/api/v1/user/2')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.delete('/api/v1/user/2')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user not found', async() => {
        const res = await request.delete('/api/v1/user/234')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404);
    });
});

describe('should delete', () => {
    test('should delete the user', async() => {
        const res = await request.delete('/api/v1/user/9')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });
});