const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSubject = require('../../helpers/createSubject');
const createSchoolCourse = require('../../helpers/createSchoolCourse');
const createSchedule = require('../../helpers/createSchedule');

let redisClient;
let tokenAdministrator;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');

    await createCampus();

    await createAcademicLevels(tokenAdministrator, 'idImage', true);

    await createSubject(tokenAdministrator, 'Sociales', 4, 1);

    await createSchoolCourse(tokenAdministrator, 1, 6, 1);

    const dayWeek = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes'
    ]

    for (let index = 0; index < dayWeek.length; index++) {
        await createSchedule(tokenAdministrator, 1, dayWeek[index]);
    }

});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the course recurse not found', async() => {
        const res = await request.get('/api/v1/schedule/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error if the recurse not found', async() => {
        const res = await request.get('/api/v1/schedule/1/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should get', () => {
    test('should get one', async () => {
        const res = await request.get('/api/v1/schedule/1/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get four', async() => {
        const res = await request.get('/api/v1/schedule/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.length).toBe(5);
    });
});