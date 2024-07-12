const { sequelize } = require('../../../../libs/sequelize');
const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const { uploadFile, uploadFilesForUser } = require('../../helpers/uploadFile');
const path = require('path');
const fs = require('fs');

const FilesRegistration = sequelize.models.FilesRegistration;

let redisClient;
let tokens = {};

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokens.administrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokens.studentOne = await loginUser('student1@test.com', 'passwordStudent1');
    tokens.studentTwo = await loginUser('student2@test.com', 'passwordStudent2');
    
    const isPublicFiles = [false, true];
    for (let i = 0; i < 2; i++) {
        await uploadFilesForUser(tokens.administrator, isPublicFiles[i]);
        await uploadFilesForUser(tokens.studentOne, isPublicFiles[i]);
    }
    await uploadFile(tokens.studentTwo, 'image', false);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const fileTests = [
    { id: 1, token: 'studentOne', status: 401, description: 'should throw an error if the user does not have access token' },
    { id: 1, token: 'studentOne', status: 401, description: 'should throw an error if the user does not have permission for the administrator resource' },
    { id: 2, token: 'studentTwo', status: 401, description: 'should throw an error if the user does not have permission for the student1 resource' },
    { id: 5, token: 'studentTwo', status: 401, description: 'should throw an error if the user does not have permission for the student2 resource' },
    { id: 123, token: 'administrator', status: 404, description: 'should throw an error if file does not exist' },
];

describe('should throw error', () => {
    fileTests.forEach(({ id, token, status, description }) => {
        test(description, async () => {
            const res = await request.delete(`/api/v1/file/${id}`)
                .set('Authorization', `Bearer ${tokens[token]}`);
            expect(res.statusCode).toBe(status);
        });
    });
});

const deleteFileTests = [
    { id: 1, userToken: 'administrator', fileToken: 'administrator', fileId: 'image/1', description: 'should delete administrator`s file' },
    { id: 2, userToken: 'administrator', fileToken: 'administrator', fileId: 'document/1', description: 'should delete student1`s file' },
    { id: 5, userToken: 'administrator', fileToken: 'administrator', fileId: 'image/3', description: 'should delete student2`s file' },
    { id: 4, userToken: 'studentOne', fileToken: 'administrator', fileId: 'document/2', description: 'should delete student1`s file by student1' },
];

describe('should delete files', () => {
    deleteFileTests.forEach(({ id, userToken, fileToken, fileId, description }) => {
        test(description, async () => {
            const fileRecord = await FilesRegistration.findByPk(id);
            const res = await request.delete(`/api/v1/file/${id}`)
                .set('Authorization', `Bearer ${tokens[userToken]}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Archivo eliminado con exito');
            
            const fileDelete = await request.get(`/api/v1/file/${fileId}`)
                .set('Authorization', `Bearer ${tokens[fileToken]}`);
            
            const filePath = path.join(__dirname, `../../../..${fileRecord.folder}`, fileRecord.name);
            expect(fs.existsSync(filePath)).toBe(false);
            expect(fileDelete.statusCode).toBe(404);
        });
    });
});