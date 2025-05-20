const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSubject = require('../../helpers/createSubject');
const createSchoolCourse = require('../../helpers/createSchoolCourse');
const createSchedule = require('../../helpers/createSchedule');

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
    await createSchoolCourse(tokenAdministrator, 1, 6, 1);

});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.post('/api/v1/schedule/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    
    test('should throw an error if it has no token', async() => {
        const res = await request.post('/api/v1/schedule/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if subject not found', async() => {
        const res = await createSchedule(tokenAdministrator, 143, 'Viernes');
        expect(res.statusCode).toBe(404); 
    });
});

describe('should create', () => {
    test('should create in subject', async() => {
        const subject = await createSchedule(tokenAdministrator, 1, 'Martes');
        expect(subject.statusCode).toBe(201); 
    });
})