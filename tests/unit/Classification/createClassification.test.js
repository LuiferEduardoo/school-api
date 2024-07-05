const { sequelize } = require('../../../libs/sequelize');
const boom = require('@hapi/boom');
const Classification = require('../../../services/classification.service');

// Sincronización del modelo con la base de datos en memoria
beforeAll(async () => {
    await sequelize.sync();
});

// Desconectar Sequelize después de todas las pruebas
afterAll(async () => {
    await sequelize.close();
});

describe('Classification Service', () => {
    let classificationService;

    beforeEach(() => {
        classificationService = new Classification();
    });

    describe('createClassification', () => {
        test('should throw notFound error if it has no name', async () => {
            await expect(classificationService.createClassification()).rejects.toThrow('WHERE parameter \"name\" has invalid \"undefined\" value');
        });
        test('should create and return the classification', async () => {
            const result = await classificationService.createClassification('Test');

            expect(result.name).toBe('Test');
        });
    });
});