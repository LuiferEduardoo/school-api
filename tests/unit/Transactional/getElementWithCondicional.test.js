const boom = require('@hapi/boom');
const Transactional = require('../../../services/Transactional.service');
const { sequelize } = require('../../../libs/sequelize');

const clasification = sequelize.models.Clasification;

beforeAll(async () => {
    await sequelize.sync();

    await clasification.create({ name: 'Element 1' });
    await clasification.create({ name: 'Element 2' });
});

afterAll(async () => {
    await sequelize.close();
});

describe('getElementById', () => {
    let transactionalService;

    beforeEach(async () => {
        transactionalService = new Transactional();
    });

    test('should thorow error not found model', async () => {
        await expect(
            transactionalService.getElementWithCondicional('ModelExample', null, null, null, null, {})
        ).rejects.toThrow();
    });

    test('should return an element', async () => {

        const result = await transactionalService.getElementWithCondicional('Clasification', null, {id: 1}, null, null, {});
        expect(result.name).toBe('Element 1');
    });

    test('should throw error notFound', async() => {
        await expect(
            transactionalService.getElementWithCondicional('Clasification', null, {id: 102}, null, null, {})
        ).rejects.toThrow(boom.notFound('no encontrado'));
    });

    test('should throw error unauthorized', async() => {
        await expect(
            transactionalService.getElementWithCondicional('Clasification', null, {id: 102}, null, null, {}, 'unauthorized', 'unauthorized in aplication')
        ).rejects.toThrow(boom.unauthorized('unauthorized in aplication'));
    })

});