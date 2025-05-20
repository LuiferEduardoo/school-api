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

    const isVisible = [false, true, true, true];

    for (let index = 0; index < 4; index++) {
        await createAcademicLevels(tokenAdministrator, 'idImage', isVisible[index]);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have permission to access the non-visible recursive', async() => {
        const res = await request.get('/api/v1/academic-levels/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(404);
    });

    test('should throw an error if it has no token and the recursive not visible', async() => {
        const res = await request.get('/api/v1/academic-levels/1')
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error if the recurse not found', async() => {
        const res = await request.get('/api/v1/academic-levels/134');
        expect(res.statusCode).toBe(404); 
    });
});

describe('should get', () => {
    test('should get one', async () => {
        const res = await request.get('/api/v1/academic-levels/2');
        expect(res.statusCode).toBe(200);
    });

    test('should get three', async() => {
        const res = await request.get('/api/v1/academic-levels');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(3);
        res.body.elements.forEach(element => {
            expect(element.visible).toBe(true);
        })
    });

    test('should get four', async() => {
        const res = await request.get('/api/v1/academic-levels')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(4);
        expect(res.body.elements[0].visible).toBe(false);
    });

    test('should get whit query', async() => {
        const resOne = await request.get('/api/v1/academic-levels?campusNumber=1');
        expect(resOne.statusCode).toBe(200); 
        expect(resOne.body.totalPages).toBe(1);

        const resTwo = await request.get('/api/v1/academic-levels?educationDay=Mañana');
        expect(resTwo.statusCode).toBe(200); 
        expect(resTwo.body.elements.length).toBe(3);
        expect(resTwo.body.totalPages).toBe(1);

        const resThree = await request.get('/api/v1/academic-levels?modality=Presencial')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(resThree.statusCode).toBe(200); 
        expect(resThree.body.elements.length).toBe(3);
        expect(resThree.body.totalPages).toBe(1);

        const resFour = await request.get('/api/v1/academic-levels?search=example')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resFour.statusCode).toBe(200); 
        expect(resFour.body.elements.length).toBe(4);
        expect(resFour.body.totalPages).toBe(1);
    });
})