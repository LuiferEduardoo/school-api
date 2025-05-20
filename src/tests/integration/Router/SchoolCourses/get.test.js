const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSchoolCourse = require('../../helpers/createSchoolCourse');

let redisClient;
let tokenAdministrator;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');

    await createCampus();

    await createAcademicLevels(tokenAdministrator, 'idImage', true);

    const grade = [6,7,8,9,10,11];

    for (let index = 0; index < grade.length; index++) {
        await createSchoolCourse(tokenAdministrator, 1, grade[index], 1);
    }

});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the academicLevels recurse not found', async() => {
        const res = await request.get('/api/v1/school-courses/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error if the recurse not found', async() => {
        const res = await request.get('/api/v1/school-courses/1/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should get', () => {
    test('should get one', async () => {
        const res = await request.get('/api/v1/school-courses/1/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get four', async() => {
        const res = await request.get('/api/v1/school-courses/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(6);
    });
});