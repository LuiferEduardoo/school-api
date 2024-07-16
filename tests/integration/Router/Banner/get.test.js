const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const uploadBanners = require('../../helpers/uploadBanners');

let redisClient;
let tokenAdministrator;
const endpoints = [
    'BannersAcademicLevels',
    'BannersAdmissions',
    'BannersContact',
    'BannersHome',
    'BannersInstitutionalProjects',
    'BannersNews',
    'BannersOurSchool'
];

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    for (let index = 0; index < endpoints.length; index++) {
        await uploadBanners(tokenAdministrator, endpoints[index]);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    
    test('should throw error if type Banner Not Found', async () => {
        const res = await request.get('/api/v1/banner/BannerNotFound');
        
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Banner no existe');
    });
    
    test('throw error if Banner Not Found', async() => {
        const res = await request.get('/api/v1/banner/BannersAcademicLevels/34348')
        expect(res.statusCode).toBe(404);
    });

    test('should throw error if id the Banner Not Found', async () => {
        const res = await request.get('/api/v1/banner/BannersAcademicLevels/142');

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('no encontrado');
    });
});

describe('should banners', () => {
    test('should all banners', async () => {
        const res = await request.get('/api/v1/banner')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(7);
        expect(res.body[0].banners.length).toBe(3);
    });

    test('should a banner', async() => {
        const res = await request.get('/api/v1/banner/BannersAcademicLevels/1')
        expect(res.statusCode).toBe(200);
    })

    endpoints.forEach(endpoint => {
        test(`should ${endpoint}`, async () => {
            const res = await request.get(`/api/v1/banner/${endpoint}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(3);
        });
    });
});