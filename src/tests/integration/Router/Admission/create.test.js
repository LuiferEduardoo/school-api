const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');
const createSchoolCourse = require('../../helpers/createSchoolCourse');
const createAdmission = require('../../helpers/createAdmission');

let redisClient;
let tokenAdministrator;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');

    await createCampus();
    await createAcademicLevels(tokenAdministrator, 'idImage', true);
    await createSchoolCourse(tokenAdministrator, 1, 8, 1);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should create', () => {
    test('should create a admission request', async() => {
        const res = await createAdmission(true);
        expect(res.statusCode).toBe(201);
    });

    test('should create a admission request without secondName and secondSurname', async() => {
        const res = await request
            .post(`/api/v1/admission/request`)
            .send({
                academicLevel: 1,
                grade: 1,
                firstName: "Juan",
                surname: "Rodriguez",
                birthdate: "2006-08-01",
                gender: "Masculino",
                documentType: "Tarjeta de Identidad",
                numberDocument: 1046299387,
                phoneNumber: 3054123689,
                email: "emailstes@test.com"
            });
        expect(res.statusCode).toBe(201);
    })
});