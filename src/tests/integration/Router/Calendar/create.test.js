const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createCalendar = require('../../helpers/createCalendar');
const { sequelize } = require('../../../../libs/sequelize');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    const isVisibleList = [false];

    for (let index = 0; index < 4; index++) {
        await createCalendar(tokenAdministrator, isVisibleList[index]);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw an error', () => {
    test('should throw an error if it has no token', async() => {
        const res = await request.post('/api/v1/calendar');
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.post('/api/v1/calendar')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401); 
    });
});

describe('should create', () => {
    test('should create events', async() => {
        const res = await request.post('/api/v1/calendar')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: "this is the title",
                description: "this is the description",
                startDate: "2024-07-30T14:41:00.000Z",
                endDate: "2024-07-30T16:41:00.000Z"
            })
        expect(res.statusCode).toBe(201); 
    });
})