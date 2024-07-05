const { sequelize } = require('../../../libs/sequelize');
const boom = require('@hapi/boom');
const Classification = require('../../../services/classification.service');

const Clasification = sequelize.models.Clasification;

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

    describe('deleteClassification', () => {
        it('should delete the classification if it exists', async () => {
            const classification = await Clasification.create({ name: 'Test' });

            await classificationService.deleteClassification(classification.id);

            const deletedClassification = await Clasification.findByPk(classification.id);
            expect(deletedClassification).toBeNull();
        });

        it('should not throw error if classification does not exist', async () => {
            await expect(classificationService.deleteClassification(1)).resolves.not.toThrow();
        });
    });
});