const boom = require('@hapi/boom');
const Transactional = require('../../../services/Transactional.service');
const { sequelize } = require('../../../libs/sequelize');

const clasification = sequelize.models.Clasification;

beforeAll(async () => {
    await clasification.create({ name: 'Element 1' });
    await clasification.create({ name: 'Element 2' });
});

describe('getElementById', () => {
    let transactionalService;

    beforeEach(async () => {
        transactionalService = new Transactional();
    });

    test('should return all elements with pagination', async () => {

        const resultOne = await transactionalService.getAllElements('Clasification', null, null, null, { limit: 1, offset: 0 });

        expect(resultOne.totalPages).toBe(2);
        expect(resultOne.elements.length).toBe(1);
    });
});