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
    test('should throw an error if the recurse not found', async() => {
        const res = await createSchoolCourse(tokenAdministrator, 342, 6, 1);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should create', () => {
    test('should create a schoolCourse', async () => {
        const schoolCourse = await createSchoolCourse(tokenAdministrator, 1, 6, 1);
        expect(schoolCourse.statusCode).toBe(201);
    });
});