const Redis = require('ioredis-mock');
const { sequelize } = require('../../../../libs/sequelize');
const { uploadFilesForUser } = require('../../helpers/uploadFile');
const fileGenerator = require('../../helpers/fileGenerator');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');

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
let imageIds; 
let fileBuffer;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    for (let index = 0; index < 3; index++) {
        await uploadFilesForUser(tokenAdministrator, true, 'image');
    }

    const imagesToAdd = await sequelize.models.ImageRegistration.findAll();
    imageIds = imagesToAdd.map(image => image.id);
    fileBuffer = await fileGenerator('image');
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw error if the banner not found', async() => {
        const res = await request
            .post(`/api/v1/banner/BannerNotFound`)
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                ids: imageIds.join(','),
                description: 'description1,description2,description3'
            });
        expect(res.statusCode).toBe(404);
    });

    test('should throw error if does not have a token', async() => {
        const res = await request
            .post(`/api/v1/banner/${endpoints[0]}`)
            .send({
                ids: imageIds.join(','),
                description: 'description1,description2,description3'
            });
        expect(res.statusCode).toBe(401);
    });

    test('should throw error if does not have a permission', async() => {
        const res = await request
            .post(`/api/v1/banner/${endpoints[0]}`)
            .set('Authorization', `Bearer ${tokenStudentOne}`)
            .send({
                ids: imageIds.join(','),
                description: 'description1,description2,description3'
            });
        expect(res.statusCode).toBe(401);
    });
});

describe('should create a banner', () => {
    describe('should create a banner with idsImages', () => {
        endpoints.forEach(endpoint => {
            test(`should create a banner on ${endpoint}`, async () => {
                const res = await request
                    .post(`/api/v1/banner/${endpoint}`)
                    .set('Authorization', `Bearer ${tokenAdministrator}`)
                    .send({
                        ids: imageIds.join(','),
                        description: 'description1,description2,description3'
                    });
                expect(res.statusCode).toBe(201);
                expect(res.body.length).toBe(3);
            });
        });
    });

    describe('should create a banner with an idImage', () => {
        endpoints.forEach(endpoint => {
            test(`should create a banner on ${endpoint}`, async () => {
                const res = await request
                    .post(`/api/v1/banner/${endpoint}`)
                    .set('Authorization', `Bearer ${tokenAdministrator}`)
                    .send({
                        ids: String(imageIds[0]),
                        description: 'description1'
                    });
                expect(res.statusCode).toBe(201);
                expect(res.body.length).toBe(1);
            });
        });
    });

    describe('should create a banner with image', () => {
        endpoints.forEach(endpoint => {
            test(`should create a banner on ${endpoint}`, async () => {
                const res = await request
                    .post(`/api/v1/banner/${endpoint}`)
                    .set('Content-Type', 'multipart/form-data')
                    .set('Authorization', `Bearer ${tokenAdministrator}`)
                    .field('description', 'description2')
                    .attach('files', fileBuffer, 'fake-image.png');
                expect(res.statusCode).toBe(201);
                expect(res.body.length).toBe(1);
            });
        });
    })
})