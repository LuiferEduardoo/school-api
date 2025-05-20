const Redis = require('ioredis-mock');
const {setRedisInstance, getTokens} = require('../../../../config/redisConfigToken');

let redisClient;

beforeAll(async() => {
    redisClient = new Redis();
    setRedisInstance(redisClient);
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

describe('Integration Tests for Auth', () => {

    let tokenRefresh;
    let tokenAccess;

    describe('should generate a token on login', () => {
        describe('should throw an error when logging in', () => {
            test('should throw an error if email or password doesnt match', async() => {
                const res = await request
                    .post('/api/v1/auth/login')
                    .send({
                        credential: 'userdoesnotexist@test.com',
                        password: 'passworUserDoesnotExist'
                    });
                expect(res.statusCode).toBe(401);
                expect(res.body.message).toBe('Contraseña o correo incorrecto');
            });

            test('should throw an error if user is inactive', async() => {
                const res = await request
                    .post('/api/v1/auth/login')
                    .send({
                        credential: 'userinactive@test.com',
                        password: 'passworUserInactive'
                    });
                expect(res.statusCode).toBe(401);
                expect(res.body.message).toBe('Usuario inactivo');
            })
        })

        describe('should log in', () => {
            test('should log in with email', async () => {
                const res = await request
                    .post('/api/v1/auth/login')
                    .send({
                        credential: 'administrador@test.com',
                        password: 'passwordAdministrador'
                    });
        
                tokenAccess = res.body.tokenAccess.token;
                tokenRefresh = res.body.tokenRefresh.token;
        
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBe('Inicio de sesión exitoso');
                expect(res.body.tokenAccess.expiresIn).toBe('8h');
                expect(res.body.tokenAccess.token).not.toBeNull();
                expect(res.body.tokenRefresh.expiresIn).toBe('180d');
                expect(res.body.tokenRefresh.token).not.toBeNull();
            }, 40000);
    
            test('should log in with username', async() => {
                const res = await request
                    .post('/api/v1/auth/login')
                    .send({
                        credential: 'usernameAdministrador',
                        password: 'passwordAdministrador'
                    });
        
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBe('Inicio de sesión exitoso');
                expect(res.body.tokenAccess.expiresIn).toBe('8h');
                expect(res.body.tokenAccess.token).not.toBeNull();
                expect(res.body.tokenRefresh.expiresIn).toBe('180d');
                expect(res.body.tokenRefresh.token).not.toBeNull();
            })
        })
    
        describe('should generate a tokenAccess', () => {
            test ('should throw an error when generate a tokenAccess without token Refresh', async() => {
                const res = await request
                    .post('/api/v1/auth/token-access')
                    expect(res.statusCode).toBe(401);
            }, 40000);
    
            test('should throw an error when generate a tokenAccess when token Refresh is invalid', async () => {
                const res = await request
                    .post('/api/v1/auth/token-access')
                    .set('Authorization', `Bearer tokenRefresh`);
                expect(res.statusCode).toBe(401);
            }, 40000);

            test('should generate a tokenAccess', async () => {
                const res = await request
                    .post('/api/v1/auth/token-access')
                    .set('Authorization', `Bearer ${tokenRefresh}`);
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBe('Token creado con exito');
                expect(res.body.tokenAccess.expiresIn).toBe('8h');
                expect(res.body.tokenAccess.token).not.toBeNull();
            }, 40000);
        });

        describe('should log out', () => {
            test('should throw an erro when log out without to the token access', async () => {
                const res = await request
                    .post('/api/v1/auth/log-out')
                expect(res.statusCode).toBe(401);
            });

            test('should throw an erro when log out if the token access is invalid', async () => {
                const res = await request
                    .post('/api/v1/auth/log-out')
                    .set('Authorization', `Bearer tokenAccess`);
                expect(res.statusCode).toBe(401);
            });

            test('should log out', async () => {
                const res = await request
                    .post('/api/v1/auth/log-out')
                    .set('Authorization', `Bearer ${tokenAccess}`);
                const tokenAccessInRedis = await getTokens(`access1${tokenAccess}`);
                const tokenRefreshInRedis = await getTokens(`refresh1`);
                expect(res.statusCode).toBe(200);
                expect(res.body.message).toBe('Sesión cerrada con exito');
                expect(tokenAccessInRedis.length).toBe(0);
            })
        })
    })
});