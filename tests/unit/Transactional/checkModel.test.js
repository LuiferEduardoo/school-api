const boom = require('@hapi/boom');
const Transactional = require('../../../services/Transactional.service');
const { sequelize } = require('../../../libs/sequelize');

const Publications = sequelize.models.Publications;

describe('checkModel', () => {
    let transactionalService;

    beforeEach(async () => {
        transactionalService = new Transactional();
    });

    test('should throw error if model is not defined', async () => {
        await expect(
            transactionalService.checkModel('NonExistentModel', 'NonExistentModel')
        ).rejects.toThrow(boom.notFound('NonExistentModel no existe'));
    });

    test('should not throw error if model is defined', async () => {
        await expect(
            transactionalService.checkModel('Publications', 'Publications')
        ).resolves.not.toThrow();
    });
});