const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSubject = require('../../helpers/createSubject');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createCampus();

    const subject = ['Sociales', 'Matematicas', 'Español', 'Inglés']

    await createAcademicLevels(tokenAdministrator, 'idImage', true);

    for (let index = 0; index < 4; index++) {
        await createSubject(tokenAdministrator, subject[index], 4, 1)
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have permission to access the non-visible recursive', async() => {
        const res = await request.get('/api/v1/subject/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token and the recursive not visible', async() => {
        const res = await request.get('/api/v1/subject/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if the academicLevels recurse not found', async() => {
        const res = await request.get('/api/v1/subject/134')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error if the recurse not found', async() => {
        const res = await request.get('/api/v1/subject/1/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should get', () => {
    test('should get one', async () => {
        const res = await request.get('/api/v1/subject/1/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get four', async() => {
        const res = await request.get('/api/v1/subject/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(4);
    });
})