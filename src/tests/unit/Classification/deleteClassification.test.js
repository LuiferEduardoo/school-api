const { sequelize } = require('../../../libs/sequelize');
const Classification = require('../../../services/classification.service');

const Clasification = sequelize.models.Clasification;

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