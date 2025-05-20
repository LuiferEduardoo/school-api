const { sequelize } = require('../libs/sequelize')

jest.mock('../libs/sequelize', () => require('./unit/mock/sequelize'));

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

global.request = sequelize;