const app = require('../server');

let server;

beforeAll(async () => {
    server = app.listen(3001, () => {});
});

afterAll(async () => {
    server.close();
});

global.request = require('supertest')(app);