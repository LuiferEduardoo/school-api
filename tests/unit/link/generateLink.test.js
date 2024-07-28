const { sequelize } = require('../../../libs/sequelize');
const generateLink = require('../../../utils/manipulation/link');
const slugify = require('slugify');
const { faker } = require('@faker-js/faker');

const Publications = sequelize.models.Publications;

afterAll(async () => {
    const MockCleanAndLowercase = jest.fn((input) => input.toLowerCase());
    jest.mock('../../../utils/manipulation/cleanAndLowercase', () => MockCleanAndLowercase);
    jest.spyOn(slugify, 'default').mockReturnValueOnce('test-publication-title');
});

describe('generateLink', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createClassification', () => {
        test('generates a unique link based on title', async () => {
            const result = await generateLink('Test Publication Title', 'Publications', sequelize);
            expect(result).toBe('test-publication-title');
        });

        test('handles duplicate links by appending a counter', async () => {
            await Publications.create({
                title: faker.commerce.productName(),
                content: faker.commerce.productDescription(),
                link: 'test-publication-title',
                reading_time: "00:01:00"
            });
            const result = await generateLink('Test Publication Title', 'Publications', sequelize);
            expect(result).toBe('test-publication-title-1');
        })

        test('handles duplicate links by appending a counter', async () => {
            await Publications.create({
                title: faker.commerce.productName(),
                content: faker.commerce.productDescription(),
                link: 'test-publication-title-1',
                reading_time: "00:01:00"
            });
            const result = await generateLink('Test Publication Title', 'Publications', sequelize);
            expect(result).toBe('test-publication-title-2');
        })
    });
});