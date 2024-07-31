const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createCalendar = require('../../helpers/createCalendar');

let redisClient;
let tokenAdministrator;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');

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
    test('should throw an error, the event is not visible', async() => {
        const res = await request.get('/api/v1/calendar/1');
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error, the event not found', async() => {
        const res = await request.get('/api/v1/calendar/134');
        expect(res.statusCode).toBe(404); 
    });
});

describe('should get events', () => {
    test('should get events if is not visible', async() => {
        const res = await request.get('/api/v1/calendar/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
    });

    test('should get one event', async() => {
        const res = await request.get('/api/v1/calendar/2')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
    });

    test('should get all events', async() => {
        const res = await request.get('/api/v1/calendar')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });
})