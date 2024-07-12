const { sequelize } = require('../../../../libs/sequelize');
const Redis = require('ioredis-mock');
const {setRedisInstance} = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const path = require('path');
const fs = require('fs');
const fileGenerator = require('../../helpers/fileGenerator');

const FilesRegistration = sequelize.models.FilesRegistration;

let tokenAdministrator;
let tokenStudent;

beforeAll(async() => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudent = await loginUser('student1@test.com', 'passwordStudent1');
});

afterAll(async() => {
    redisClient.flushall();
    redisClient.disconnect();

});

const verifyUploadedFile = async (fileId, expectedName, isPublic, userId) => {
    const fileRecord = await FilesRegistration.findByPk(fileId);
    const filePath = path.join(__dirname, `../../../..${fileRecord.folder}`, fileRecord.name);
    
    expect(await fs.existsSync(filePath)).toBe(true);
    expect(fileRecord.name).toBe(expectedName);
    expect(fileRecord.isPublic).toBe(isPublic);
    expect(fileRecord.url).not.toBeNull();
    expect(fileRecord.userId).toBe(userId);
    
    if(fileRecord.fileType === "image/webp"){
        expect(fileRecord.ext).toBe('.webp');
        expect(fileRecord.fileType).toBe('image/webp');
        expect(fileRecord.width).toBe('200');
        expect(fileRecord.height).toBe('200');
    } else {
        expect(fileRecord.ext).toBe('.pdf');
        expect(fileRecord.fileType).toBe('application/pdf');
    }
};

describe('should throw an error', () => {
    test('should throw an error because it is missing the token access', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Content-Type', 'multipart/form-data')
        expect(res.statusCode).toBe(401);
    })
    test('should throw an error because it is missing a image, folder, fileType and isPublic', async () =>{
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
        expect(res.statusCode).toBe(400);
    })

    test('shoul throw an error because it is missing a image, folder and fileType', async() => {
        const res = await request
        .post('/api/v1/file/upload')
        .set('Authorization', `Bearer ${tokenAdministrator}`)
        .set('Content-Type', 'multipart/form-data')
        .field('isPublic', 'true')
        expect(res.statusCode).toBe(400);
    })

    test('shoul throw an error because it is missing a image, and fileType', async() => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('isPublic', 'true')
            .field('folder', 'exampleFolder')
        expect(res.statusCode).toBe(400);
    })

    test('shoul throw an error because it is missing a image', async() => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('isPublic', 'true')
            .field('folder', 'exampleFolder')
            .field('fileType', 'image')
        expect(res.statusCode).toBe(400);
    })

    test('should throw an error because the image is not binary', async() => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('isPublic', 'true')
            .field('folder', 'exampleFolder')
            .field('fileType', 'image')
            .field('files', 'files')
        expect(res.statusCode).toBe(400);
    })
});

describe('should upload', () => {
    let imageBuffer;
    let documentBuffer;

    beforeAll(async () => {
        imageBuffer = await fileGenerator('image');
        documentBuffer = await fileGenerator('document');
    });

    test('should upload image', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .field('folder', 'exampleFolder')
            .field('fileType', 'image')
            .field('isPublic', 'true') 
            .field('imageCredits', 'John Doe')
            .attach('files', imageBuffer, 'fake-image.png');

        await verifyUploadedFile(1, 'fake-image.webp', true, 1);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('File subido con exito');
    });

    test('should upload image without imageCredits', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenStudent}`)
            .field('folder', 'exampleFolder')
            .field('fileType', 'image')
            .field('isPublic', 'true')
            .attach('files', imageBuffer, 'fake-image.png');

        await verifyUploadedFile(2, 'fake-image.webp', true, 6);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('File subido con exito');
    });

    test('should upload two images and private', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .field('folder', 'exampleFolder')
            .field('fileType', 'image')
            .field('isPublic', 'false, false') 
            .field('imageCredits', 'John Doe, Intelligen')
            .attach('files', imageBuffer, 'fake-image.png')
            .attach('files', imageBuffer, 'fake-image.png');

        await verifyUploadedFile(3, 'fake-image_1.webp', false, 1);
        await verifyUploadedFile(4, 'fake-image_2.webp', false, 1);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('File subido con exito');
    });

    test('should upload file', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .field('folder', 'exampleFolder')
            .field('fileType', 'document')
            .field('isPublic', 'true') 
            .attach('files', documentBuffer, 'fake-document.pdf');

        await verifyUploadedFile(5, 'fake-document.pdf', true, 1);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('File subido con exito');
    });

    test('should upload two files and private', async () => {
        const res = await request
            .post('/api/v1/file/upload')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .field('folder', 'exampleFolder')
            .field('fileType', 'document')
            .field('isPublic', 'false, false') 
            .attach('files', documentBuffer, 'fake-document.pdf')
            .attach('files', documentBuffer, 'fake-document.pdf');

        await verifyUploadedFile(6, 'fake-document_1.pdf', false, 1);
        await verifyUploadedFile(7, 'fake-document_2.pdf', false, 1);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('File subido con exito');
    });
});