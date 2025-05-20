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

    await createPublication(tokenAdministrator, 'news', 'idImage', true);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getNews = async (id) => {
    return await request.get(`/api/v1/news/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
}

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.delete('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.delete('/api/v1/news/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if it not found', async() => {
        const res = await request.delete('/api/v1/news/234')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should delete', ()=> {
    test('should delete in news', async() => {
        const res = await request.delete('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
        expect(res.statusCode).toBe(200);
        const news = await getNews(1);
        expect(news.statusCode).toBe(404);
    });
})


