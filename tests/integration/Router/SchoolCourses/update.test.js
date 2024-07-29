const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSchoolCourse = require('../../helpers/createSchoolCourse');

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

    await createSchoolCourse(tokenAdministrator, 1, 6, 1);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.patch('/api/v1/school-courses/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.patch('/api/v1/school-courses/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if it not found', async() => {
        const res = await request.patch('/api/v1/school-courses/234')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should update', ()=> {
    test('should update grade and course', async() => {
        const res = await request.patch('/api/v1/school-courses/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                grade: 7,
                course: 2
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Curso actualizado con exito');
        const academicLevels = await request.get('/api/v1/school-courses/1/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(academicLevels.body.course).toBe(2);
        expect(academicLevels.body.schoolGrade.grade).toBe(7);
    });
});