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

    test('should thorow error not found model', async () => {
        await expect(
            transactionalService.getAllElementsWithoutQuery('ModelExample')
        ).rejects.toThrow();
    });

    test('should return all elements without query', async () => {
        const result = await transactionalService.getAllElementsWithoutQuery('Clasification');
        expect(result.length).toBe(2);
    });
});