const Transactional = require('../../../services/Transactional.service');

describe('querySearch', () => {
    let transactionalService;

    beforeEach(async () => {
        transactionalService = new Transactional();
    });

    test('should commit transaction on success', async () => {
        const result = await transactionalService.withTransaction(async (transaction) => {
          // Lógica de la transacción
            return 'success';
        });

        expect(result).toBe('success');
    });

    test('should rollback transaction on error', async () => {
        await expect(
            transactionalService.withTransaction(async (transaction) => {
                throw new Error('Test Error');
            })
        ).rejects.toThrow('Test Error');
    });
});