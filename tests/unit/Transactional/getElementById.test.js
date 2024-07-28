const boom = require('@hapi/boom');
const Transactional = require('../../../services/Transactional.service');
const { sequelize } = require('../../../libs/sequelize');

const Publications = sequelize.models.Publications;

describe('getElementById', () => {
    let transactionalService;

    beforeEach(async () => {
        transactionalService = new Transactional();
    });

    test('should return element by ID', async () => {
        const newElement = await Publications.create({
            title: 'test publication title',
            content: 'test publication content',
            link: 'test-publication-title',
            reading_time: "00:01:00"
        });
        const element = await transactionalService.getElementById(newElement.id, 'Publications');
        expect(element.id).toBe(newElement.id);
    });

    test('should throw not found error if element does not exist', async () => {
        await expect(
            transactionalService.getElementById(999, 'Publications')
        ).rejects.toThrow(boom.notFound('Publications no encontrado'));
    });
});