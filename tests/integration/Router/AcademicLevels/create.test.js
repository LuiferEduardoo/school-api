const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createCampus();
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.post('/api/v1/academic-levels')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.post('/api/v1/academic-levels')
        expect(res.statusCode).toBe(401); 
    });
});

describe('should create', () => {
    test('should create with idImage', async() => {
        const resOne = await createAcademicLevels(tokenAdministrator, 'idImage', true);
        expect(resOne.statusCode).toBe(201); 
        const resTwo = await request
        .post(`/api/v1/academic-levels`)
        .set('Authorization', `Bearer ${tokenAdministrator}`)
        .send({
            nameLevel: 'name academic level',
            description: 'description academic level',
            levelCode: 23443,
            campusNumber: 2,
            modality: 'Presencial',
            educationalObjectives: 'educational objectives',
            admissionRequirements: 'admission requitements',
            educationDay: 'Mañana',
            idImage: '1'
        });
        expect(resTwo.statusCode).toBe(201); 
        const gestNew = await request
            .get('/api/v1/academic-levels/2');
        expect(gestNew.body.imageAcademicLevels.length).toBe(1);
    });

    test('should create a news with image', async() => {
        const res = await createAcademicLevels(tokenAdministrator, 'image', true);
        expect(res.statusCode).toBe(201); 
    });
})