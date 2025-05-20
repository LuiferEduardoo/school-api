require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    pathToUploads: process.env.PATH_TO_UPLOADS,
    port: process.env.PORT || 3000,
    dbUser:  process.env.DB_USER,
    dbPassword:  process.env.DB_PASSWORD,
    dbHost:  process.env.DB_HOST,
    dbName:  process.env.DB_NAME,
    dbPort:  process.env.DB_PORT,
    dbTestPort:  process.env.DB_TEST_PORT,
    dbTestUser: process.env.DB_TEST_USER,
    dbTestPassword: process.env.DB_TEST_PASSWORD,
    dbTestName: process.env.DB_TEST_NAME,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisUser: process.env.REDIS_USER,
    redisPassword: process.env.REDIS_PASSWORD,
    apiKey: process.env.API_KEY,
    jwtSecretRecoveryPassword: process.env.JWT_SECRET_RECOVERY_PASSWORD,
    jwtSecretRefreshToren: process.env.JWT_SECRET_REFRESH_TOKEN,
    jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    defaultUserName: process.env.DEFAULT_USER_NAME,
    defaultUserLastName: process.env.DEFAULT_USER_LASTNAME,
    defaultUserEmail: process.env.DEFAULT_USER_EMAIL,
    defaultUserUserUsername: process.env.DEFAULT_USER_USERNAME,
    defaultUserPassword: process.env.DEFAULT_USER_PASSWORD,
    frontendUrl: process.env.FRONTEND_URL,
    emailAdmission: process.env.EMAIL_ADMISSION,
    emailChangePassword: process.env.EMAIL_CHANGE_PASSWORD
}

module.exports = { config };