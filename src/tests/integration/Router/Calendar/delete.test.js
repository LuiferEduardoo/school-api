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
        const res = await request.delete('/api/v1/calendar/1');
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.delete('/api/v1/calendar/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401); 
    });
});

describe('should delete', () => {
    test('should delete event', async() => {
        const res = await request.delete('/api/v1/calendar/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
        
        expect(res.statusCode).toBe(200); 
        const getCalendar = await request.get(`/api/v1/calendar/1`)
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        
        expect(getCalendar.statusCode).toBe(404);
    });
});