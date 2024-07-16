const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const uploadBanners = require('../../helpers/uploadBanners');

const updateBanner = async (endpoint, token, idsBanners, descriptions) => {
    const res = await request
        .patch(`/api/v1/banner/${endpoint}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            idsBanners,
            description: descriptions.join(',')
        });
    return res;
};

const verifyBannerDescriptions = async (endpoint, expectedDescriptions) => {
    const getBanner = await request.get(`/api/v1/banner/${endpoint}`);
    expectedDescriptions.map((description, index) => {
        expect(getBanner.body[index].description).toBe(description);
    });
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
            .patch(`/api/v1/banner/BannerNotFound`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                idsBanners: '1',
                description: 'newDescription1'
            });
        expect(res.statusCode).toBe(404);
    });

    test('should throw error if does not have a token', async() => {
        const res = await request
            .patch(`/api/v1/banner/${endpoints[0]}`)
            .send({
                idsBanners: '1',
                description: 'newDescription1'
            });
        expect(res.statusCode).toBe(401);
    });

    test('should throw error if does not have a permission', async() => {
        const res = await request
            .patch(`/api/v1/banner/${endpoints[0]}`)
            .set('Authorization', `Bearer ${tokenStudentOne}`)
            .send({
                idsBanners: '1',
                description: 'newDescription1'
            });
        expect(res.statusCode).toBe(401);
    });
});

describe('should update banner', () => {
    describe('should update a banner', () => {
        endpoints.forEach(endpoint => {
            test(`should update a banner on ${endpoint}`, async () => {
                const newDescription = ['newDescription1'];
                const res = await updateBanner(endpoint, tokenAdministrator, '1', newDescription);
                expect(res.statusCode).toBe(200);
                await verifyBannerDescriptions(endpoint, newDescription);
            });
        });
    });

    describe('should update banners', () => {
        endpoints.forEach(endpoint => {
            test(`should update multiple banners on ${endpoint}`, async () => {
                const newDescriptions = [
                    'newDescription1',
                    'newDescription2',
                    'newDescription3'
                ];
                const res = await updateBanner(endpoint, tokenAdministrator, '1,2,3', newDescriptions);
                expect(res.statusCode).toBe(200);
                await verifyBannerDescriptions(endpoint, newDescriptions);
            });
        });
    });
});