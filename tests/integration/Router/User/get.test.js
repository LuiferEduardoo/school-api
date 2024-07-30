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
        const res = await request.get('/api/v1/users')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have token', async() => {
        const res = await request.get('/api/v1/user')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.get('/api/v1/users')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user not found', async() => {
        const res = await request.get('/api/v1/users/345')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404);
    });
});

describe('should get', () => {
    test('should get information from the user who logged in', async() => {
        const res = await request.get('/api/v1/user')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get one user', async() => {
        const res = await request.get('/api/v1/users/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get some users', async() => {
        const res = await request.get('/api/v1/users')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.elements.length).toBe(10);
    });

    test('should get users with query', async() => {
        const resOne = await request.get('/api/v1/users?rol=docente')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resOne.statusCode).toBe(200);
        expect(resOne.body.elements.length).toBe(2);

        const resTwo = await request.get('/api/v1/users?active=false')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resTwo.statusCode).toBe(200);
        expect(resTwo.body.elements.length).toBe(1);

        const resThree = await request.get(`/api/v1/users?search=adminis`)
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resThree.statusCode).toBe(200);
        expect(resThree.body.elements.length).toBe(1);
    });
});