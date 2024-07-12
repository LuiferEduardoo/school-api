const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const { uploadFile, uploadFilesForUser } = require('../../helpers/uploadFile');

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

    const isPublicFiles = [false, true, true, true, true, true, true, true];
    for (let i = 0; i < 8; i++) {
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
    test('should throw an error if user has no token access', async () => {
        await assertUnauthorizedAccess('/api/v1/file/image/1');
    });

    test('should throw an error if the user does not have permission for the administrator resource', async () => {
        await assertForbiddenAccess('/api/v1/file/image/1', tokenStudentOne);
    });

    test('should throw an error if the user does not have permission for the student1 resource', async () => {
        await assertForbiddenAccess('/api/v1/file/image/2', tokenStudentTwo);
    });

    test('should throw an error if the user does not have permission for the student2 resource', async () => {
        await assertForbiddenAccess('/api/v1/file/image/17', tokenStudentOne);
    });

    test('should throw an error if file does not exist', async () => {
        await assertNotFound('/api/v1/file/image/102', tokenAdministrator);
    });
});

describe('should files administrator without query', () => {
    test('should a image', async () => {
        await assertSuccessfulAccess('/api/v1/file/image/1', tokenAdministrator);
    });

    test('should a document', async () => {
        await assertSuccessfulAccess('/api/v1/file/document/1', tokenAdministrator);
    });

    test('should show a file from another', async () => {
        await assertSuccessfulAccess('/api/v1/file/image/2', tokenAdministrator);
    });

    test('should images', async () => {
        await assertFileList('/api/v1/file/image', tokenAdministrator, 10, 2);
    });

    test('should documents', async () => {
        await assertFileList('/api/v1/file/document', tokenAdministrator, 10, 2);
    });
});

describe('should files student without query', () => {
    test('should a image', async () => {
        await assertSuccessfulAccess('/api/v1/file/image/2', tokenStudentOne);
    });

    test('should a document', async () => {
        await assertSuccessfulAccess('/api/v1/file/image/2', tokenStudentOne);
    });

    test('should images', async () => {
        await assertFileList('/api/v1/file/image', tokenStudentOne, 8, 1);
    });

    test('should documents', async () => {
        await assertFileList('/api/v1/file/document', tokenStudentOne, 8, 1);
    });
});

describe('should files administrator with query', () => {
    test('should 17 images', async () => {
        await assertFileList('/api/v1/file/image?limit=17', tokenAdministrator, 17, 1);
    });

    test('should 2 images', async () => {
        await assertFileList('/api/v1/file/image?limit=2', tokenAdministrator, 2, 9);
    });
});

async function assertUnauthorizedAccess(url) {
    const res = await request.get(url);
    expect(res.statusCode).toBe(401);
}

async function assertForbiddenAccess(url, token) {
    const res = await request.get(url)
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
}

async function assertNotFound(url, token) {
    const res = await request.get(url)
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
}

async function assertSuccessfulAccess(url, token) {
    const res = await request.get(url)
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
}

async function assertFileList(url, token, expectedLength, expectedPages) {
    const res = await request.get(url)
        .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.elements.length).toBe(expectedLength);
    expect(res.body.totalPages).toBe(expectedPages);
}