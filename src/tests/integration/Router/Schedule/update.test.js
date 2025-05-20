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
    await createSubject(tokenAdministrator, 'Inglés', 4, 1);

    await createSchoolCourse(tokenAdministrator, 1, 6, 1);

    await createSchedule(tokenAdministrator, 1, 'Lunes');

});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.patch('/api/v1/schedule/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.patch('/api/v1/schedule/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if not found', async() => {
        const res = await request.patch('/api/v1/schedule/342')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should update', () => {
    test('should update subjectId, dayWeek, startTime y endTime', async() => {
        const res = await request.patch('/api/v1/schedule/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                subjectId: 2,
                dayWeek: 'Martes',
                startTime: '08:00',
                endTime: '09:00'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Horario actualizado con exito');
        const schedule = await request.get('/api/v1/schedule/1/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
        expect(schedule.body.subjectId).toBe(2);
        expect(schedule.body.dayWeek.dayweek).toBe('Martes');
        expect(schedule.body.startTime).toBe('08:00:00');
        expect(schedule.body.endTime).toBe('09:00:00');
    });
});