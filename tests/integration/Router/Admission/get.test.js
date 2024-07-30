const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSchoolCourse = require('../../helpers/createSchoolCourse');
const createAdmission = require('../../helpers/createAdmission');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createCampus();
    await createAcademicLevels(tokenAdministrator, 'idImage', true);
    await createSchoolCourse(tokenAdministrator, 1, 8, 1);

    for (let index = 0; index < 3; index++) {
        await createAdmission(true);
    }
    await createAdmission();
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have token', async() => {
        const res = await request.get('/api/v1/admission/request/1')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.get('/api/v1/admission/request/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the request admission not found', async() => {
        const res = await request.get('/api/v1/admission/request/345')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404);
    });

    test('should throw an error if the status admission not found', async() => {
        const res = await request.get('/api/v1/admission/status/34235623');
        expect(res.statusCode).toBe(404);
    });
});

describe('should get', () => {
    test('should get status admission', async() => {
        const res = await request.get('/api/v1/admission/status/1046299389');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('En revisión');
    });

    test('should get one request admission', async() => {
        const res = await request.get('/api/v1/admission/request/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
    });

    test('should get request admission', async() => {
        const res = await request.get('/api/v1/admission/request')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.elements.length).toBe(4);
    });

    test('should get request admission with query', async() => {
        const resOne = await request.get('/api/v1/admission/request?gender=Masculino&academicLevels=example+name+level&grade=8&status=En+revición')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resOne.statusCode).toBe(200);
        expect(resOne.body.elements.length).toBe(0);

        const resTwo = await request.get('/api/v1/admission/request?search=1046299389')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resTwo.statusCode).toBe(200);
        expect(resTwo.body.elements.length).toBe(1);

        const now = new Date();

        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const startDateFormatted = startDate.toISOString().split('T')[0];

        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const endDateFormatted = endDate.toISOString().split('T')[0];
        const resThree = await request.get(`/api/v1/admission/request?startDate=${startDateFormatted}&endDate=${endDateFormatted}`)
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resThree.statusCode).toBe(200);
        expect(resThree.body.elements.length).toBe(4);
    });
});