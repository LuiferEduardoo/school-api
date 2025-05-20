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

    await createAcademicLevels(tokenAdministrator, 'idImage', true);

    await createSubject(tokenAdministrator, 'Sociales', 4, 1);

});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.delete('/api/v1/subject/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.delete('/api/v1/subject/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if it not found', async() => {
        const res = await request.delete('/api/v1/subject/346')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should delete', ()=> {
    test('should delete in subject', async() => {
        const res = await request.delete('/api/v1/subject/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
        expect(res.statusCode).toBe(200);
        const subject = await request.get(`/api/v1/subject/1/1`)
            .set('Authorization', `Bearer ${tokenAdministrator}`);;
        expect(subject.statusCode).toBe(404);
    });
});