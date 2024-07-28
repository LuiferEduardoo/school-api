const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createInstitutionalProjects = require('../../helpers/createInstitutionalProjects');
const createPublication = require('../../helpers/createPublication');

let redisClient;
let tokenAdministrator;
let tokenCoordinator;
let tokenStudentOne;
let tokenStudentTwo;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenCoordinator = await loginUser('coordinator@test.com', 'passwordCoordinator');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');
    tokenStudentTwo = await loginUser('student2@test.com', 'passwordStudent2');
    await createInstitutionalProjects(tokenAdministrator, 'idImage', true)
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    describe('should throw error in institutitional projects', () => {
        test('should throw an error if the user does not have permission', async() =>{
            const res = await createInstitutionalProjects(tokenStudentOne, 'idImage', true);
            expect(res.statusCode).toBe(401);
        });
    
        test('should throw an error if it has no token', async() => {
            const res = await request.post('/api/v1/institutional-projects')
            expect(res.statusCode).toBe(401); 
        });
    });
    describe('should throw error in institutional projects publications', () => {
        test('should throw an error if the user does not have permission', async() =>{
            const res = await createPublication(tokenStudentTwo, 'institutional-projects/1', 'idImage', true);
            expect(res.statusCode).toBe(401);
        });

        test('should throw an error if the user is superAdmin but does not have permission', async() =>{
            const res = await createPublication(tokenCoordinator, 'institutional-projects/1', 'idImage', true);
            expect(res.statusCode).toBe(401);
        });
    
        test('should throw an error if it has no token', async() => {
            const res = await request.post('/api/v1/institutional-projects/1')
            expect(res.statusCode).toBe(401); 
        });

        test('should throw an error if the author is not a member', async() => {
            const res = await request.post('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokenAdministrator}`)
                .send({
                    title: 'title news',
                    content: 'content news',
                    categories: 'categories news',
                    subcategories: 'subcategories news',
                    tags: 'tags news',
                    idImage: '1',
                    authors: '4'
                });
            expect(res.statusCode).toBe(401); 
        });
    })
});

describe('should create institutional projects', () => {
    test('should create a institutional projects with idImage', async() => {
        const resOne = await createInstitutionalProjects(tokenAdministrator, 'idImage', true);
        expect(resOne.statusCode).toBe(201); 
        const resTwo = await request
            .post(`/api/v1/institutional-projects`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: 'title news',
                content: 'content news',
                categories: 'categories news',
                subcategories: 'subcategories news',
                tags: 'tags news',
                idImage: '1',
                startedAt: '2024-06-03',
                members: '1',
                isCoordinator: 'true'
            });
        expect(resTwo.statusCode).toBe(201); 
        const gestNew = await request
            .get('/api/v1/institutional-projects/2');
        expect(gestNew.body.ImageInstitutionalProjects.length).toBe(1);
    });

    test('should create a institutional projects with image', async() => {
        const res = await createInstitutionalProjects(tokenAdministrator, 'image', true);
        expect(res.statusCode).toBe(201); 
    });
});

describe('should create publications', () => {
    test('should create a publications with idImage', async() => {
        const resOne = await createPublication(tokenAdministrator, 'institutional-projects/2', 'idImage', true);
        expect(resOne.statusCode).toBe(201); 
        const resTwo = await request
            .post(`/api/v1/institutional-projects/2`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: 'title news',
                content: 'content news',
                categories: 'categories news',
                subcategories: 'subcategories news',
                tags: 'tags news',
                idImage: '1',
            });
        expect(resTwo.statusCode).toBe(201); 
        const gestPublication = await request
            .get('/api/v1/institutional-projects/2/publication/2');
        expect(gestPublication.body.ImageInstitutionalProjectPublication.length).toBe(1);
    });

    test('should create a publications with image', async() => {
        const res = await createPublication(tokenAdministrator, 'institutional-projects/2', 'image', true);
        expect(res.statusCode).toBe(201); 
    });

    test('should create a publications with multiple authors', async() => {
        const res = await request
            .post(`/api/v1/institutional-projects/2`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: 'title news',
                content: 'content news',
                categories: 'categories news',
                subcategories: 'subcategories news',
                tags: 'tags news',
                idImage: '1',
                authors: '6',
            });
        expect(res.statusCode).toBe(201); 
        const gestPublication = await request.get('/api/v1/institutional-projects/2/publication/4');
        
        expect(gestPublication.body.InstitutionalProjectsPublicationsAuthors.length).toBe(2);
    })
});