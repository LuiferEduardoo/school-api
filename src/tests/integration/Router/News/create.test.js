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
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.post('/api/v1/news')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.post('/api/v1/news')
        expect(res.statusCode).toBe(401); 
    });
});

describe('should create news', () => {
    test('should create a news with idImage', async() => {
        const resOne = await createPublication(tokenAdministrator, 'news', 'idImage', true);
        expect(resOne.statusCode).toBe(201); 
        const resTwo = await request
            .post(`/api/v1/news`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: 'title news',
                content: 'content news',
                categories: 'categories news',
                subcategories: 'subcategories news',
                tags: 'tags news',
                idImage: '1'
            });
        expect(resTwo.statusCode).toBe(201); 
        const gestNew = await request
            .get('/api/v1/news/2');
        expect(gestNew.body.imageNews.length).toBe(1);
    });

    test('should create a news with image', async() => {
        const res = await createPublication(tokenAdministrator, 'news', 'image', true);
        expect(res.statusCode).toBe(201); 
    });
})