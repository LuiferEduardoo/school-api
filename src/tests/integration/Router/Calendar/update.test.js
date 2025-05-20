const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createCalendar = require('../../helpers/createCalendar');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createCalendar(tokenAdministrator, true);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw an error', () => {
    test('should throw an error if it has no token', async() => {
        const res = await request.patch('/api/v1/calendar');
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.patch('/api/v1/calendar')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401); 
    });
});

describe('should update', () => {
    test('should update event', async() => {
        const res = await request.patch('/api/v1/calendar/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: "this is the new title",
                description: "this is new the description",
                startDate: "2024-07-31T14:41:00.000Z",
                endDate: "2024-07-31T16:41:00.000Z",
                visible: false
            });
        expect(res.statusCode).toBe(200); 
        const getCalendar = await request.get(`/api/v1/calendar/1`)
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        
        expect(getCalendar.body.title).toBe('this is the new title');
        expect(getCalendar.body.description).toBe('this is new the description');
        expect(getCalendar.body.startDate).toBe('2024-07-31T14:41:00.000Z');
        expect(getCalendar.body.endDate).toBe('2024-07-31T16:41:00.000Z');
        expect(getCalendar.body.visible).toBe(false);
    });
});