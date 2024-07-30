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
        const res = await request.post('/api/v1/user')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have token', async() => {
        const res = await request.post('/api/v1/user')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.post('/api/v1/user')
            .set('Authorization', `Bearer ${tokenStudentOne}`)
            .send({
                username: "juanperez",
                name: "Juan",
                lastName: "Perez",
                email: "juanperez@mail.com",
                password: "#{=a3:53NMou",
                rol: "docente"
            })
        expect(res.statusCode).toBe(401);
    });
});

describe('shoul create', () => {
    test('should create a user', async() => {
        const res = await request.post('/api/v1/user')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                username: "juanperez",
                name: "Juan",
                lastName: "Perez",
                email: "juanperez@mail.com",
                password: "#{=a3:53NMou",
                rol: "docente"
            })
            expect(res.statusCode).toBe(201);
    })
})