const { sequelize } = require('../../../libs/sequelize');
const boom = require('@hapi/boom');
const Classification = require('../../../services/classification.service');

const Clasification = sequelize.models.Clasification;
const Categories = sequelize.models.Categories;
const Subcategories = sequelize.models.Subcategories;
const Tags = sequelize.models.Tags;


beforeAll(async () => {
    await sequelize.sync();
});

afterAll(async () => {
    await sequelize.close();
});

describe('getClassification', () => {
    
    let classificationService;
    
    beforeEach(() => {
        classificationService = new Classification();
    });

    test('should throw notFound error if classification not found', async () => {
        await expect(classificationService.getClassification('Categories', 1)).rejects.toThrow('Clasificación no encontrada');
    });
    
    test('should throw notFound error if classification not found', async () => {
        await expect(classificationService.getClassification('Subcategories', 1)).rejects.toThrow('Clasificación no encontrada');
    });

    test('should throw notFound error if classification not found', async () => {
        await expect(classificationService.getClassification('Subcategories', 1)).rejects.toThrow('Clasificación no encontrada');
    });

    test('should throw notFound error if classification not found', async () => {
        await expect(classificationService.getClassification('Tags', 1)).rejects.toThrow('Clasificación no encontrada');
    });

    test('should return classification if found in Categories', async () => {
        const classification = await Clasification.create({ name: 'Test' });
        const classificationCategories = await Categories.create({clasificationId: classification.id})
        const result = await classificationService.getClassification('Categories', classificationCategories.id);
        expect(result.clasificationId).toBe(classification.id);
    });

    test('should return classification if found in Subcategories', async () => {
        const classification = await Clasification.create({ name: 'Test 2' });
        const classificationSubcategories = await Subcategories.create({clasificationId: classification.id})
        const result = await classificationService.getClassification('Subcategories', classificationSubcategories.id);
        expect(result.clasificationId).toBe(classification.id);
    });

    test('should return classification if found in Tags', async () => {
        const classification = await Clasification.create({ name: 'Test 3' });
        const classificationTags = await Tags.create({clasificationId: classification.id})
        const result = await classificationService.getClassification('Tags', classificationTags.id);
        expect(result.clasificationId).toBe(classification.id);
    });
});