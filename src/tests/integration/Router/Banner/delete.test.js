const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const uploadBanners = require('../../helpers/uploadBanners');

const deleteBanner = async (endpoint, token, idsBanners) => {
    const res = await request
        .delete(`/api/v1/banner/${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            idsBanners,
        });
    return res;
};

const endpoints = [
    'BannersAcademicLevels',
    'BannersAdmissions',
    'BannersContact',
    'BannersHome',
    'BannersInstitutionalProjects',
    'BannersNews',
    'BannersOurSchool'
];
let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    for (let index = 0; index < endpoints.length; index++) {
        await uploadBanners(tokenAdministrator, endpoints[index]);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw error if the banner not found', async() => {
        const res = await request
            .delete(`/api/v1/banner/BannerNotFound`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                idsBanners: '1',
            });
        expect(res.statusCode).toBe(404);
    });

    test('should throw error if does not have a token', async() => {
        const res = await request
            .delete(`/api/v1/banner/${endpoints[0]}`)
            .send({
                idsBanners: '1',
            });
        expect(res.statusCode).toBe(401);
    });

    test('should throw error if does not have a permission', async() => {
        const res = await request
            .patch(`/api/v1/banner/${endpoints[0]}`)
            .set('Authorization', `Bearer ${tokenStudentOne}`)
            .send({
                idsBanners: '1',
            });
        expect(res.statusCode).toBe(401);
    });
});

describe('should delete banner', () => {
    describe('should delete a banner', () => {
        endpoints.forEach(endpoint => {
            test(`should delete a banner ${endpoint}`, async() => {
                const resDeleteBanner = await deleteBanner(endpoint, tokenAdministrator, '1');
                expect(resDeleteBanner.statusCode).toBe(200);
            });
        })
    });

    describe('should delete banners', () => {
        endpoints.forEach(endpoint => {
            test(`should delete banners ${endpoint}`, async() => {
                const resDeleteBanner = await deleteBanner(endpoint, tokenAdministrator, '2,3');
                expect(resDeleteBanner.statusCode).toBe(200);
            });
        })
    })
})