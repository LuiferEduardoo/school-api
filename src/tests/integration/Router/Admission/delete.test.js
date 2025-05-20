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
    await createAdmission(true);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getAdmissionRequest = async(id) => {
    return await request.get(`/api/v1/admission/request/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
}

describe('should throw error', () => {
    test('should throw an error if the user does not have token', async() => {
        const res = await request.delete('/api/v1/admission/request/1')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.delete('/api/v1/admission/request/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the request admission not found', async() => {
        const res = await request.delete('/api/v1/admission/request/345')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404);
    });
});

describe('should update', () => {
    test('should get udate admission', async() => {
        const res = await request
            .delete('/api/v1/admission/request/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
        
        expect(res.statusCode).toBe(200);
        const resGetAdmission = await getAdmissionRequest(1);
        expect(resGetAdmission.statusCode).toBe(404);
    });;
});