const { sequelize } = require('../../../../libs/sequelize');
const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const { uploadFile, uploadFilesForUser } = require('../../helpers/uploadFile');
const getFormattedDate = require('../../helpers/getFormattedDate.js');
const fileGenerator = require('../../helpers/fileGenerator');
const path = require('path');
const fs = require('fs');

const FilesRegistration = sequelize.models.FilesRegistration;
const ImageRegistration = sequelize.models.ImageRegistration;

let redisClient;
let tokenAdministrator;
let tokenStudentOne;
let tokenStudentTwo;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');
    tokenStudentTwo = await loginUser('student2@test.com', 'passwordStudent2');

    const isPublicFiles = [false, true];
    for (let i = 0; i < 2; i++) {
        await uploadFilesForUser(tokenAdministrator, isPublicFiles[i]);
        await uploadFilesForUser(tokenStudentOne, isPublicFiles[i]);
    }
    await uploadFile(tokenStudentTwo, 'image', false);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('should throw error', () => {
    test('should throw an error if the user does not have access token', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission for the administrator resource', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission for the student1 resource', async() => {
        const res = await request.patch('/api/v1/file/update/2')
            .set('Authorization', `Bearer ${tokenStudentTwo}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission for the student2 resource', async() => {
        const res = await request.patch('/api/v1/file/update/5')
            .set('Authorization', `Bearer ${tokenStudentTwo}`);
        expect(res.statusCode).toBe(401);
    });
    
    test('should throw an error if file does not exist', async() => {
        const res = await request.patch('/api/v1/file/update/123')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404);
    })
});

describe('should update information files', () => {
    test('should update newName', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('newName', 'testNewName');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        const fileRecord = await FilesRegistration.findByPk(1);
        expect(fileRecord.name).toBe('testNewName.webp')
    });

    test('should update newFolder', async() => {
        const res = await request.patch('/api/v1/file/update/1')
        .set('Authorization', `Bearer ${tokenAdministrator}`)
        .set('Content-Type', 'multipart/form-data')
        .field('newFolder', 'testNewFolder');
        const fileRecord = await FilesRegistration.findByPk(1);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        expect(fileRecord.folder).toBe(`/uploads_test/image/testNewFolder/${fileRecord.userId}/${getFormattedDate()}`)
    });

    test('should update isPublic', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('isPublic', 'false');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        const fileRecord = await FilesRegistration.findByPk(1);
        expect(fileRecord.isPublic).toBe(false);
    });

    test('should update imageCredits', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('imageCredits', 'newImageCredits');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        const fileRecord = await ImageRegistration.findByPk(1);
        expect(fileRecord.imageCredits).toBe('newImageCredits');
    });

});

describe('should update files', () => {
    let imageBuffer;
    let documentBuffer;

    beforeAll(async () => {
        imageBuffer = await fileGenerator('image');
        documentBuffer = await fileGenerator('document');
    });

    test('should update image', async() => {
        const res = await request.patch('/api/v1/file/update/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('files', imageBuffer, 'fake-image.png');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        const fileRecord = await FilesRegistration.findByPk(1);
        expect(fileRecord.name).toBe('fake-image.webp');
        expect(fileRecord.ext).toBe('.webp');
        const filePath = path.join(__dirname, `../../../..${fileRecord.folder}`, fileRecord.name);
        expect(await fs.existsSync(filePath)).toBe(true);
    });

    test('should update document', async() => {
        const res = await request.patch('/api/v1/file/update/2')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .set('Content-Type', 'multipart/form-data')
            .field('files', documentBuffer, 'new_fake_document.pdf');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File actualizado con exito');
        const fileRecord = await FilesRegistration.findByPk(2);
        expect(fileRecord.name).toBe('new_fake_document.pdf');
        expect(fileRecord.ext).toBe('.pdf');
        const filePath = path.join(__dirname, `../../../..${fileRecord.folder}`, fileRecord.name);
        expect(await fs.existsSync(filePath)).toBe(true);
    })
})