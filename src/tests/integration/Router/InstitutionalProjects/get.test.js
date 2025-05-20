const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createInstitutionalProjects = require('../../helpers/createInstitutionalProjects');
const createPublication = require('../../helpers/createPublication');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;
let tokenStudentTwo;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');
    tokenStudentTwo = await loginUser('student2@test.com', 'passwordStudent2');

    const isVisible = [false, true, true];

    for (let i = 0; i < 3; i++) {
        await createInstitutionalProjects(tokenAdministrator, 'idImage', isVisible[i]);
    }
    await createPublication(tokenAdministrator, `institutional-projects/2`, 'idImage', true);
    await createPublication(tokenAdministrator, `institutional-projects/2`, 'idImage', true);
    await createPublication(tokenAdministrator, `institutional-projects/1`, 'idImage', false);
    await createPublication(tokenAdministrator, `institutional-projects/2`, 'idImage', false);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    describe('should throw error in institutitional projects', () => {
        test('should throw an error if the user does not have permission to access the non-visible recursive', async() =>{
            const res = await request.get('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokenStudentOne}`);
            expect(res.statusCode).toBe(404);
        });
    
        test('should throw an error if it has no token and the recursive not visible', async() => {
            const res = await request.get('/api/v1/institutional-projects/1')
            expect(res.statusCode).toBe(404); 
        });
    
        test('should throw an error if the recurse not found', async() => {
            const res = await request.get('/api/v1/institutional-projects/342')
            expect(res.statusCode).toBe(404); 
        });
    });

    describe('should throw error in institutional projects publications', () => {
        test('should throw an error if the user does not have permission to access the non-visible recursive', async() =>{
            const res = await request.get('/api/v1/institutional-projects/1/publication/1')
                .set('Authorization', `Bearer ${tokenStudentTwo}`);
            expect(res.statusCode).toBe(404);
        });
    
        test('should throw an error if it has no token and the recursive not visible', async() => {
            const res = await request.get('/api/v1/institutional-projects/1/publication/1')
            expect(res.statusCode).toBe(404); 
        });
    
        test('should throw an error if the recurse not found', async() => {
            const res = await request.get('/api/v1/institutional-projects/2/publication/245');
            expect(res.statusCode).toBe(404); 
        });
    });
});

describe('should get the institutional projects', () => {
    test('should get one institutional project', async() => {
        const res = await request.get('/api/v1/institutional-projects/2');
        expect(res.statusCode).toBe(200);
    });

    test('should get two institutional projects', async() => {
        const res = await request.get('/api/v1/institutional-projects');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.visible).toBe(true);
        })
    });

    test('should get two institutional projects', async() => {
        const res = await request.get('/api/v1/institutional-projects')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.visible).toBe(true);
        })
    });

    test('should get three institutional projects', async() => {
        const res = await request.get('/api/v1/institutional-projects')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(3);
        expect(res.body.elements[2].visible).toBe(false);
    });

    test('should get the institutional projects whit query', async() => {
        const resOne = await request.get('/api/v1/institutional-projects?important=true');
        expect(resOne.statusCode).toBe(200); 
        expect(resOne.body.totalPages).toBe(0);

        const resTwo = await request.get('/api/v1/institutional-projects?search=example');
        expect(resTwo.statusCode).toBe(200); 
        expect(resTwo.body.elements.length).toBe(2);
        expect(resTwo.body.totalPages).toBe(1);

        const resThree = await request.get('/api/v1/institutional-projects?visible=false')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resThree.statusCode).toBe(200); 
        expect(resThree.body.elements.length).toBe(1);
        expect(resThree.body.totalPages).toBe(1);

        const resFour = await request.get('/api/v1/institutional-projects?member=1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resFour.statusCode).toBe(200); 
        expect(resFour.body.elements.length).toBe(3);
        expect(resFour.body.totalPages).toBe(1);

        const resSix = await request.get('/api/v1/institutional-projects?link=example-title-1');
        expect(resSix.statusCode).toBe(200); 
    });
});

describe('shoul get the publications of institutional projects', () => {
    test('should get one institutional project', async() => {
        const res = await request.get('/api/v1/institutional-projects/2/publication/1');
        expect(res.statusCode).toBe(200);
    });

    test('should get two publications', async() => {
        const res = await request.get('/api/v1/institutional-projects/2/publication');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.publication.visible).toBe(true);
        });
    });

    test('should get two publications', async() => {
        const res = await request.get('/api/v1/institutional-projects/2/publication')
            .set('Authorization', `Bearer ${tokenStudentTwo}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.publication.visible).toBe(true);
        });
    });

    test('should get three publications', async() => {
        const res = await request.get('/api/v1/institutional-projects/2/publication')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(3);
        expect(res.body.elements[2].publication.visible).toBe(false);
    });

    test('should get the institutional projects whit query', async() => {
        const resOne = await request.get('/api/v1/institutional-projects/2/publication?important=true');
        expect(resOne.statusCode).toBe(200); 
        expect(resOne.body.totalPages).toBe(0);

        const resTwo = await request.get('/api/v1/institutional-projects/2/publication?search=example');
        expect(resTwo.statusCode).toBe(200); 
        expect(resTwo.body.elements.length).toBe(2);
        expect(resTwo.body.totalPages).toBe(1);

        const resThree = await request.get('/api/v1/institutional-projects/2/publication?visible=false')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resThree.statusCode).toBe(200); 
        expect(resThree.body.elements.length).toBe(1);
        expect(resThree.body.totalPages).toBe(1);

        const resFour = await request.get('/api/v1/institutional-projects/2/publication?author=1')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resFour.statusCode).toBe(200); 
        expect(resFour.body.elements.length).toBe(3);
        expect(resFour.body.totalPages).toBe(1);

        const resSix = await request.get('/api/v1/institutional-projects/2/publication?link=example-title-1');
        expect(resSix.statusCode).toBe(200); 
    });
});