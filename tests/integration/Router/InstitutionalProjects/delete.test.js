const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createInstitutionalProjects = require('../../helpers/createInstitutionalProjects');
const createPublication = require('../../helpers/createPublication');

let redisClient;
let tokenAdministrator;
let tokenCoordinator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenCoordinator = await loginUser('coordinator@test.com', 'passwordCoordinator');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createInstitutionalProjects(tokenAdministrator, 'idImage', true);

    for (let index = 0; index < 4; index++) {
        await createPublication(tokenAdministrator, 'institutional-projects/1', 'idImage', true);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getInstitutionalProject = async (id) => {
    return await request.get(`/api/v1/institutional-projects/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
};

const getPublicationProject = async (id) => {
    return await request.get(`/api/v1/institutional-projects/1/publication/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
}

describe('should throw error', ()=> {
    describe('should throw error in institutional Projects', () => {
        test('should throw an error if the user does not have permission', async() =>{
            const res = await request.delete('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokenStudentOne}`);
            expect(res.statusCode).toBe(401);
        });
    
        test('should throw an error if it has no token', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1')
            expect(res.statusCode).toBe(401); 
        });
    
        test('should throw an error if it not found', async() => {
            const res = await request.delete('/api/v1/institutional-projects/234')
                .set('Authorization', `Bearer ${tokenAdministrator}`);
            expect(res.statusCode).toBe(404); 
        });
    });
    describe('should throw error in publication', () => {
        test('should throw an error if the user does not have permission', async() =>{
            const res = await request.delete('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokenStudentOne}`);
            expect(res.statusCode).toBe(401);
        });
    
        test('should throw an error if it has no token', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1/1')
            expect(res.statusCode).toBe(401); 
        });
    
        test('should throw an error if it not found', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1/343')
                .set('Authorization', `Bearer ${tokenAdministrator}`);
            expect(res.statusCode).toBe(404); 
        });
    })
});

describe('should delete', ()=> {
    describe('should delete publications', () => {
        test('should delete a publication if you are an coordinator', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokenAdministrator}`);
            expect(res.statusCode).toBe(200);
            const publication = await getPublicationProject(1);
            expect(publication.statusCode).toBe(404);
        });
    
        test('should delete a post if you are a superadmin', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1/2')
                .set('Authorization', `Bearer ${tokenCoordinator}`)
            expect(res.statusCode).toBe(200);
            const publication = await getPublicationProject(2);
            expect(publication.statusCode).toBe(404);
        });
    });

    describe('should delete in institutional projects', () => {
        test('should delete', async() => {
            const res = await request.delete('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokenAdministrator}`)
            expect(res.statusCode).toBe(200);
            const institutionalProject = await getInstitutionalProject(1);
            expect(institutionalProject.statusCode).toBe(404);
        });
    });
});