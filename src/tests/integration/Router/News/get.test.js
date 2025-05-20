const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createPublication = require('../../helpers/createPublication');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    const isVisible = [false, true, true];

    for (let i = 0; i < 3; i++) {
        await createPublication(tokenAdministrator, 'news', 'idImage', isVisible[i]);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission to access the non-visible recursive', async() =>{
        const res = await request.get('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(404);
    });

    test('should throw an error if it has no token and the recursive not visible', async() => {
        const res = await request.get('/api/v1/news/1')
        expect(res.statusCode).toBe(404); 
    });

    test('should throw an error if the recurse not found', async() => {
        const res = await request.get('/api/v1/news/342')
        expect(res.statusCode).toBe(404); 
    })
})

describe('should get the news', () => {
    test('should get two news', async() => {
        const res = await request.get('/api/v1/news');
        expect(res.statusCode).toBe(200);
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.publication.visible).toBe(true);
        })
    });

    test('should get two news', async() => {
        const res = await request.get('/api/v1/news')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(2);
        res.body.elements.forEach(element => {
            expect(element.publication.visible).toBe(true);
        })
    });

    test('should get three news', async() => {
        const res = await request.get('/api/v1/news')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200); 
        expect(res.body.totalPages).toBe(1);
        expect(res.body.elements.length).toBe(3);
        expect(res.body.elements[0].publication.visible).toBe(false);
    });

    test('should get the news whit query', async() => {
        const resOne = await request.get('/api/v1/news?important=true');
        expect(resOne.statusCode).toBe(200); 
        expect(resOne.body.totalPages).toBe(0);

        const resTwo = await request.get('/api/v1/news?search=example');
        expect(resTwo.statusCode).toBe(200); 
        expect(resTwo.body.elements.length).toBe(2);
        expect(resTwo.body.totalPages).toBe(1);

        const resThree = await request.get('/api/v1/news?visible=false')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(resThree.statusCode).toBe(200); 
        expect(resThree.body.elements.length).toBe(1);
        expect(resThree.body.totalPages).toBe(1);

        const resFour = await request.get('/api/v1/news?link=example-title-1');
        expect(resFour.statusCode).toBe(200); 
    });
})