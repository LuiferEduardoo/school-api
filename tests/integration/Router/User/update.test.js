const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const fileGenerator = require('../../helpers/fileGenerator');

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

const getUser = async(id) => {
    const res = await request.get(`/api/v1/users/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
    return res.body;
}

describe('should throw error', () => {
    test('should throw an error if the user does not have token', async() => {
        const res = await request.patch('/api/v1/user')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have token', async() => {
        const res = await request.patch('/api/v1/user/9')
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if the user does not have permission', async() => {
        const res = await request.patch('/api/v1/user/9')
            .set('Authorization', `Bearer ${tokenStudentOne}`)
        expect(res.statusCode).toBe(401);
    });
});

describe('shoul update', () => {

    describe('should update a user', () => {
        test('should update a user email, rol and status', async() => {
            const res = await request.patch('/api/v1/user/9')
                .set('Authorization', `Bearer ${tokenAdministrator}`)
                .send({
                    email: "newEmailUserTeacherTwo@test.com",
                    rol: 'estudiante',
                    active: false
                })
            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(9);
            expect(resGetUser.email).toBe('newEmailUserTeacherTwo@test.com');
            expect(resGetUser.rol[0].rol).toBe('estudiante');
            expect(resGetUser.active).toBe(false);
        });
    })

    describe('should update the user information', () => {
        test('should update the user information name, lastname, username and email', async() => {
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenStudentOne}`)
                .set('Content-Type', 'application/json')
                .send({
                    name: "NewNameEstudentOne",
                    lastName: 'NewLastNameEstudentOne',
                    username: 'NewUsernameEstudentOne',
                    email: "newEmailEstudentOne@test.com",
                });

            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(6);
            expect(resGetUser.name).toBe('NewNameEstudentOne');
            expect(resGetUser.lastName).toBe('NewLastNameEstudentOne');
            expect(resGetUser.username).toBe('NewUsernameEstudentOne');
            expect(resGetUser.email).toBe('newEmailEstudentOne@test.com');
        });

        test('should update the user information password', async() => {
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenStudentOne}`)
                .set('Content-Type', 'application/json')
                .send({
                    currentPassword: 'passwordStudent1',
                    password: 'pz9]65MP9??fe',
                    closeOtherDevices: true,
                });
            expect(res.statusCode).toBe(200);
            const faildLogin = await request
                .post('/api/v1/auth/login')
                .send({ credential: 'newEmailEstudentOne@test.com', password: 'passwordStudent1' });
            
            expect(faildLogin.statusCode).toBe(401);
            tokenStudentOne = await loginUser('newEmailEstudentOne@test.com', 'pz9]65MP9??fe');
            expect(tokenStudentOne).not.toBeNull()
        });

        test('should update the user information upload profile picture with image', async() => {
            const fileBuffer = await fileGenerator('image');
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenStudentOne}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('files', fileBuffer, 'fake-image.png');
            
            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(6);
            expect(resGetUser.image.length).toBe(1);
        });

        test('should update the user information upload profile picture with idImage', async() => {
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenAdministrator}`)
                .send({
                    idNewImage: '1'
                });
            
            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(1);
            expect(resGetUser.image.length).toBe(1);
        });

        test('should update the user information update profile picture with image', async() => {
            const fileBuffer = await fileGenerator('image');
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenStudentOne}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('files', fileBuffer, 'fake-image.png');
            
            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(6);
            expect(resGetUser.image.length).toBe(1);
            expect(resGetUser.image[0].imageId).toBe(2);
        });

        test('should update the user information update profile picture with idImage', async() => {
            const res = await request.patch('/api/v1/user')
                .set('Authorization', `Bearer ${tokenAdministrator}`)
                .send({
                    idNewImage: '2'
                });
            expect(res.statusCode).toBe(200);
            const resGetUser = await getUser(1);
            expect(resGetUser.image.length).toBe(1);
            expect(resGetUser.image[0].imageId).toBe(2);
        });
    });
})