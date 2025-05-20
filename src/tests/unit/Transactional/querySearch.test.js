const { Op } = require('sequelize');
const Transactional = require('../../../services/Transactional.service');

describe('querySearch', () => {
    let transactionalService;

    beforeEach(() => {
        transactionalService = new Transactional();
    });

    test('should add search conditions to where clause', () => {
        const filter = ['name', 'description'];
        const query = 'test query';
        const where = {};

        transactionalService.querySearch(filter, query, where);

        expect(where[Op.and]).toBeDefined();
        expect(where[Op.and].length).toBe(2);
    });
});