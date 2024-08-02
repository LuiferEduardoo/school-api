const boom = require('@hapi/boom');
const Transactional = require('../../../services/Transactional.service');


describe('queryParameterPagination', () => {
    let transactionalService;

    beforeEach(() => {
        transactionalService = new Transactional();
    });

    test('should return the correct limit and offset', () => {
        const query = { limit: 5, offset: 10 };
        const result = transactionalService.queryParameterPagination(query);
        expect(result.limit).toBe(5);
        expect(result.offset).toBe(50);
    });

    test('should return default limit and offset when not provided', () => {
        const query = {};
        const result = transactionalService.queryParameterPagination(query);
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(0);
    });
});