const { sequelize } = require('../../../libs/sequelize');
const Classification = require('../../../services/classification.service');

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